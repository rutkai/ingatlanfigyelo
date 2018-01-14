const Raven = require('raven');
const {URL} = require('url');
const worker = require('./worker/worker');
const fs = require('fs');
const env = require('../env/env');

const duplication = require('./duplication');
const estates = require('../db/estate');
const estateRepository = require('../repository/estate');

const logPath = __dirname + '/../var/log/polling.log';

class Updater {
    constructor(provider) {
        this.estates = [];
        this.provider = provider;
        this.log = (entry) => {
            let data = '[' + new Date().toISOString() + '] [' + this.provider.name + ']: ' + entry + '\n';
            fs.appendFile(logPath, data, err => {
                if (err) {
                    Raven.captureException(err);
                }
            });
        };
    }

    update(onReady) {
        this.onReady = onReady;
        this.page = 1;
        this.updateNextIndexPage(this.provider.indexPage);
    }

    updateNextIndexPage(page) {
        const normalizedPageUrl = this.normalizeUrl(page);
        this.log(`Reading index (page ${this.page}): ${normalizedPageUrl}`);
        worker.fetchContent(normalizedPageUrl, this.provider.name)
            .then(response => {
                const listData = this.provider.parser.parseList(response);
                setTimeout(() => {
                    if (listData.nextList && env.isProd() && this.page < this.provider.maxPages) {
                        this.page += 1;
                        this.updateNextIndexPage(listData.nextList);
                    } else {
                        if (this.page >= this.provider.maxPages) {
                            this.log('Max page limit reached!');
                        }
                        this.log(`Finished reading index on ${this.provider.name}`);
                        this.dequeueEstate();
                    }
                }, this.provider.interval);

                for (const profile of listData.profiles) {
                    this.doUpdateEstate(profile)
                        .then(update => {
                            if (update) {
                                this.estates.push(profile);
                            }
                        });
                }
            })
            .catch(error => {
                console.error(`Error during fetching/parsing index page on ${this.provider.name}, URL: ${normalizedPageUrl}`);
                console.error(error);
                Raven.captureException(error);
                this.onReady(error);
            });
    }

    dequeueEstate() {
        if (!this.estates.length) {
            this.onReady();
            return;
        }

        const url = this.normalizeUrl(this.estates.pop().url);
        this.log('Reading profile: ' + url);
        worker.fetchContent(url, this.provider.name)
            .then(response => {
                return this.provider.parser.parseProfile(response);
            })
            .then(async profileData => {
                if (!this.isProfileDataValid(profileData)) {
                    this.log('Invalid profile, cannot parse properly: ' + url);
                    return null;
                }

                profileData.url = url;
                profileData.source = this.provider.name;
                profileData.squareMeterPrice = Math.round(profileData.price / profileData.size);

                let estate = await estateRepository.get({url});
                if (estate) {
                    estate.version = estates.version;
                    Object.assign(estate, profileData);
                    return estate;
                }
                if (estate = await estateRepository.get({urls: {[this.provider.name]: url}})) {
                    // This is a duplicate estate, no update for duplicates - for now
                    return estate;
                }
                if (estate = await duplication.isDuplicate(profileData)) {
                    estate.urls[this.provider.name] = url;
                    if (estate.price > profileData.price) {
                        estate.price = profileData.price;
                        estate.source = this.provider.name;
                        estate.url = url;
                    }
                    return estate;
                }

                profileData.urls = {
                    [this.provider.name]: url
                };
                return profileData;
            })
            .then(estate => {
                if (estate) {
                    estateRepository.save(estate);
                }

                if (this.estates.length) {
                    setTimeout(() => {
                        this.dequeueEstate();
                    }, this.provider.interval);
                } else {
                    this.onReady();
                }
            })
            .catch(error => {
                console.error(`Error during fetching/parsing estate on ${this.provider.name}, URL: ${url}`);
                console.error(error);
                Raven.context(function () {
                    Raven.setContext({
                        url
                    });
                    Raven.captureException(error);
                });
                this.dequeueEstate();
            });
    }

    normalizeUrl(str) {
        if (str.startsWith("http")) {
            return str;
        }

        const url = new URL(str, this.provider.baseUrl);
        return url.href;
    }

    isProfileDataValid(profileData) {
        return profileData.district &&
            profileData.size &&
            profileData.rooms &&
            profileData.price;
    }

    async doUpdateEstate(profile) {
        // No update for now
        const normUrl = this.normalizeUrl(profile.url);
        let estate = await estateRepository.get({url: normUrl});
        if (estate) {
            return estate.version !== estates.version;
        }

        estate = await estateRepository.get({urls: {[this.provider.name]: normUrl}});
        if (estate) {
            // This is a duplicate, no update for duplicates - for now
            return false;
        }

        return true;
    }
}

exports.Updater = Updater;

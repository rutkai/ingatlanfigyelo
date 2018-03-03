const Raven = require('raven');
const {URL} = require('url');
const worker = require('./worker/worker');
const env = require('../env/env');

const duplication = require('./duplication');
const estates = require('../db/estate');
const estateRepository = require('../repository/estate');

class Updater {
    constructor(provider) {
        this.estates = [];
        this.provider = provider;
        this.log = (entry) => {
            let data = '[' + new Date().toISOString() + '] [' + this.provider.name + ']: ' + entry + '\n';
            console.log(data);
        };
    }

    update(onReady) {
        this.onReady = onReady;
        this.page = 1;
        return this.updateNextIndexPage(this.provider.indexPage);
    }

    async updateNextIndexPage(page) {
        const normalizedPageUrl = this.normalizeUrl(page);
        this.log(`Reading index (page ${this.page}): ${normalizedPageUrl}`);

        try {
            const response = await worker.fetchContent(normalizedPageUrl, this.provider);
            const listData = this.provider.parser.parseList(response);

            setTimeout(() => {
                if (listData.nextList && env.isProd() && this.page < this.provider.maxPages) {
                    this.page += 1;
                    return this.updateNextIndexPage(listData.nextList);
                } else {
                    if (this.page >= this.provider.maxPages) {
                        this.log('Max page limit reached!');
                    }
                    this.log(`Finished reading index on ${this.provider.name}`);
                    return this.dequeueEstate();
                }
            }, this.provider.interval);

            for (const profile of listData.profiles) {
                if (await this.doUpdateEstate(profile)) {
                    this.estates.push(profile);
                }
            }
        } catch (error) {
            Raven.captureException(error);
            this.onReady(error);
        }
    }

    async dequeueEstate() {
        if (!this.estates.length) {
            this.onReady();
            return;
        }

        const url = this.normalizeUrl(this.estates.pop().url);
        this.log('Reading profile: ' + url);

        try {
            const response = await worker.fetchContent(url, this.provider);
            const profileData = await this.provider.parser.parseProfile(response);

            if (!this.isProfileDataValid(profileData)) {
                Raven.captureMessage('Invalid profile', {
                    level: 'warning',
                    tags: {submodule: 'updater'},
                    extra: {
                        url,
                        profileData
                    }
                });
                return;
            }

            profileData.url = url;
            profileData.source = this.provider.name;
            profileData.squareMeterPrice = Math.round(profileData.price / profileData.size);

            let estate = await estateRepository.get({url});
            if (estate) {
                estate.version = estates.version;
                Object.assign(estate, profileData);
            } else if (estate = await estateRepository.get({urls: {[this.provider.name]: url}})) {
                // This is a duplicate estate, no update for duplicates - for now
            } else if (estate = await duplication.isDuplicate(profileData)) {
                estate.urls[this.provider.name] = url;
                if (estate.price > profileData.price) {
                    estate.price = profileData.price;
                    estate.source = this.provider.name;
                    estate.url = url;
                }
                for (let attr of Object.keys(profileData)) {
                    if (estate[attr] === null && profileData[attr] !== null) {
                        estate[attr] = profileData[attr];
                    }
                }
            } else {
                profileData.urls = {
                    [this.provider.name]: url
                };
                estate = profileData;
            }

            if (estate) {
                estateRepository.save(estate);
            }

            if (this.estates.length) {
                setTimeout(() => {
                    return this.dequeueEstate();
                }, this.provider.interval);
            } else {
                this.onReady();
            }
        } catch (err) {
            console.error(`Error during fetching/parsing estate on ${this.provider.name}, URL: ${url}`);
            console.error(error);
            Raven.context(function () {
                Raven.setContext({
                    url
                });
                Raven.captureException(error);
            });
            return this.dequeueEstate();
        }
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

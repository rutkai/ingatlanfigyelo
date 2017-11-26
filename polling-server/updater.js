const Raven = require('raven');
const {URL} = require('url');
const got = require('got');
const fs = require('fs');
const env = require('../env/env');

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
        this.updateNextIndexPage(this.provider.indexPage);
    }

    updateNextIndexPage(page) {
        this.log('Reading index: ' + page);
        got(this.normalizeUrl(page))
            .then(response => {
                const listData = this.provider.parser.parseList(response.body);
                setTimeout(() => {
                    if (listData.nextList && env.isProd()) {
                        this.updateNextIndexPage(listData.nextList);
                    } else {
                        console.log('Finished reading index on ' + this.provider.name);
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
                console.error(`Error during fetching/parsing index page on ${this.provider.name}, URL: ${page}`);
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
        got(url)
            .then(response => {
                return this.provider.parser.parseProfile(response.body);
            })
            .then(profileData => {
                profileData.url = url;
                profileData.source = this.provider.name;
                profileData.squareMeterPrice = Math.round(profileData.price / profileData.size);

                return estateRepository.get({url})
                    .then(estate => {
                        if (estate) {
                            estate.version = estates.version;
                        } else {
                            estate = {};
                        }
                        Object.assign(estate, profileData);
                        return estate;
                    });
            })
            .then(estate => {
                estateRepository.save(estate);

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
                Raven.captureException(error);
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

    doUpdateEstate(profile) {
        // No update for now
        const normUrl = this.normalizeUrl(profile.url);
        return estateRepository.get({url: normUrl})
            .then(estate => {
                return !estate || estate.version !== estates.version;
            });
    }
}

exports.Updater = Updater;

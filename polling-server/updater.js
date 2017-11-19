const {URL} = require('url');
const got = require('got');
const env = require('../env/env');

const manager = require('../db/estateManager');
const estateRepository = require('../repository/estate');

class Updater {
    constructor(provider) {
        this.estates = [];
        this.provider = provider;
    }

    update(onReady) {
        this.onReady = onReady;
        this.updateNextIndexPage(this.provider.indexPage);
    }

    updateNextIndexPage(page) {
        got(this.normalizeUrl(page))
            .then(response => {
                const listData = this.provider.parser.parseList(response.body);
                setTimeout(() => {
                    if (listData.nextList && env.isProd()) {
                        this.updateNextIndexPage(listData.nextList);
                    } else {
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
                this.onReady();
            });
    }

    dequeueEstate() {
        if (!this.estates.length) {
            this.onReady();
            return;
        }

        const url = this.normalizeUrl(this.estates.pop().url);
        got(url)
            .then(response => {
                return this.provider.parser.parseProfile(response.body);
            })
            .then(profileData => {
                profileData.url = url;
                profileData.source = this.provider.name;
                profileData.squareMeterPrice = Math.round(profileData.price / profileData.size);
                estateRepository.save(profileData);

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
                return !estate || estate.version !== manager.version;
            });
    }
}

exports.Updater = Updater;

const got = require('got');
const Raven = require('raven');


class LocalWorker {
    constructor(config) {
        this._lastUsed = [];
        this.config = config;
        this.available = true;
    }

    name() {
        return 'local';
    }

    init() {
        return Promise.resolve();
    }

    fetchContent(url, provider) {
        this._lastUsed[provider] = new Date();

        return got(url, this.config.options)
            .then(response => {
                return response.body;
            })
            .catch(error => {
                if (error instanceof got.HTTPError) {
                    return "";
                }

                throw error;
            });
    }

    test() {
        this.available = false;
        return this.fetchContent("https://www.example.com/")
            .then(response => {
                this.available = !!response;
            })
            .catch(err => {
                console.log('Worker is unavailable: ' + this.name());
                Raven.captureException(err);
            });
    }

    isAvailable() {
        return this.available;
    }

    lastUsed(provider) {
        if (this._lastUsed[provider]) {
            return this._lastUsed[provider];
        }

        return new Date('2000-01-01');
    }
}

module.exports = LocalWorker;

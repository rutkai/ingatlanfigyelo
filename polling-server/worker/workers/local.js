const iconv = require('iconv-lite');
const charset = require('charset');
const got = require('got');
const Raven = require('raven');
const moment = require('moment');


class LocalWorker {
    constructor(config) {
        this._lastUsed = [];
        this.config = config;
        this.available = true;
    }

    name() {
        return 'local';
    }

    type() {
        return this.config.type;
    }

    init() {
        return Promise.resolve();
    }

    fetchContent(url, provider) {
        this._lastUsed[provider] = new Date();

        const options = Object.assign({}, this.config.options);
        return got(url, options).buffer()
            .then(response => {
                let encoding = charset(response.headers, response, 4096) || 'utf8';
                if (!iconv.encodingExists(encoding)) {
                    Raven.captureMessage(`Unknown character encoding ${encoding} while reading ${url}`);
                    encoding = 'utf8';
                }
                return iconv.decode(response, encoding ? encoding : 'utf8');
            })
            .catch(error => {
                if (error instanceof got.HTTPError) {
                    return "";
                }

                throw error;
            });
    }

    async test() {
        this.available = false;
        this.testing = true;

        try {
            const response = await this.fetchContent("https://www.example.com/");
            this.available = !!response;
        } catch (err) {
            console.log('Worker is unavailable: ' + this.name());
            Raven.captureException(err, {
                level: 'error',
                tags: {submodule: 'worker'},
                extra: {
                    workerName: this.name()
                }
            });
        }

        if (!this.available) {
            this.tested = new Date();
        }
        this.testing = false;
    }

    isAvailable() {
        if (!this.available && !this.testing && moment().subtract(8, 'hours').isAfter(this.tested)) {
            this.test();
        }

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

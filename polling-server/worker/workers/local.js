const iconv = require('iconv-lite');
const charset = require('charset');
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

    type() {
        return this.config.type;
    }

    init() {
        return Promise.resolve();
    }

    fetchContent(url, provider) {
        this._lastUsed[provider] = new Date();

        const options = Object.assign({}, this.config.options, {encoding: null});
        return got(url, options)
            .then(response => {
                let encoding = charset(response.headers, response.body, 4096) || 'utf8';
                if (!iconv.encodingExists(encoding)) {
                    Raven.captureMessage(`Unknown character encoding ${encoding} while reading ${url}`);
                    encoding = 'utf8';
                }
                return iconv.decode(response.body, encoding ? encoding : 'utf8');
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

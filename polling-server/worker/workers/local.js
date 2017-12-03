const got = require('got');


class LocalWorker {
    constructor(config) {
        this._lastUsed = new Date();
        this.config = config;
    }

    init() {
        return Promise.resolve();
    }

    fetchContent(url) {
        console.log(url);
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
        return Promise.resolve();
    }

    isAvailable() {
        return true;
    }

    get lastUsed() {
        return this._lastUsed;
    }
}

module.exports = LocalWorker;

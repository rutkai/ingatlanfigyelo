const got = require('got');


class AwsLambdaWorker {
    constructor(config) {
        this._lastUsed = new Date();
        this.config = config;
        this.available = true;
    }

    init() {
        return Promise.resolve();
    }

    fetchContent(url) {
        this._lastUsed = new Date();

        const body = {url};
        return got(this.config.endpoint, {body, json: true})
            .then(response => {
                return response.body.data;
            });
    }

    test() {
        this.available = false;
        return this.fetchContent("https://www.google.com/")
            .then(response => {
                this.available = !!response;
            });
    }

    isAvailable() {
        return this.available;
    }

    get lastUsed() {
        return this._lastUsed;
    }
}

module.exports = AwsLambdaWorker;

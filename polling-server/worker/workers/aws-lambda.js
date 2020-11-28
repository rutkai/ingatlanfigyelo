const got = require('got');
const LocalWorker = require('./local');


class AwsLambdaWorker extends LocalWorker {
    name() {
        return 'AWS - ' + this.config.region;
    }

    fetchContent(url, provider) {
        this._lastUsed[provider] = new Date();

        const body = {url};
        const options = {body, json: true};
        if (this.config.apikey) {
            options["headers"] = {
                "accept": "application/json",
                "content-type": "application/json",
                "x-api-key": this.config.apikey
            };
        }

        return got(this.config.endpoint, options)
            .then(response => {
                return response.body;
            });
    }
}

module.exports = AwsLambdaWorker;

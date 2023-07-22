const got = require('got');
const LocalWorker = require('./local');

class AzureFunctionWorker extends LocalWorker {
    name() {
        return 'Azure - ' + this.config.region;
    }

    fetchContent(url, provider) {
        this._lastUsed[provider] = new Date();

        const body = {url};
        const options = {
            body,
            headers: {
                "accept": "application/json",
                "content-type": "application/json"
            },
            json: true
        };

        return got(this.config.endpoint, options)
            .then(response => {
                return response.body;
            });
    }
}

module.exports = AzureFunctionWorker;
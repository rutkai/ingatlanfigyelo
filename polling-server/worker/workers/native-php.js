const got = require('got');
const LocalWorker = require('./local');


class NativePhpWorker extends LocalWorker {
    name() {
        return 'PHP - ' + this.config.endpoint;
    }

    fetchContent(url, provider) {
        this._lastUsed[provider] = new Date();

        const body = {
            token: this.config.token,
            url
        };
        return got(this.config.endpoint, {body, json: true})
            .then(response => {
                return response.body;
            });
    }
}

module.exports = NativePhpWorker;

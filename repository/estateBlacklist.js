const moment = require('moment');
const estateBlacklist = require('../db/estateBlacklist');

const expiration = {hours: 12};

exports.cleanup = cleanup;
async function cleanup() {
    return estateBlacklist.remove({
        created: { "$lt": moment.subtract(expiration) }
    });
}

exports.add = add;
async function add(url) {
    if (!await estateBlacklist.has(url)) {
        return estateBlacklist.save({
            url
        });
    }

    return Promise.resolve();
}

exports.onBlacklist = onBlacklist;
function onBlacklist(url) {
    return estateBlacklist.has(url);
}

const db = require('./db');

const version = 1;
exports.version = version;

exports.checkIndices = checkIndices;
function checkIndices() {
    return db.getCollection('estateBlacklist').createIndex({
        url: 1
    });
}

exports.migrate = migrate;
async function migrate() {
    return Promise.resolve();
}

exports.get = get;
function get(filter) {
    return db.getCollection('estateBlacklist').findOne(filter);
}

exports.save = save;
function save(record) {
    record.updated = new Date();

    if (record.created) {
        return db.getCollection('estateBlacklist').replaceOne({url: record.url}, record);
    }

    record.created = new Date();
    record.version = version;
    return db.getCollection('estateBlacklist').insertOne(record);
}

exports.has = has;
function has(url) {
    return db.getCollection('estateBlacklist').count({url});
}

exports.remove = remove;
function remove(filter) {
    return db.getCollection('estateBlacklist').remove(filter);
}

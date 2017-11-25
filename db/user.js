const db = require('./db');

const version = '1.0.0';
exports.version = version;

exports.checkIndices = checkIndices;
function checkIndices() {
    return db.getCollection('users').createIndex({
        username: 1
    });
}

exports.get = get;
function get(filter) {
    return db.getCollection('users').findOne(filter);
}

exports.save = save;
function save(record) {
    record.updated = new Date();

    if (record.created) {
        return db.getCollection('users').updateOne({username: record.username}, record);
    }

    record.created = new Date();
    record.version = version;
    return db.getCollection('users').insertOne(record);
}

exports.has = has;
function has(username) {
    return db.getCollection('users').count({username});
}

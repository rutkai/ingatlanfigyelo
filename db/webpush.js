const db = require('./db');

const version = '1.0.0';
exports.version = version;

exports.getAll = getAll;
function getAll() {
    return db.getCollection('webpush').find({}).toArray();
}

exports.save = save;
function save(record) {
    record.updated = new Date();
    record.created = new Date();
    record.version = version;
    return db.getCollection('webpush').insertOne(record);
}

exports.remove = remove;
function remove(username) {
    return db.getCollection('webpush').deleteOne({username});
}

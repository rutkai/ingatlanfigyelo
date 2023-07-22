const db = require('./db');

const version = 2;
exports.version = version;

exports.migrate = migrate;
async function migrate() {
    await db.getCollection('webpush').updateMany({version: '1.0.0'}, {
        $set: {
            version: 2
        }
    }, {multi: true});
}

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

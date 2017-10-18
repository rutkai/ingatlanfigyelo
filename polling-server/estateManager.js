const db = require('../db/db');

const estateVersion = '1.0.0';

exports.save = save;
function save(estate) {
    const record = Object.assign({}, estate);
    record.updated = new Date();

    if (record.created) {
        return db.getCollection('estates').updateOne({url: record.url}, record)
    }

    record.created = new Date();
    record.version = estateVersion;
    return db.getCollection('estates').insertOne(record);
}

exports.has = has;
function has(url) {
    return db.getCollection('estates').count({url});
}

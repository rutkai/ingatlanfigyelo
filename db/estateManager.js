const db = require('./db');

const estateVersion = '1.0.0';

exports.getMany = getMany;
function getMany(filter = {}, from = 0, number = 5) {
    return db.getCollection('estates').find(filter).skip(from).limit(number).toArray();
}

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

const db = require('./db');

const version = '1.1.0';
exports.version = version;

exports.checkIndices = checkIndices;
function checkIndices() {
    return db.getCollection('estates').createIndex({
        updated: -1
    });
}

exports.migrate = migrate;
function migrate() {
    return Promise.resolve();
}

exports.get = get;
function get(filter = {}) {
    return db.getCollection('estates').findOne(filter);
}

exports.getMany = getMany;
function getMany(filter = {}, from = 0, number = 3) {
    return db.getCollection('estates').find(filter).sort({updated: -1}).skip(from).limit(number).toArray();
}

exports.save = save;
function save(record) {
    if (record.created) {
        return checkVersionBump(record)
            .then(wasBump => {
                if (!wasBump) {
                    record.updated = new Date();
                }
                return db.getCollection('estates').updateOne({url: record.url}, record);
            });
    }

    record.created = new Date();
    record.updated = new Date();
    record.version = version;
    return db.getCollection('estates').insertOne(record);
}

exports.has = has;
function has(url) {
    return db.getCollection('estates').count({url});
}


function checkVersionBump(record) {
    return db.getCollection('estates').count({_id: record._id, version: {"$ne": record.version}});
}

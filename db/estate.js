const db = require('./db');

const version = 4;
exports.version = version;

exports.checkIndices = checkIndices;
async function checkIndices() {
    await db.getCollection('estates').createIndex({
        url: 1
    });
    await db.getCollection('estates').createIndex({
        urls: 1
    });
    await db.getCollection('estates').createIndex({
        updated: -1
    });
    await db.getCollection('estates').createIndex({
        created: -1
    });
    await db.getCollection('estates').createIndex({
        city: 1,
        district: 1,
        size: 1,
        updated: 1,
    });
    await db.getCollection('estates').createIndex({
        city: 1,
        district: 1,
        price: 1,
        updated: 1,
    });
}

exports.migrate = migrate;
async function migrate() {
    await db.getCollection('estates').updateMany({version: '1.1.0', source: 'Ingatlan.com'}, {
        $set: {
            source: 'Ingatlancom'
        }
    }, {multi: true});
    await db.getCollection('estates').find({version: '1.1.0'}).forEach(async estate => {
        await db.getCollection('estates').update({_id: estate._id}, {
            $set: {
                urls: {[estate.source]: estate.url},
                version: '1.2.0'
            }
        });
    });
    await db.getCollection('estates').updateMany({version: '1.2.0'}, {
        $set: {
            material: null,
            version: '1.3.0'
        }
    }, {multi: true});
    await db.getCollection('estates').updateMany({version: '1.3.0'}, {
        $set: {
            version: 4
        }
    }, {multi: true});
    await db.getCollection('estates').updateMany({version: 4}, {
        $set: {
            city: 'Budapest',
            region: 'Budapest',
            version: 5
        }
    }, {multi: true});
}

exports.get = get;
function get(filter = {}) {
    return db.getCollection('estates').findOne(filter);
}

exports.count = count;
function count(filter = {}) {
    return db.getCollection('estates').countDocuments(filter);
}

exports.getMany = getMany;
function getMany(filter = {}) {
    return db.getCollection('estates').find(filter);
}

exports.save = save;
function save(record) {
    if (record.created) {
        record.updated = new Date();
        return db.getCollection('estates').replaceOne({url: record.url}, record);
    }

    record.created = new Date();
    record.updated = new Date();
    record.version = version;
    return db.getCollection('estates').insertOne(record);
}

exports.has = has;
function has(url) {
    return db.getCollection('estates').countDocuments({url});
}

exports.getFieldValues = getFieldValues;
function getFieldValues(field) {
    return db.getCollection('estates').distinct(field, {[field]: {"$nin": [null, NaN]}});
}

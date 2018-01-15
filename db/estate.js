const db = require('./db');

const version = '1.2.0';
exports.version = version;

exports.checkIndices = checkIndices;
async function checkIndices() {
    await db.getCollection('estates').createIndex({
        updated: -1
    });
    await db.getCollection('estates').createIndex({
        created: -1
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
}

exports.get = get;
function get(filter = {}) {
    return db.getCollection('estates').findOne(filter);
}

exports.count = count;
function count(filter = {}) {
    return db.getCollection('estates').count(filter);
}

exports.getMany = getMany;
function getMany(filter = {}) {
    return db.getCollection('estates').find(filter);
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

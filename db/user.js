const db = require('./db');

const version = 5;
exports.version = version;

exports.checkIndices = checkIndices;
function checkIndices() {
    return db.getCollection('users').createIndex({
        username: 1
    });
}

exports.migrate = migrate;
async function migrate() {
    await db.getCollection('users').updateMany({version: '1.0.0'}, {
        $set: {
            favouriteEstates: [],
            seenEstates: [],
            version: '1.1.0'
        }
    }, {multi: true});

    await db.getCollection('users').updateMany({version: '1.1.0'}, {
        $set: {
            readAllMark: null,
            unseenMarkedEstates: [],
            version: '1.2.0'
        }
    }, {multi: true});

    await db.getCollection('users').updateMany({version: '1.2.0'}, {
        $set: {
            view: 'cards',
            version: '1.3.0'
        }
    }, {multi: true});

    await db.getCollection('users').updateMany({version: '1.3.0'}, {
        $set: {
            notificationFrequency: 1,
            notificationQuietHours: {
                start: {
                    hours: 22,
                    minutes: 0,
                    timezone: 'Europe/Budapest'
                },
                end: {
                    hours: 8,
                    minutes: 0,
                    timezone: 'Europe/Budapest'
                }
            },
            version: '1.4.0'
        }
    }, {multi: true});

    await db.getCollection('users').updateMany({version: '1.4.0'}, {
        $set: {
            version: 5
        }
    }, {multi: true});
}

exports.get = get;
function get(filter) {
    return db.getCollection('users').findOne(filter);
}

exports.save = save;
function save(record) {
    record.updated = new Date();

    if (record.created) {
        return db.getCollection('users').replaceOne({username: record.username}, record);
    }

    record.created = new Date();
    record.version = version;
    return db.getCollection('users').insertOne(record);
}

exports.has = has;
function has(username) {
    return db.getCollection('users').count({username});
}

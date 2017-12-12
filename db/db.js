const config = require('config');
const MongoClient = require('mongodb').MongoClient;

let dbconn;

exports.init = init;
function init() {
    return MongoClient.connect(config.get('db.connectionStr'))
        .then(db => {
            dbconn = db;
        });
}

exports.getConnection = getConnection;
function getConnection() {
    return dbconn;
}

exports.getCollection = getCollection;
function getCollection(name) {
    return dbconn.collection(name);
}

const config = require('config');
const MongoClient = require('mongodb').MongoClient;

let client, db;

exports.init = init;
function init() {
    return MongoClient.connect(config.get('db.connectionStr'), { useNewUrlParser: true })
        .then(mongoclient => {
            client = mongoclient;
            db = client.db(config.get('db.collection'));
        });
}

exports.getConnection = getConnection;
function getConnection() {
    return db;
}

exports.getCollection = getCollection;
function getCollection(name) {
    return db.collection(name);
}

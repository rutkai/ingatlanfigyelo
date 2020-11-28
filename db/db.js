const config = require('config');
const MongoClient = require('mongodb').MongoClient;

let client, db;

exports.init = async function () {
    client = await MongoClient.connect(config.get('db.connectionStr'), { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(config.get('db.database'));
}

exports.getClient = () => client;
exports.getCollectionName = () => config.get('db.database');

exports.getCollection = name => db.collection(name);

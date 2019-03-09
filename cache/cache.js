const config = require('config');
const Redis = require('ioredis');
const redis = new Redis(config.get('redis'));
const envUtils = require('../utils/env');

exports.set = set;
function set(key, value, ttl = 3600) {
    if (envUtils.isDev()) {
        return Promise.resolve();
    }

    return redis.set(key, JSON.stringify(value))
        .then(() => {
            redis.expire(key, ttl);
        })
}

exports.get = get;
function get(key) {
    if (envUtils.isDev()) {
        return Promise.resolve(null);
    }

    return redis.get(key)
        .then(JSON.parse);
}

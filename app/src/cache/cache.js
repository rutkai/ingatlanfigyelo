const config = require('config');
const Redis = require('ioredis');
const redis = new Redis(config.get('redis'));

exports.set = set;
function set(key, value, ttl = 3600) {
    return redis.set(key, JSON.stringify(value))
        .then(() => {
            redis.expire(key, ttl);
        })
}

exports.get = get;
function get(key) {
    return redis.get(key)
        .then(JSON.parse);
}

exports.del = del;
function del(key) {
    return redis.del(key);
}

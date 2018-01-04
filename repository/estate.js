const moment = require('moment');
const estates = require('../db/estate');

exports.getEstates = getEstates;
function getEstates(filter, start = 0, limit = 3) {
    return estates.getMany(filter, start, limit);
}

exports.get = get;
function get(filter) {
    return estates.get(filter);
}

exports.lastCount = lastCount;
function lastCount(unit, amount = 1) {
    return estates.count({
        "created": {
            "$gte": moment().subtract(amount, unit).toDate()
        }
    });
}

exports.save = save;
function save(estate) {
    return estates.save(estate);
}

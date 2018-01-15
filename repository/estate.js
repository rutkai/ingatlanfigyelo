const moment = require('moment');
const estates = require('../db/estate');

exports.getEstates = getEstates;
function getEstates(filter, start = 0, limit = 3) {
    return estates.getMany(filter).sort({updated: -1}).skip(start).limit(limit).toArray();
}

exports.get = get;
function get(filter) {
    return estates.get(filter);
}

exports.getPossibleDuplicates = getPossibleDuplicates;
function getPossibleDuplicates(district, size) {
    return estates.getMany({
        district,
        size,
        updated: {
            "$gte": moment().subtract(1, 'week').toDate()
        }
    }).toArray();
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

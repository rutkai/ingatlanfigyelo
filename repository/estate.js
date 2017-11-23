const estates = require('../db/estateManager');

exports.getEstates = getEstates;
function getEstates(filter, start = 0, limit = 3) {
    return estates.getMany(filter, start, limit);
}

exports.get = get;
function get(filter) {
    return estates.get(filter);
}

exports.save = save;
function save(estate) {
    return estates.save(estate);
}

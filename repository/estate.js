const estates = require('../db/estateManager');

exports.getEstates = getEstates;
function getEstates(filter, start) {
    return estates.getMany(filter, start);
}

exports.get = get;
function get(filter) {
    return estates.get(filter);
}

exports.save = save;
function save(estate) {
    return estates.save(estate);
}

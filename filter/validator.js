const common = require('./common');

exports.validate = validate;
function validate(data) {
    if (!Array.isArray(data)) {
        return false;
    }

    if (data.length > 5) {
        return false;
    }

    for (const filters of data) {
        if (!Array.isArray(filters)) {
            return false;
        }

        if (filters.length > 10) {
            return false;
        }

        for (const filter of filters) {
            if (typeof filter !== 'object') {
                return false;
            }

            if (!filter.field || !isAllowedField(filter.field)) {
                return false;
            }

            if (common.isBooleanField(filter.field)) {
                if (!validateBooleanFilter(filter)) {
                    return false;
                }
            } else if (common.isIntervalField(filter.field)) {
                if (!validateIntervalFilter(filter)) {
                    return false;
                }
            } else if (common.isMultiselectField(filter.field)) {
                if (!validateMultiselectFilter(filter)) {
                    return false;
                }
            } else if (common.isStringField(filter.field)) {
                if (!validateStringFilter(filter)) {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    return true;
}

function isAllowedField(field) {
    const fields = [
        "balcony",
        "district",
        "city",
        "region",
        "elevator",
        "floor",
        "heating",
        "price",
        "rooms",
        "halfrooms",
        "size",
        "material",
        "descriptionText",
        "squareMeterPrice",
        "source"
    ];

    return fields.includes(field);
}

function validateBooleanFilter(filter) {
    if (Object.keys(filter).length !== 3) {
        return false;
    }

    if (typeof filter.value !== 'boolean') {
        return false;
    }

    if (typeof filter.nullable !== 'boolean') {
        return false;
    }

    return true;
}

function validateIntervalFilter(filter) {
    const length = Object.keys(filter).length;
    if (length < 2 || length > 4) {
        return false;
    }

    if (filter.min && typeof filter.min !== 'number') {
        return false;
    }

    if (filter.max && typeof filter.max !== 'number') {
        return false;
    }

    if (typeof filter.nullable !== 'boolean') {
        return false;
    }

    return true;
}

function validateMultiselectFilter(filter) {
    if (Object.keys(filter).length !== 2) {
        return false;
    }

    if (!filter.selected || !Array.isArray(filter.selected)) {
        return false;
    }

    for (const value of filter.selected) {
        if (!['number', 'string'].includes(typeof value)) {
            return false;
        }
    }

    return true;
}

function validateStringFilter(filter) {
    if (Object.keys(filter).length !== 3) {
        return false;
    }

    if (!filter.contains || !Array.isArray(filter.contains)) {
        return false;
    }

    if (typeof filter.nullable !== 'boolean') {
        return false;
    }

    for (const value of filter.contains) {
        if (!['number', 'string'].includes(typeof value)) {
            return false;
        }
    }

    return true;
}

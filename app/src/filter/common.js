exports.isBooleanField = isBooleanField;
function isBooleanField(field) {
    const booleanFields = [
        "elevator"
    ];

    return booleanFields.includes(field);
}

exports.isIntervalField = isIntervalField;
function isIntervalField(field) {
    const intervalFields = [
        "balcony",
        "floor",
        "price",
        "rooms",
        "halfrooms",
        "size",
        "squareMeterPrice"
    ];

    return intervalFields.includes(field);
}

exports.isMultiselectField = isMultiselectField;
function isMultiselectField(field) {
    const multiselectFields = [
        "district",
        "city",
        "region",
        "source"
    ];

    return multiselectFields.includes(field);
}

exports.isStringField = isStringField;
function isStringField(field) {
    const stringFields = [
        "heating",
        "material",
        "descriptionText"
    ];

    return stringFields.includes(field);
}

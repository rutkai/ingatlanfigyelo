const common = require('./common');

exports.toMongoFilter = toMongoFilter;
function toMongoFilter(userFilterGroups) {
    const filtersQuery = [];

    for (const filters of userFilterGroups) {
        const filterQuery = [];
        for (const filter of filters) {
            if (common.isBooleanField(filter.field)) {
                filterQuery.push(createMaybeNullableQuery(filter, {
                    [filter.field]: {"$eq": filter.value}
                }));
            } else if (common.isIntervalField(filter.field)) {
                filterQuery.push(createMaybeNullableQuery(filter, {
                    [filter.field]: {"$gte": filter.min}
                }));
                filterQuery.push(createMaybeNullableQuery(filter, {
                    [filter.field]: {"$lte": filter.max}
                }));
            } else if (common.isMultiselectField(filter.field)) {
                filterQuery.push({
                    [filter.field]: {"$in": filter.selected}
                });
            } else if (common.isStringField(filter.field)) {
                const escapedFilter = filter.contains.join('|').replace(/[-[\]{}()*+?.,\\^$|#]/g, '');
                filterQuery.push({
                    [filter.field]: {
                        "$regex": `(${escapedFilter})`,
                        "$options": "i"
                    }
                });
            }
        }

        if (filterQuery.length) {
            filtersQuery.push({
                "$and": filterQuery
            });
        }
    }

    if (filtersQuery.length) {
        return {"$or": filtersQuery};
    }

    return {};
}

function createMaybeNullableQuery(filter, embeddedQuery) {
    if (filter.nullable) {
        return {
            "$or": [
                embeddedQuery,
                {
                    [filter.field]: {"$eq": null}
                }
            ]
        };
    } else {
        return embeddedQuery;
    }
}

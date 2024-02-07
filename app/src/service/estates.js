const ObjectId = require('mongodb').ObjectId;

const estateRepository = require('../repository/estate');
const filterSerializer = require('../filter/serializer');


exports.getFavouriteEstates = getFavouriteEstates;
function getFavouriteEstates(user, start, RESULT_LIMIT) {
    const favouriteQuery = {
        "_id": {
            "$in": user.favouriteEstates.map(oid => new ObjectId(oid))
        }
    };
    return estateRepository.getEstates(favouriteQuery, start, RESULT_LIMIT);
}

exports.getSeenEstates = getSeenEstates;
function getSeenEstates(user, start, RESULT_LIMIT) {
    let seenQuery = {
        "_id": {
            "$in": user.seenEstates.map(oid => new ObjectId(oid)),
            "$nin": user.favouriteEstates.map(oid => new ObjectId(oid))
        }
    };
    if (user.readAllMark) {
        const filter = filterSerializer.toMongoFilter(user.filterGroups);
        seenQuery = {
            "$or": [
                seenQuery,
                {
                    "$and": [
                        {
                            "_id": {
                                "$nin": user.favouriteEstates.map(oid => new ObjectId(oid)).concat(user.unseenMarkedEstates.map(ObjectId))
                            },
                            "updated": {
                                "$lt": user.readAllMark
                            }
                        },
                        filter
                    ]
                }
            ]
        };
    }
    return estateRepository.getEstates(seenQuery, start, RESULT_LIMIT);
}

exports.getUnseenNonFavouriteEstates = getUnseenNonFavouriteEstates;
function getUnseenNonFavouriteEstates(user, start, RESULT_LIMIT) {
    const filter = filterSerializer.toMongoFilter(user.filterGroups);
    const unseenQuery = {
        "$and": [
            {
                "$or": [
                    {
                        "_id": {
                            "$nin": user.favouriteEstates.map(oid => new ObjectId(oid)),
                            "$in": user.unseenMarkedEstates.map(oid => new ObjectId(oid)),
                        }
                    },
                    {
                        "_id": {
                            "$nin": user.favouriteEstates.map(oid => new ObjectId(oid)).concat(user.seenEstates.map(oid => new ObjectId(oid))),
                        }
                    }
                ]
            },
            filter
        ]
    };
    if (user.readAllMark) {
        unseenQuery["$and"][0]["$or"][1]["updated"] = {
            "$gte": user.readAllMark
        };
    }
    return estateRepository.getEstates(unseenQuery, start, RESULT_LIMIT);
}

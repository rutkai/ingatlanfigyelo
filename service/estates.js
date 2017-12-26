const ObjectId = require('mongodb').ObjectId;

const estateRepository = require('../repository/estate');
const filterSerializer = require('../filter/serializer');


exports.getFavouriteEstates = getFavouriteEstates;
function getFavouriteEstates(user, start, RESULT_LIMIT) {
    const favouriteQuery = {
        "_id": {
            "$in": user.favouriteEstates.map(ObjectId)
        }
    };
    return estateRepository.getEstates(favouriteQuery, start, RESULT_LIMIT);
}

exports.getSeenEstates = getSeenEstates;
function getSeenEstates(user, start, RESULT_LIMIT) {
    let seenQuery = {
        "_id": {
            "$in": user.seenEstates.map(ObjectId),
            "$nin": user.favouriteEstates.map(ObjectId)
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
                                "$nin": user.favouriteEstates.map(ObjectId).concat(user.unseenMarkedEstates.map(ObjectId))
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
        "$or": [
            {
                "_id": {
                    "$nin": user.favouriteEstates.map(ObjectId),
                    "$in": user.unseenMarkedEstates.map(ObjectId),
                }
            },
            {
                "$and": [
                    {
                        "_id": {
                            "$nin": user.favouriteEstates.map(ObjectId).concat(user.seenEstates.map(ObjectId)),
                        }
                    },
                    filter
                ]
            }
        ]
    };
    if (user.readAllMark) {
        unseenQuery["$or"][1]["$and"][0]["updated"] = {
            "$gte": user.readAllMark
        };
    }
    return estateRepository.getEstates(unseenQuery, start, RESULT_LIMIT);
}

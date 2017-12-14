const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

const estateRepository = require('../repository/estate');
const userRepository = require('../repository/user');
const filterSerializer = require('../filter/serializer');
const estateSerializer = require('../estate/serializer');

const RESULT_LIMIT = 3;

router.get('/:start(\\d+)?/:pool(favourite|unseen|seen)?', async function (req, res) {
    const start = req.params.start ? parseInt(req.params.start) : 0;
    const pool = req.params.pool ? req.params.pool : "unseen";
    const user = req.user;

    let estates = [];
    if (user) {
        switch (pool) {
            case "favourite":
                const favouriteQuery = {
                    "_id": {
                        "$in": user.favouriteEstates.map(ObjectId)
                    }
                };
                estates = await estateRepository.getEstates(favouriteQuery, start, RESULT_LIMIT);
                break;
            case "seen":
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
                estates = await estateRepository.getEstates(seenQuery, start, RESULT_LIMIT);
                break;
            default:
                const filter = filterSerializer.toMongoFilter(user.filterGroups);
                userRepository.resetLastRefresh(user);

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
                estates = await estateRepository.getEstates(unseenQuery, start, RESULT_LIMIT);
                break;
        }
    } else {
        estates = await estateRepository.getEstates({}, start, RESULT_LIMIT);
    }

    res.json({
        estates: estateSerializer.toResponse(estates, user)
    });
});

router.post('/mark-read', async function (req, res) {
    await userRepository.resetSeenAll(req.user);

    res.json({});
});

module.exports = router;

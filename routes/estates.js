const express = require('express');
const router = express.Router();

const estatesService = require('../service/estates');
const estateRepository = require('../repository/estate');
const userRepository = require('../repository/user');
const estateSerializer = require('../estate/serializer');

const RESULT_LIMIT = 6;

router.get('/:start(\\d+)?/:pool(favourite|unseen|seen)?', async function (req, res) {
    const start = req.params.start ? parseInt(req.params.start) : 0;
    const pool = req.params.pool ? req.params.pool : "unseen";
    const user = req.user;

    let estates = [];
    if (user) {
        switch (pool) {
            case "favourite":
                estates = await estatesService.getFavouriteEstates(user, start, RESULT_LIMIT);
                break;
            case "seen":
                estates = await estatesService.getSeenEstates(user, start, RESULT_LIMIT);
                break;
            default:
                estates = await estatesService.getUnseenNonFavouriteEstates(user, start, RESULT_LIMIT);
                userRepository.resetLastRefresh(user);
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

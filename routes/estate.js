const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

const estateRepository = require('../repository/estate');
const userRepository = require('../repository/user');

router.put('/:estate((\\w+|\\d+)+)', async function (req, res) {
    const favourite = !!req.body.favourite;
    const seen = !!req.body.seen;

    const id = req.params.estate;
    const estate = await estateRepository.get({_id: ObjectId(id)});
    if (!estate) {
        res.status(404).json({
            error: 'Estate not found!',
            code: 404
        });
        return;
    }

    await userRepository.updateSeenAndFavourite(req.user, id, favourite, seen);

    res.json({});
});

module.exports = router;

const express = require('express');
const router = express.Router();
const estateRepository = require('../repository/estate');
const userRepository = require('../repository/user');
const filterSerializer = require('../filter/serializer');
const estateSerializer = require('../estate/serializer');

router.get('/:start(\\d+)?', function (req, res) {
    let filter = {};
    if (req.user) {
        filter = filterSerializer.toMongoFilter(req.user.filterGroups);
        userRepository.resetLastRefresh(req.user);
    }

    estateRepository.getEstates(filter, req.params.start ? parseInt(req.params.start) : 0)
        .then(estateSerializer.toResponse)
        .then(estates => {
            res.json({
                estates
            });
        });
});

module.exports = router;

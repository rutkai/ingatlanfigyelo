const express = require('express');
const router = express.Router();
const estateManager = require('../db/estateManager');
const filterSerializer = require('../filter/serializer');

router.get('/:start(\\d+)?', function (req, res) {
    let filter = {};
    if (req.user) {
        filter = filterSerializer.toMongoFilter(req.user.filterGroups);
    }

    estateManager.getMany(filter, req.params.start ? parseInt(req.params.start) : 0)
        .then(result => {
            return result.map(doc => {
                return {
                    images: doc.images,
                    price: doc.price,
                    rooms: doc.rooms,
                    halfrooms: doc.halfrooms,
                    size: doc.size,
                    district: doc.district,
                    address: doc.address,
                    floor: doc.floor,
                    elevator: doc.elevator,
                    heating: doc.heating,
                    balcony: doc.balcony,
                    url: doc.url,
                    source: doc.source,
                    updated: doc.updated
                };
            });
        })
        .then(estates => {
            res.json({
                estates
            });
        });
});

module.exports = router;

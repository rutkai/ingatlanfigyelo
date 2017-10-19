const express = require('express');
const router = express.Router();
const estateManager = require('../db/estateManager');

router.get('/:start(\\d+)?', function(req, res) {
  estateManager.getMany({}, req.params.start ? parseInt(req.params.start) : 0)
      .then(result => {
          return result.map(doc => {
              return {
                  images: doc.images,
                  price: doc.price,
                  rooms: doc.rooms,
                  size: doc.size,
                  district: doc.district,
                  region: doc.region,
                  floor: doc.floor,
                  elevator: doc.elevator,
                  heating: doc.heating,
                  balcony: doc.balcony,
                  url: doc.url,
                  source: doc.source
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

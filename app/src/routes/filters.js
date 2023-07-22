const express = require('express');
const router = express.Router();
const cache = require('../cache/cache');
const validator = require('../filter/validator');
const estateRepository = require('../repository/estate');
const userRepository = require('../repository/user');

router.put('/save', function (req, res) {
    if (!req.isAuthenticated()) {
        res.status(403).json({
            error: 'Unauthorized!',
            code: 403
        });
        return;
    }

    const filterDefs = req.body;
    if (!filterDefs || !validator.validate(filterDefs)) {
        res.status(400).json({
            error: 'Invalid data',
            code: 400
        });
        return;
    }

    userRepository.updateFilters(req.user, filterDefs)
        .then(() => {
            res.json({});
        });
});

router.get('/cities', async function (req, res) {
    let cities = await cache.get('filters-cities');

    if (!cities) {
        cities = await estateRepository.getPossibleCities();
        cache.set('filters-cities', cities);
    }

    res.json(cities);
});

router.get('/regions', async function (req, res) {
    let regions = await cache.get('filters-regions');

    if (!regions) {
        regions = await estateRepository.getPossibleRegions();
        cache.set('filters-regions', regions);
    }

    res.json(regions);
});

router.get('/districts', async function (req, res) {
    let districts = await cache.get('filters-districts');

    if (!districts) {
        districts = await estateRepository.getPossibleDistricts();
        cache.set('filters-districts', districts);
    }

    res.json(districts);
});

module.exports = router;

const config = require('config');
const moment = require('moment');
const express = require('express');
const router = express.Router();

const estateRepository = require('../repository/estate');

let statsCache;
let cacheTTL = moment();

router.get('/', async function (req, res) {
    if (!statsCache || cacheTTL < moment()) {
        statsCache = {
            parserStats: getParserStats(),
            db: await getDbStats(),
        };
        cacheTTL = moment().add(1, 'hour');
    }

    res.json(statsCache);
});

module.exports = router;


function getParserStats() {
    const stats = [];

    for (const provider of config.get('polling.providers')) {
        let refresh = '';

        if (provider.scheduler.interval.minutes) {
            refresh = provider.scheduler.interval.minutes + ' perc'
        }
        if (provider.scheduler.interval.hours) {
            refresh = provider.scheduler.interval.hours + ' óra'
        }

        stats.push({
            name: provider.name,
            refresh
        });
    }

    return stats;
}

async function getDbStats() {
    const stats = {};

    stats.lastHour = await estateRepository.lastCount('hour');
    stats.lastDay = await estateRepository.lastCount('day');
    stats.lastWeek = await estateRepository.lastCount('week');

    return stats;
}

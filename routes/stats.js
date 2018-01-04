const config = require('config');
const express = require('express');
const router = express.Router();

const estateRepository = require('../repository/estate');

router.get('/', async function (req, res) {
    const stats = {};

    stats.parserStats = getParserStats();
    stats.db = await getDbStats();

    res.json(stats);
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

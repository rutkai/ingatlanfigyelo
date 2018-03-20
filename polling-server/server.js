const config = require('config');
const moment = require('moment');

const workerPool = require('./worker/pool');

const parsers = require('./parsers/parser');
const Updater = require('./updater').Updater;
const estates = require('../db/estate');
const estatesBlacklist = require('../db/estateBlacklist');

const blacklistRepository = require('../repository/estateBlacklist');

const BLACKLIST_CLEANUP_POLLING = 60 * 60 * 1000;   // 1 hour

const MAX_PAGES_HARD_LIMIT = 1000;
const polling = [];
let isPolling = false;

exports.init = init;
async function init() {
    await estates.checkIndices();
    await estates.migrate();
    await workerPool.init();

    await estatesBlacklist.checkIndices();
    await estatesBlacklist.migrate();
    scheduleBlacklistCleanup();

    for (const provider of config.get('polling.providers')) {
        polling.push({
            "name": provider.name,
            "baseUrl": provider.baseUrl,
            "parser": parsers.getParser(provider.parser),
            "workerTypes": provider.workerTypes,
            "indexPage": provider.parserOpts.indexPage,
            "maxPages": provider.parserOpts.maxPages || MAX_PAGES_HARD_LIMIT,
            "scheduler-interval": moment.duration(provider.scheduler.interval).asMilliseconds(),
            "interval": moment.duration(provider.parserOpts.interval).asMilliseconds()
        });
    }
}

exports.start = start;
function start() {
    if (isPolling) {
        return;
    }
    isPolling = true;

    for (const provider of polling) {
        createUpdater(provider);
    }
}

function createUpdater(provider) {
    const updater = new Updater(provider);
    let isUpdating = false;

    const update = () => {
        if (isUpdating) {
            return;
        }

        isUpdating = true;
        updater.update((err) => {
            if (!err) {
                console.log(`${provider.name} just got updated!`);
            }
            isUpdating = false;
        });
    };

    setInterval(update, provider["scheduler-interval"]);
    update();
}

function scheduleBlacklistCleanup() {
    const cleanup = () => {
        blacklistRepository.cleanup();
    };

    setInterval(cleanup, BLACKLIST_CLEANUP_POLLING);
    cleanup();
}

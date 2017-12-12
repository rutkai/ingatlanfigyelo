const config = require('config');
const moment = require('moment');

const workerPool = require('./worker/pool');

const parsers = require('./parsers/parser');
const Updater = require('./updater').Updater;
const estates = require('../db/estate');

const polling = [];
let isPolling = false;

exports.init = init;
function init() {
    return estates.checkIndices()
        .then(() => estates.migrate())
        .then(() => workerPool.init())
        .then(() => {
            for (const provider of config.get('polling.providers')) {
                polling.push({
                    "name": provider.name,
                    "baseUrl": provider.baseUrl,
                    "parser": parsers.getParser(provider.parser),
                    "indexPage": provider.parserOpts.indexPage,
                    "interval": moment.duration(provider.parserOpts.interval).asMilliseconds()
                });
            }
        });
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
    const interval = moment.duration(config.get('polling.scheduler.interval')).asMilliseconds();
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

    setInterval(update, interval);
    update();
}

const config = require('config');
const moment = require('moment');

const parsers = require('./parsers/parser');
const Updater = require('./updater').Updater;
const estateManager = require('../db/estateManager');

const polling = [];
let isPolling = false;

exports.init = init;
function init() {
    return estateManager.checkIndices()
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
    updater.update(() => {
        console.log(`${provider.name} just got updated!`);

        const interval = moment.duration(config.get('polling.scheduler.interval')).asMilliseconds();
        setTimeout(() => {
            createUpdater(provider);
        }, interval);
    });
}

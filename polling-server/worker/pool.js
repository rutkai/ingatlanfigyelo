const config = require('config');

const LocalWorker = require('./workers/local');
const AwsLambdaWorker = require('./workers/aws-lambda');

let workerPool = [];

exports.init = init;
async function init() {
    for (const workerConfig of config.get('polling.workers')) {
        const worker = await createWorker(workerConfig);

        if (worker) {
            workerPool.push(worker);
        }
    }
}

exports.getWorker = getWorker;
function getWorker() {
    let selectedWorker = null;

    for (const worker of workerPool) {
        if (worker.isAvailable() && (!selectedWorker || worker.lastUsed() < selectedWorker.lastUsed())) {
            selectedWorker = worker;
        }
    }

    return selectedWorker;
}


async function createWorker(config) {
    let worker;
    switch (config.type) {
        case 'local':
            worker = new LocalWorker(config);
            await worker.init();
            break;
        case 'aws-lambda':
            worker = new AwsLambdaWorker(config);
            await worker.init();
            break;
    }

    if (worker) {
        worker.test();
    }

    return worker;
}

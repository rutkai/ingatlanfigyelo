const config = require('config');

const LocalWorker = require('./workers/local');
const AwsLambdaWorker = require('./workers/aws-lambda');
const AzureFunctionWorker = require('./workers/azure-function');
const NativePhpWorker = require('./workers/native-php');

let workerPool = [];

exports.init = init;
async function init() {
    for (const workerConfig of config.get('polling.workers')) {
        const worker = await createWorker(workerConfig);

        if (worker) {
            workerPool.push(worker);
            console.log('Worker initialized: ' + worker.name());
        }
    }
    console.log('All workers have been initialized!');
}

exports.getWorker = getWorker;
function getWorker(provider) {
    let selectedWorker = null;

    for (const worker of workerPool) {
        if (worker.isAvailable() && (!selectedWorker || worker.lastUsed(provider) < selectedWorker.lastUsed(provider))) {
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
        case 'azure-function':
            worker = new AzureFunctionWorker(config);
            await worker.init();
            break;
        case 'native-php':
            worker = new NativePhpWorker(config);
            await worker.init();
            break;
    }

    if (worker) {
        await worker.test();
    }

    return worker;
}

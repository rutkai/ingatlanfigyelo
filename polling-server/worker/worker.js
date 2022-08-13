const Sentry = require("@sentry/node");

const workerPool = require('./pool');

const rescheduleTime = 30000;
const retryCount = 8;

const queries = [];

exports.fetchContent = fetchContent;

async function fetchContent(url, provider) {
    const worker = workerPool.getWorker(provider);

    incrementRetryCount(url);
    if (isRetriesReached(url)) {
        Sentry.captureMessage('Too many failed fetches!', {
            level: 'error',
            tags: {submodule: 'worker'},
            extra: {
                url,
                provider: provider.name
            }
        });
        return Promise.reject('Too many failed fetches!');
    }

    if (!worker) {
        Sentry.captureMessage('No more workers! Rescheduling...', {
            level: 'error',
            tags: {submodule: 'worker'},
            extra: {
                url,
                provider: provider.name
            }
        });

        return new Promise(resolve => {
            setTimeout(() => {
                fetchContent(url, provider)
                    .then(resolve);
            }, rescheduleTime);
        });
    }

    try {
        const result = await worker.fetchContent(url, provider);
        removeRetryCounter(url);
        return result;
    } catch (err) {
        Sentry.captureException(err, {
            level: 'warning',
            tags: {submodule: 'worker'},
            extra: {
                url,
                workerName: worker.name(),
                provider: provider.name
            }
        });

        worker.test();

        // Find a different worker for the job...
        return fetchContent(url, provider);
    }
}


function incrementRetryCount(url) {
    for (const query of queries) {
        if (query.url === url) {
            query.count += 1;
            return;
        }
    }

    queries.push({
        url,
        count: 1
    });
}

function removeRetryCounter(url) {
    for (const index in queries) {
        if (queries[index].url === url) {
            queries.splice(index, 1);
        }
    }
}

function isRetriesReached(url) {
    for (const query of queries) {
        if (query.url === url) {
            return query.count >= retryCount;
        }
    }

    return false;
}

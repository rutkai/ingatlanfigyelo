const workerPool = require('./pool');

const rescheduleTime = 30000;
const retryCount = 8;

const queries = [];


exports.fetchContent = fetchContent;
function fetchContent(url) {
    const worker = workerPool.getWorker();

    incrementRetryCount(url);
    if (isRetriesReached(url)) {
        return Promise.reject('Too many failed fetches!');
    }

    if (!worker) {
        console.log('No more workers! Rescheduling...');
        return new Promise(resolve => {
            setTimeout(() => {
                fetchContent(url)
                    .then(resolve);
            }, rescheduleTime);
        });
    }

    return worker.fetchContent(url)
        .then(result => {
            removeRetryCounter(url);
            return result;
        })
        .catch(() => {
            // Find a different worker for the job...
            worker.test();
            return fetchContent(url);
        });
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

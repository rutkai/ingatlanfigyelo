const fs = require('fs');
const Raven = require('raven');

const workerPool = require('./pool');

const rescheduleTime = 30000;
const retryCount = 8;

const queries = [];
const logPath = __dirname + '/../../var/log/worker.log';

exports.fetchContent = fetchContent;
function fetchContent(url, provider) {
    const worker = workerPool.getWorker(provider);

    incrementRetryCount(url);
    if (isRetriesReached(url)) {
        log(provider, 'Failed fetches limit reached with URL ' + url);
        return Promise.reject('Too many failed fetches!');
    }

    if (!worker) {
        log(provider, 'No more workers');
        console.log('No more workers! Rescheduling...');
        return new Promise(resolve => {
            setTimeout(() => {
                fetchContent(url)
                    .then(resolve);
            }, rescheduleTime);
        });
    }

    return worker.fetchContent(url, provider)
        .then(result => {
            log(provider, 'Fetch success using worker ' + worker.name() + ', content: ' + result.substr(0, 40) + '[...]');
            removeRetryCounter(url);
            return result;
        })
        .catch(err => {
            // Find a different worker for the job...
            log(provider, 'Error during fetching using worker ' + worker.name() + ' from ' + url + ' :' + err.toString());
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

function log(provider, entry) {
    let data = '[' + new Date().toISOString() + '] [' + provider + ']: ' + entry + '\n';
    fs.appendFile(logPath, data, err => {
        if (err) {
            Raven.captureException(err);
        }
    });
}

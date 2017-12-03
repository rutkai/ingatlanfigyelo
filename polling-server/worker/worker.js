const workerPool = require('./pool');

const rescheduleTime = 30000;


exports.fetchContent = fetchContent;
function fetchContent(url) {
    const worker = workerPool.getWorker();

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
        .catch(() => {
            // Find a different worker for the job...
            worker.test();
            return fetchContent(url);
        });
}

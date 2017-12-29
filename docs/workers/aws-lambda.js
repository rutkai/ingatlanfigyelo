const url = require('url');

exports.handler = (event, context, callback) => {
    let requestUrl;
    if (event.body) {
        let body = JSON.parse(event.body);
        requestUrl = body.url;
    } else {
        requestUrl = event.url;
    }
    console.log("Fetching: ", requestUrl);

    let options = url.parse(requestUrl);
    options.headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0"
    };
    require('https').get(options, function(resp) {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            callback(null, {
                "statusCode": 200,
                "headers": {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({data})
            });
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
        callback(null, {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(e)
        });
    });
};

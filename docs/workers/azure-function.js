const url = require('url');

exports.handler = (context, req) => {
    let requestUrl = req.body ? req.body.url : null;
    if (!requestUrl) {
        context.log('Missing request url!');
        context.res = {
            status: 400,
            body: {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json"
                },
                body: "Missing url!"
            }
        };
        context.done();
        return;
    }

    context.log("Fetching: ", requestUrl);

    let options = url.parse(requestUrl);
    options.headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"
    };
    require('https').get(options, function (resp) {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            context.res = {
                status: 200,
                body: {data}
            };
            context.done();
        });
    }).on('error', function (e) {
        context.log("Got error: " + e.message);
        context.res = {
            status: 500,
            body: e
        };
        context.done();
    });
};

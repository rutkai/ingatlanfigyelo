const crypto = require('crypto');

exports.generate = generate;
function generate(seed) {
    const input = `token-${seed}-` + Date.now() + '-' + process.pid + Math.random();
    return crypto.createHash('md5').update(input).digest("hex");
}

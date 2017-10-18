const ingatlancom = require('./ingatlan.com');
const otthonterkephu = require('./otthonterkep.hu');

exports.getParser = getParser;
function getParser(parser) {
    switch (parser) {
        case 'ingatlan.com':
            return ingatlancom;
        case 'otthonterkep.hu':
            return otthonterkephu;
        default:
            throw new Error("No parser found: " + parser);
    }
}

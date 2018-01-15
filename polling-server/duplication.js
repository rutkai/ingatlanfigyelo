const fs = require('fs');
const levenshtein = require('fast-levenshtein');

const estateRepository = require('../repository/estate');

const CONFIDENCE_THRESHOLD = 100;
const logPath = __dirname + '/../var/log/duplication.log';

exports.isDuplicate = isDuplicate;
async function isDuplicate(profileData) {
    let candidates = await estateRepository.getPossibleDuplicates(profileData.district, profileData.size);

    for (const estate of candidates) {
        if (isDuplicateOf(estate, profileData)) {
            log(estate._id, profileData.source);
            return estate;
        }
    }

    return false;
}

exports.isDuplicateOf = isDuplicateOf;
function isDuplicateOf(a, b) {
    let confidence = 0;

    if (a.price === b.price) {
        confidence += 30;
    }

    if (a.balcony && a.balcony === b.balcony) {
        confidence += 10;
    }

    if (a.address && a.address === b.address) {
        confidence += 30;
    }

    if (a.floor && a.floor === b.floor) {
        confidence += 20;
    }

    if (a.rooms === b.rooms) {
        confidence += 20;
    }

    if (a.halfrooms === b.halfrooms) {
        confidence += 20;
    }

    const descriptionDifference = levenshtein.get(a.descriptionText, b.descriptionText);
    if (descriptionDifference < a.descriptionText.length * 0.02) {
        confidence += 40;
    }
    if (descriptionDifference < a.descriptionText.length * 0.05) {
        confidence += 30;
    }
    if (descriptionDifference < a.descriptionText.length * 0.10) {
        confidence += 20;
    }

    return confidence >= CONFIDENCE_THRESHOLD;
}


function log(id, duplicateProvider) {
    let data = '[' + new Date().toISOString() + ']: Duplication found with ' + id + ' - duplicate provider: ' + duplicateProvider + '\n';
    fs.appendFile(logPath, data, () => {});
}

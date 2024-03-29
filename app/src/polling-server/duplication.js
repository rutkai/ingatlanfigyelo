const levenshtein = require('fast-levenshtein');

const estateRepository = require('../repository/estate');

const CONFIDENCE_THRESHOLD = 100;

exports.isDuplicate = isDuplicate;
async function isDuplicate(profileData) {
    let candidates = await estateRepository.getPossibleDuplicates(createFilterFromProfileData(profileData));

    for (const estate of candidates) {
        if (isDuplicateOf(estate, profileData)) {
            console.log('[' + new Date().toISOString() + ']: Duplication found with ' + estate._id + ' - duplicate provider: ' + profileData.source);
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


function createFilterFromProfileData(profileData) {
    let filter = {
        city: profileData.city,
        size: profileData.size
    };

    if (profileData.district) {
        filter['district'] = profileData.district;
    }
    if (profileData.region) {
        filter['region'] = profileData.region;
    }

    return filter;
}

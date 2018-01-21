let materialMatchers = {
    "panel": 'Panel',
    "tégla": 'Tégla',
    "csúsztatott.{0,3}zsalu": 'Csúsztatott Zsalu'
};

exports.extractMaterial = extractMaterial;
function extractMaterial(text) {
    return matchUnique(text, materialMatchers);
}


function matchUnique(text, list) {
    let matches = [];
    Object.keys(list).map(function (objectKey) {
        if (text.match(new RegExp(objectKey, "ig")) !== null) {
            matches.push(list[objectKey]);
        }
    });

    return Object.keys(matches).length === 1 ? matches[0] : null;
}

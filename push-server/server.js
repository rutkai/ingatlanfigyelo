const estateRepository = require('../repository/estate');
const userRepository = require('../repository/user');
const filterSerializer = require('../filter/serializer');
const estateSerializer = require('../estate/serializer');

exports.getUpdatedEstateList = getUpdatedEstateList;
function getUpdatedEstateList(user) {
    let filter = {
        "$and": [
            {
                "updated": {"$gte": user.lastRefresh}
            },
            filterSerializer.toMongoFilter(user.filterGroups)
        ]
    };

    userRepository.resetLastRefresh(user);
    return estateRepository.getEstates(filter, 50)
        .then(estateSerializer.toResponse);
}

exports.toResponse = toResponse;
function toResponse(estateDocs, user) {
    return estateDocs.map(doc => {
        return {
            id: doc._id,
            images: doc.images,
            price: doc.price,
            rooms: doc.rooms,
            halfrooms: doc.halfrooms,
            size: doc.size,
            squareMeterPrice: doc.squareMeterPrice,
            district: doc.district,
            address: doc.address,
            floor: doc.floor,
            elevator: doc.elevator,
            heating: doc.heating,
            balcony: doc.balcony,
            descriptionHtml: doc.descriptionHtml,
            url: doc.url,
            source: doc.source,
            updated: doc.updated,
            favourite: user ? user.favouriteEstates.includes(doc._id.toString()) : false,
            seen: isEstateSeen(doc, user)
        };
    });
}

function isEstateSeen(estateDoc, user) {
    if (user) {
        const id = estateDoc._id.toString();

        if (user.seenEstates.includes(id)) {
            return true;
        }

        if (user.unseenMarkedEstates.includes(id)) {
            return false;
        }

        return user.readAllMark && estateDoc.updated < user.readAllMark;
    }

    return false;
}

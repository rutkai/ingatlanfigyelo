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
            seen: user ? user.seenEstates.includes(doc._id.toString()) : false
        };
    });
}

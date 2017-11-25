exports.toResponse = toResponse;
function toResponse(estateDocs) {
    return estateDocs.map(doc => {
        return {
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
            updated: doc.updated
        };
    });
}

const cheerio = require('cheerio');
const striptags = require('striptags');
const listBasedMatcher = require('./helpers/list-based-matcher');

exports.parseList = parseList;
function parseList(html) {
    const $ = cheerio.load(html);

    const profiles = $(".resultspage__listings .listing .listing__link").map(function () {
        return $(this).attr('href');
    }).get().map(url => {
        return {
            url
        };
    });

    const pagingButtons = $(".resultspage__pagination .pagination__button");
    let nextList;
    if (pagingButtons.last().text() === 'Következő oldal') {
        nextList = pagingButtons.last().attr('href');
    }

    return {
        profiles,
        nextList
    }
}

exports.parseProfile = parseProfile;
function parseProfile(html) {
    const $ = cheerio.load(html);

    const images = getImages(html);
    const price = parseFloat($(".listing .parameter-price .parameter-value").text().replace(',', '.')) * 1000000;
    const roomsData = $(".listing .parameter-room .parameter-value").text();
    const rooms = parseInt(roomsData);
    const halfrooms = roomsData.includes('fél') ? parseInt(/\d+\W*fél/i.exec(roomsData)[0]) : 0;
    const size = parseInt($(".listing .parameter-area-size .parameter-value").text());
    const addressLine = $(".listing .listing-header h1").text();

    let district = null;
    let city = 'Budapest';
    let region = 'Budapest';
    if (addressLine.includes('. kerület')) {
        district = parseInt(addressLine);
    } else {
        const breadcrumbs = $('#map-breadcrumb .map-link');
        region = breadcrumbs.eq(0).text().replace('megye', '').trim();
        city = breadcrumbs.eq(1).text().trim();
    }

    const descriptionHtml = striptags($('.details .long-description').html(), ['a', 'p', 'br', 'i', 'em', 'strong', 'ul', 'li']);
    const descriptionText = $('.details .long-description').text().trim();
    const material = listBasedMatcher.extractMaterial($('.listing-subtype').text().trim());
    let address = getAddress(html);
    if (!address) {
        address = addressLine.replace(`${district}. kerület,`, '').trim();
    }
    let floor = null;
    let elevator = null;
    let heating = null;
    let balcony = null;

    $(".card.details .paramterers tr").each(function () {
        const $row = $(this);

        let value = $row.find('td').last().text().trim();
        if (value === 'nincs megadva') {
            value = null;
        }

        switch ($row.find('td').first().text().trim()) {
            case 'Emelet':
                if (value !== null) {
                    if (value.includes('föld')) {
                        floor = 0;
                    } else {
                        floor = parseInt(value);
                    }
                } else {
                    floor = null;
                }
                break;
            case 'Lift':
                if (value !== null) {
                    elevator = value === 'van';
                }
                break;
            case 'Fűtés':
                heating = value;
                break;
            case 'Erkély':
                balcony = value !== null ? parseFloat(value) : null;
                break;
        }
    });

    return new Promise(resolve => {
        resolve({
            images,
            price,
            rooms,
            halfrooms,
            size,
            district,
            address,
            floor,
            elevator,
            heating,
            balcony,
            descriptionHtml,
            descriptionText,
            material,
            city,
            region
        });
    });
}

function getImages(html) {
    let jsSnippet = /app\.photos[^;]+;/ig.exec(html);
    if (jsSnippet) {
        jsSnippet = /\[.+]/ig.exec(jsSnippet[0]);
    }
    if (jsSnippet) {
        try {
            let carouselData = JSON.parse(jsSnippet[0]);
            return carouselData.map(item => {
                return item.large_url;
            }).filter(url => {
                return !!url;
            });
        } catch (e) {
        }
    }

    return [];
}

function getAddress(html) {
    let title = /<title>.+<\/title>/ig.exec(html);
    if (title) {
        title = /kerület.+#/i.exec(title[0]);
    }
    if (title) {
        return title[0].replace('kerület,', '').replace('#', '').trim();
    }

    return null;
}

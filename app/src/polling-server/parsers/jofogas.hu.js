const cheerio = require('cheerio');
const striptags = require('striptags');
const toArabic = require('roman-numerals').toArabic;
const listBasedMatcher = require('./helpers/list-based-matcher');

exports.parseList = parseList;
exports.parseProfile = parseProfile;


function parseList(html) {
    const $ = cheerio.load(html);

    const profiles = $(".search-list-container .list-items .list-item .subject").map(function () {
        return $(this).attr('href');
    }).get().map(url => {
        return {
            url
        };
    });

    const pagingButtons = $(".ad-list-pager-item-next");
    let nextList = pagingButtons.last().attr('href');

    return {
        profiles,
        nextList
    }
}

function parseProfile(html) {
    const $ = cheerio.load(html);

    const images = $('.newGalPic').map(function() {
        return $(this).attr('data-gallery-biggest-url');
    }).toArray();

    const price = parseInt($('.price-section .price-value').text().replace(/ /g, ''));

    const roomsMatcher = $('.rePCAP-rooms .reParamValue').text().match(/[0-9]+/);
    const rooms = roomsMatcher ? parseInt(roomsMatcher[0]) : null;

    const halfroomElement = $('.rePCAP-half_room .reParamValue');
    const halfrooms = halfroomElement.length > 0 ? parseInt(halfroomElement.text().match(/[0-9]+/)[0]) : null;
    const sizeMatcher = $('.rePAP-size .reParamValue').text().match(/[0-9]+/);
    const size = sizeMatcher ? parseInt(sizeMatcher[0]) : null;
    const address = $('.vi_map_line .street').text().trim();
    let city = 'Budapest';
    let region = 'Budapest';
    let district = null;

    if ($('.vi_map_line').text().includes('Budapest')) {
        district = toArabic($('.rePAddress .reParamValue').text().replace('.', '').trim());
    } else {
        city = $('.rePAddress .reParamValue').text().trim();
        region = $('.vi_map_line a').eq(0).text().trim();
    }

    const floorMatcher = $('.rePCAP-floor .reParamValue').text().match(/[0-9]+/);
    const floor = floorMatcher ? parseInt(floorMatcher[0]) : null;
    const elevator = $('.rePCAP-elevator .reParamValue').text().trim() !== 'Nincs';
    const heating = $('.rePCAP-heating_type .reParamValue').text().trim();
    const balcony = $('.rePCAP-balcony .reParamValue').text().trim() === 'Nincs' ? null : 1 ;
    const descriptionHtml = striptags($('.reViSection .description').html(), ['a', 'p', 'br', 'i', 'em', 'strong', 'ul', 'li']);
    const descriptionText = $('.reViSection .description').text().trim();
    const material = listBasedMatcher.extractMaterial($('.rePCAP-building_type .reParamValue').text());

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

function extractPriceSecret(html) {
    const res = html.match(/\.([a-z0-9]{41})\{display:inline-block;}/);
    return res ? res[1] : null;
}


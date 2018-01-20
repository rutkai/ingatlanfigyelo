const cheerio = require('cheerio');
const striptags = require('striptags');
const listBasedMatcher = require('./list-based-matcher');

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

function extractPriceSecret(html)
{
    const res = html.match(/\.([a-z0-9]{41})\{display:inline-block;\}/);
    return res ? res[1] : null;
}

function parseProfile(html) {
    const $ = cheerio.load(html);

    const images = $('.newGalThumbPic').map(function() {
        return $(this).attr('data-gallery-url');
    }).toArray();

    const price = parseInt($('.' + extractPriceSecret($('.price2-section').html()) + ' .price2-value').text().replace(/ /g, ''));

    const rooms = parseInt($('.rePCAP-rooms .reParamValue').text().match(/[0-9]+/)[0]);

    const halfroomElement = $('.rePCAP-half_room .reParamValue');
    const halfrooms = halfroomElement.length > 0 ? parseInt(halfroomElement.text().match(/[0-9]+/)[0]) : null;
    const size = parseInt($('.rePAP-size .reParamValue').text().match(/[0-9]+/)[0]);
    const district = $('.rePAddress .reParamValue').text().trim();
    const address = $('.vi_map_line').text().replace(/(\s|>|Cím:)+/g, ' ').trim();
    const floor = parseInt($('.rePCAP-floor .reParamValue').text().match(/[0-9]+/)[0]);
    const elevator = $('.rePCAP-elevator .reParamValue').text().trim() !== 'Nincs';
    const heating = $('.rePCAP-heating_type .reParamValue').text().trim();
    const balcony = $('.rePCAP-balcony .reParamValue').text().trim() === 'Nincs' ? null : 1 ;
    const descriptionHtml = striptags($('.reViSection .description').html(), ['a', 'p', 'br', 'i', 'em', 'strong', 'ul', 'li']);
    const descriptionText = $('.reViSection .description').text().trim();
    const flatMaterial = listBasedMatcher.extractFlatMaterial($('.rePCAP-building_type .reParamValue').text());

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
            flatMaterial
        });
    });
}


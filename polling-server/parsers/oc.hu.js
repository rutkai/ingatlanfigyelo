const cheerio = require('cheerio');
const toArabic = require('roman-numerals').toArabic;
const striptags = require('striptags');
const listBasedMatcher = require('./helpers/list-based-matcher');
const config = require('config');

let indexPage;
for (const provider of config.get('polling.providers')) {
    if (provider.name === 'Otthoncentrum') {
        indexPage = provider.parserOpts.indexPage;
    }
}

exports.parseList = parseList;
function parseList(html) {
    const $ = cheerio.load(html);

    const profiles = $(".estate-list .estate-list-item").map(function () {
        return $(this).attr('href');
    }).get().map(url => {
        return {
            url
        };
    });

    const pagingButton = $("#pagination").find(".next a");
    let nextList;
    if (pagingButton) {
        nextList = indexPage + pagingButton.attr('href');
    }

    return {
        profiles,
        nextList
    }
}

exports.parseProfile = parseProfile;
function parseProfile(html) {
    const $ = cheerio.load(html);

    const images = getImages($);
    const price = parseFloat($(".property-price.price").text().toUpperCase().replace(',', '.').replace('M', '').replace('FT', '')) * 1000000;

    let size = null, rooms = null, halfrooms = null, material = null, balcony = null;
    $('.estate-info-box > div').each(function () {
        const $row = $(this);
        const label = $row.find('.left').text().toLowerCase();

        if (label.includes('alapterület')) {
            size = parseFloat($row.find('.right').text());
        } else if (label.includes('szobák')) {
            rooms = parseInt($row.find('.right').text());
            const halfRoomsRegex = /\d+\W*félszoba/i.exec($row.find('.right').text());
            if (halfRoomsRegex) {
                halfrooms = parseInt(halfRoomsRegex[0]);
            }
        } else if (label.includes('típus')) {
            material = listBasedMatcher.extractMaterial($row.find('.right').text().trim());
        } else if (label.includes('erkély') || label.includes('terasz')) {
            balcony = parseInt($row.find('.right').text().trim());
        }
    });

    const addressBlock = $('h1 .estate-town').text().trim();
    const district = toArabic(addressBlock.substring(0, addressBlock.indexOf('.')));
    const address = addressBlock.substring(addressBlock.indexOf(',') + 1).trim();

    const descriptionHtml = striptags($('#real-estate-description').find('.description').html(), ['a', 'p', 'br', 'i', 'em', 'strong', 'ul', 'li']);
    const descriptionText = $('#real-estate-description').find('.description').text().trim();

    let elevator = null, heating = null;
    $('.property-page ul.row li').each(function () {
        const $row = $(this);
        const label = $row.text().toLowerCase();

        if (label.includes('lift')) {
            elevator = label.includes('van');
        } else if (label.includes('fűtés')) {
            heating = label.replace(/fűtés:/i, '').trim();
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
            floor: null,
            elevator,
            heating,
            balcony,
            descriptionHtml,
            descriptionText,
            material
        });
    });
}

function getImages($) {
    return $('#estate-gallery-wrap').find('img.photo').map(function () {
        return $(this).attr('data-lazy-src').replace(/\d+x\d+\/resize/i, '0x0/auto');
    }).get();
}

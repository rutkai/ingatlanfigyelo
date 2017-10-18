const cheerio = require('cheerio');
const toArabic = require('roman-numerals').toArabic;
const got = require('got');

exports.parseList = parseList;
function parseList(html) {
    const $ = cheerio.load(html);

    const profiles = $(".list .prop-card a").map(function () {
        return $(this).attr('href');
    }).get().map(url => {
        return {
            url
        };
    });
    const nextList = $(".pagination .next a").attr('href');

    return {
        profiles,
        nextList
    }
}

exports.parseProfile = parseProfile;
function parseProfile(html) {
    const $ = cheerio.load(html);

    const price = parseInt($(".container .prop-price").data('price'));
    let district = null;
    let region = null;
    let rooms = null;
    let size = null;
    let floor = null;
    let elevator = null;
    let heating = null;
    let balcony = null;

    const $locationDataList = $(".prop-stage .prop-bc li a");
    const locationDataListLength = $locationDataList.length;
    $locationDataList.each(function (index) {
        const $link = $(this);

        if ($link.text().includes('Kerület')) {
            district = toArabic($link.text().substring(0, $link.text().indexOf('.')));
        } else if (index === locationDataListLength - 1) {
            region = $link.text();
        }
    });

    $('.prop-main-attr .attr-item').each(function () {
        const $row = $(this);

        if ($row.text().includes('alapterület')) {
            size = parseInt($row.find('strong').text());
        } else if ($row.text().includes('szoba')) {
            rooms = $row.find('strong').text().replace('és fél', '+ 1').replace('és', '+').replace('fél', '').trim();
        } else if ($row.text().includes('fűtéssel')) {
            heating = $row.find('strong').text().trim();
        }
    });

    $(".prop-more-attr li").each(function () {
        const $row = $(this);

        if ($row.find('span').text().includes('Épület emelet')) {
            floor = parseInt($row.find('span').text().replace('Épület emelet:', '').replace('.', '').trim());
        } else if ($row.find('span').text().includes('erkély')) {
            balcony = parseFloat($row.find('span').text().replace('erkély:', '').trim());
            if (isNaN(balcony)) {
                balcony = 0;
            }
        }
    });

    const estateId = $('#property').data('id');
    const wait = new Promise(resolve => {
        setTimeout(resolve, 500);
    });
    return wait
        .then(() => {
            return got(`https://otthonterkep.hu/gallery?id=${estateId}&first=0`);
        })
        .then(response => {
            return getImages(response.body);
        })
        .then(images => {
            return {
                images,
                price,
                rooms,
                size,
                district,
                region,
                floor,
                elevator,
                heating,
                balcony
            };
        });
}

function getImages(html) {
    const $ = cheerio.load(html);

    return $("img.gallery-pic").map(function () {
        return $(this).attr('src') || $(this).attr('pre-src');
    }).get();
}

const RSS = require('rss');
const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;

const estatesService = require('../service/estates');
const estateRepository = require('../repository/estate');
const userRepository = require('../repository/user');

const RESULT_LIMIT = 20;

router.get('/:user((\\w+|\\d+)+)?', async function (req, res) {
    let user;

    if (req.params.user) {
        try {
            user = await userRepository.get({_id: new ObjectId(req.params.user)});
        } catch (e) {
        }
    } else {
        user = req.user;
    }

    let estates = [];
    if (user) {
        estates = await estatesService.getUnseenNonFavouriteEstates(user, 0, RESULT_LIMIT);
    } else {
        estates = await estateRepository.getEstates({}, 0, RESULT_LIMIT);
    }

    const feed = new RSS({
        title: 'Ingatlanfigyelő RSS feed',
        description: 'Az utolsó 20 megjelenített ingatlan. Bejelentkezett felhasználóknál az új ingatlanok jelennek meg a szűrőfeltételeknek megfelelően.',
        feed_url: 'https://ingatlanfigyelo.eu/rss',
        site_url: 'https://ingatlanfigyelo.eu',
        image_url: 'https://ingatlanfigyelo.eu/assets/logo.png',
        webMaster: 'András Rutkai',
        language: 'Hungarian/Magyar',
        categories: ['real estate']
    });

    for (const estate of estates) {
        feed.item({
            title: estate.district + '. kerület, ' + estate.address,
            description: 'Ár: ' + addNumberSpacing(estate.price) + ' Ft<br/>\n' +
                'Méret: ' + estate.size + 'm<sup>2</sup><br/>\n' +
                'Négyzetméterár: ' + addNumberSpacing(estate.squareMeterPrice) + ' Ft<br/>\n' +
                'Szobák: ' + estate.rooms + (estate.halfrooms ? ' + ' + estate.halfrooms : ''),
            url: 'http://ingatlanfigyelo.eu/estate/' + estate._id,
            guid: estate._id,
            date: estate.updated
        });
    }

    res.set('Content-Type', 'text/xml');
    res.send(feed.xml());
});

module.exports = router;


function addNumberSpacing(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

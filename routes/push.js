const config = require('config');
const webPush = require('web-push');
const express = require('express');
const router = express.Router();

const webpush = require('../db/webpush');
const userRepository = require('../repository/user');
const pushServer = require('../push-server/server');

webPush.setVapidDetails(
    'mailto:contact@rutkai.hu',
    config.get('express.vapid-public'),
    config.get('express.vapid-private') || process.env.VAPID_PRIVATE_KEY,
);

router.post('/subscribe', async function (req, res) {
    if (!req.isAuthenticated()) {
        res.status(403).json({
            error: 'Unauthorized!',
            code: 403
        });
        return;
    }

    if (!req.body.endpoint || !req.body.keys.p256dh || !req.body.keys.auth) {
        res.status(400).json({
            error: 'Invalid data!',
            code: 400
        });
        return;
    }

    const subscription = {
        endpoint: req.body.endpoint,
        username: req.user.username,
        keys: {
            p256dh: req.body.keys.p256dh,
            auth: req.body.keys.auth
        }
    };

    webpush.save(subscription);
    res.status(200).send('subscribed');
});

router.post('/unsubscribe', async function (req, res) {
    if (!req.isAuthenticated()) {
        res.status(403).json({
            error: 'Unauthorized!',
            code: 403
        });
        return;
    }

    if (!req.body.endpoint) {
        res.status(400).json({
            error: 'Invalid data!',
            code: 400
        });
        return;
    }

    webpush.remove(req.user.username);
    res.status(200).send('unsubscribed');
});

module.exports = router;


setInterval(checkUpdates, 60000);

async function checkUpdates() {
    const subscriptions = await webpush.getAll();

    for (const subscription of subscriptions) {
        const user = await userRepository.getByUsername(subscription.username);
        const estates = await pushServer.getUpdatedEstateList(user);
        if (estates.length) {
            sendWebpush(subscription, estates);
        }
    }
}

function sendWebpush(subscription, estates) {
    const payload = JSON.stringify({
        title: 'Új ingatlan!',
        body: estates.length + ' új ingatlan került fel az ingatlanfigyelőbe',
        icon: '/assets/favicon/android-icon-192x192.png'
    });

    const options = {
        TTL: 3600 // 1h
    };

    webPush.sendNotification(
        subscription,
        payload,
        options
    );
}

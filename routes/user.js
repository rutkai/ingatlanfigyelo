const express = require('express');
const passport = require('passport');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();

const tokenUtils = require('../utils/token');
const cache = require('../cache/cache');
const email = require('../email/email');
const userRepository = require('../repository/user');

router.get('/profile', function (req, res) {
    if (req.isAuthenticated()) {
        res.json({
            user: getUserProfile(req.user)
        });
        return;
    }

    res.status(403).json({
        error: 'Unauthorized!',
        code: 403
    });
});

router.post('/login', passport.authenticate('local'), function (req, res) {
    res.json({
        user: getUserProfile(req.user)
    });
});

router.get('/logout', function (req, res) {
    req.logout();
    res.json({});
});

router.post('/password-recovery', async function (req, res) {
    if (!req.body.username) {
        res.status(400).json({
            error: 'Invalid data!',
            code: 400
        });
        return;
    }

    const cleanedUsername = req.body.username.replace(/\W/g, '');
    if (!cleanedUsername) {
        res.status(400).json({
            error: 'Invalid data!',
            code: 400
        });
        return;
    }

    const user = await userRepository.getByUsername(req.body.username);
    if (!user) {
        res.status(404).json({
            error: 'Username not found!',
            code: 404
        });
        return;
    }

    if (await cache.get(`password-recovery-lock-${cleanedUsername}`)) {
        res.status(429).json({
            error: 'Too many requests!',
            code: 429
        });
        return;
    }
    cache.set(`password-recovery-lock-${cleanedUsername}`, true, 120);

    const token = tokenUtils.generate(req.body.username);
    cache.set(`password-recovery-token-${user._id}`, token, 7200);
    email.sendEmail('password-recovery', req.body.username, 'Ingatlanfigyelő elfelejtett jelszó', {id: user._id, token})
        .then(() => {
            res.json({});
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: 'Error during email sending!',
                code: 500
            });
        });
});

router.put('/password-reset', async function (req, res) {
    if (!req.body.token || !req.body.id || !req.body.password) {
        res.status(400).json({
            error: 'Invalid data!',
            code: 400
        });
        return;
    }

    const token = await cache.get(`password-recovery-token-${req.body.id}`);
    if (token !== req.body.token) {
        res.status(400).json({
            error: 'Invalid token!',
            code: 400
        });
        return;
    }

    const user = await userRepository.get({_id: ObjectId(req.body.id)});
    if (!user) {
        res.status(400).json({
            error: 'Invalid token!',
            code: 400
        });
        return;
    }

    await userRepository.setPassword(user, req.body.password);
    cache.del(`password-recovery-token-${req.body.id}`);

    res.json({});
});

router.post('/register', function (req, res) {
    if (!req.body.username || !isEmailAddress(req.body.username) || !req.body.password) {
        res.status(400).json({
            error: 'Invalid data!',
            code: 400
        });
        return;
    }

    userRepository.isUsernameTaken(req.body.username)
        .then(exists => {
            if (exists) {
                res.status(409).json({
                    error: 'User already exists!',
                    code: 409
                });
                throw new Error('User already exists!');
            }

            return userRepository.create(req.body.username, req.body.password);
        })
        .then(() => {
            res.json({});
        })
        .catch(() => {});
});

router.put('/view', async function (req, res) {
    if (!req.isAuthenticated()) {
        res.status(403).json({
            error: 'Unauthorized!',
            code: 403
        });
        return;
    }

    const view = req.body.view;
    if (!view || !['cards', 'inline'].includes(view)) {
        res.status(400).json({
            error: 'Invalid data!',
            code: 400
        });
        return;
    }

    await userRepository.updateView(req.user, view);

    res.json({});
});

router.put('/notification-frequency', async function (req, res) {
    if (!req.isAuthenticated()) {
        res.status(403).json({
            error: 'Unauthorized!',
            code: 403
        });
        return;
    }

    const frequency = req.body.frequency;
    if (isNaN(frequency)) {
        res.status(400).json({
            error: 'Invalid data!',
            code: 400
        });
        return;
    }

    await userRepository.updateNotificationFrequency(req.user, frequency);

    res.json({});
});

router.put('/notification-quiet-time', async function (req, res) {
    if (!req.isAuthenticated()) {
        res.status(403).json({
            error: 'Unauthorized!',
            code: 403
        });
        return;
    }

    const quietHours = req.body.quietHours;
    if (!isQuietHoursValid(quietHours)) {
        res.status(400).json({
            error: 'Invalid data!',
            code: 400
        });
        return;
    }

    await userRepository.updateNotificationQuietHours(req.user, quietHours);

    res.json({});
});

module.exports = router;


function isEmailAddress(string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(string);
}

function isQuietHoursValid(quietHours) {
    if (typeof quietHours !== 'object') {
        return false;
    }

    if (typeof quietHours.start !== 'object' || typeof quietHours.end !== 'object') {
        return false;
    }

    if (typeof quietHours.start.hours !== 'number' || typeof quietHours.start.minutes !== 'number' ||
        typeof quietHours.end.hours !== 'number' || typeof quietHours.end.minutes !== 'number') {
        return false;
    }

    try {
        Intl.DateTimeFormat(undefined, {timeZone: quietHours.start.timezone});
        Intl.DateTimeFormat(undefined, {timeZone: quietHours.end.timezone});
    } catch (e) {
        return false;
    }

    return true;
}

function getUserProfile(user) {
    return {
        id: user._id,
        username: user.username,
        view: user.view,
        notificationFrequency: user.notificationFrequency,
        notificationQuietHours: user.notificationQuietHours,
        filterGroups: user.filterGroups
    };
}

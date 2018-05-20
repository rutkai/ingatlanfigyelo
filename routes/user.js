const express = require('express');
const passport = require('passport');
const router = express.Router();

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

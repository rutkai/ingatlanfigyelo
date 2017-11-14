const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcrypt');
const config = require('config');

const users = require('../db/user');

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

    users.has(req.body.username)
        .then(exists => {
            if (exists) {
                res.status(409).json({
                    error: 'User already exists!',
                    code: 409
                });
                throw new Error('User already exists!');
            }

            return users.save({
                username: req.body.username,
                passwordHash: calculatePasswordHash(req.body.password),
                filterGroups: []
            });
        })
        .then(() => {
            res.json({});
        })
        .catch(() => {});
});

module.exports = router;


function isEmailAddress(string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(string);
}

function calculatePasswordHash(password) {
    const salt = bcrypt.genSaltSync(config.get('express.authentication.rounds'));
    return bcrypt.hashSync(password, salt);
}

function getUserProfile(user) {
    return {
        username: user.username,
        filterGroups: user.filterGroups
    };
}

const bcrypt = require('bcrypt');
const config = require('config');
const users = require('../db/user');

exports.create = create;
function create(username, password) {
    return users.save({
        username: username,
        passwordHash: calculatePasswordHash(password),
        filterGroups: [],
        lastRefresh: new Date()
    });
}

exports.isUsernameTaken = isUsernameTaken;
function isUsernameTaken(username) {
    return users.has(username);
}

exports.getByUsername = getByUsername;
function getByUsername(username) {
    return users.get({username});
}

exports.resetLastRefresh = resetLastRefresh;
function resetLastRefresh(user) {
    user.lastRefresh = new Date();
    return users.save(user);
}

exports.updateFilters = updateFilters;
function updateFilters(user, filterGroups) {
    user.filterGroups = filterGroups;
    return users.save(user);
}


function calculatePasswordHash(password) {
    const salt = bcrypt.genSaltSync(config.get('express.authentication.rounds'));
    return bcrypt.hashSync(password, salt);
}

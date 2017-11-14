const express = require('express');
const router = express.Router();
const validator = require('../filter/validator');
const users = require('../db/user');

router.put('/save', function (req, res) {
    const filterDefs = req.body;
    if (!filterDefs || !validator.validate(filterDefs)) {
        res.status(400).json({
            error: 'Invalid data',
            code: 400
        });
        return;
    }

    const user = req.user;
    user.filterGroups = filterDefs;
    users.save(user)
        .then(() => {
            res.json({});
        });
});

module.exports = router;

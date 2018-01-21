const express = require('express');
const router = express.Router();
const validator = require('../filter/validator');
const userRepository = require('../repository/user');

router.put('/save', function (req, res) {
    if (!req.isAuthenticated()) {
        res.status(403).json({
            error: 'Unauthorized!',
            code: 403
        });
        return;
    }

    const filterDefs = req.body;
    if (!filterDefs || !validator.validate(filterDefs)) {
        res.status(400).json({
            error: 'Invalid data',
            code: 400
        });
        return;
    }

    userRepository.updateFilters(req.user, filterDefs)
        .then(() => {
            res.json({});
        });
});

module.exports = router;

const express = require('express');
const router = express.Router();

router.put('/save', function(req, res) {
    console.log(req.body);

    res.json({});
});

module.exports = router;

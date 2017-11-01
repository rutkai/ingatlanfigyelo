function authenticationMiddleware () {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(403).json({
            error: 'Unauthorized!',
            code: 403
        });
    }
}

module.exports = authenticationMiddleware;

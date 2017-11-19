const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const users = require('../db/user');
const userRepository = require('../repository/user');

passport.serializeUser(function (user, cb) {
    cb(null, user.username)
});

passport.deserializeUser(function (username, cb) {
    userRepository.getByUsername(username)
        .then(user => {
            if (user) {
                cb(null, user);
            } else {
                cb(null);
            }
        });
});

exports.init = init;
function init() {
    passport.use(new LocalStrategy(
        (username, password, done) => {
            userRepository.getByUsername(username)
                .then(user => {
                    // User not found
                    if (!user) {
                        return done(null, false)
                    }

                    // Always use hashed passwords and fixed time comparison
                    bcrypt.compare(password, user.passwordHash, (err, isValid) => {
                        if (err) {
                            return done(err)
                        }
                        if (!isValid) {
                            return done(null, false)
                        }
                        return done(null, user)
                    })
                });
        }
    ));

    users.checkIndices();
}

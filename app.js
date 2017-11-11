const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const RateLimit = require('express-rate-limit');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const config = require('config');

const db = require('./db/db');
const passportAuth = require('./auth/init');
const pollingServer = require('./polling-server/server');

const authEndpoints = require('./routes/auth');
const filtersEndpoints = require('./routes/filters');
const loadEstates = require('./routes/load-estates');

const app = express();

exports.start = start;
function start() {
    return db.init()
        .then(() => {
            // uncomment after placing your favicon in /public
            //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
            app.use(logger('dev'));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({extended: false}));
            app.use(cookieParser());
            app.use(express.static(path.join(__dirname, 'public')));

            passportAuth.init();
            app.use(session({
                store: new MongoStore({
                    db: db.getConnection()
                }),
                secret: config.get('express.session-secret'),
                resave: false,
                saveUninitialized: false
            }));
            app.use(passport.initialize());
            app.use(passport.session());

            const userLimiter = new RateLimit({
                windowMs: 120000,
                delayAfter: 0,
                max: 8,
            });
            const filterLimiter = new RateLimit({
                windowMs: 60000,
                delayAfter: 0,
                max: 30,
            });
            const apiLimiter = new RateLimit({
                windowMs: 60000,
                delayAfter: 3,
                delayMs: 3000,
                max: 0,
            });

            app.use('/user', userLimiter, authEndpoints);
            app.use('/filters', filterLimiter, filtersEndpoints);
            app.use('/load-estates', apiLimiter, loadEstates);

            // catch 404 and forward to error handler
            app.use(function (req, res, next) {
                const err = new Error('Not Found');
                err.status = 404;
                next(err);
            });

            // error handler
            app.use(function (err, req, res) {
                // set locals, only providing error in development
                res.locals.message = err.message;
                res.locals.error = req.app.get('env') === 'development' ? err : {};

                // render the error page
                res.status(err.status || 500);
                res.render('error');
            });

            return pollingServer.init();
        })
        .then(() => {
            pollingServer.start();
            return app;
        });
}

const express = require('express');
const expressWsFactory = require('express-ws');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const RateLimit = require('express-rate-limit');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const config = require('config');
const Raven = require('raven');

const db = require('./db/db');
const passportAuth = require('./auth/init');
const pushServer = require('./push-server/server');

const authEndpoints = require('./routes/auth');
const filtersEndpoints = require('./routes/filters');
const loadEstates = require('./routes/load-estates');


exports.getApp = getApp;
function getApp() {
    return db.init()
        .then(() => {
            const app = express();

            Raven.config(config.get('sentry.web')).install();
            app.use(Raven.requestHandler());

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
                delayAfter: 10,
                delayMs: 3000,
                max: 0,
            });

            app.use('/user', userLimiter, authEndpoints);
            app.use('/filters', filterLimiter, filtersEndpoints);
            app.use('/load-estates', apiLimiter, loadEstates);

            app.use(Raven.errorHandler());

            return app;
        });
}

exports.attachErrorHandlers = attachErrorHandlers;
function attachErrorHandlers(app) {
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        console.error(req);

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
}

exports.getWss = getWss;
function getWss(app, server) {
    const expressWs = expressWsFactory(app, server);

    app.ws('/poll', function (ws, req) {
        ws.isAlive = true;
        ws.on('pong', function () {
            this.isAlive = true;
        });

        if (!req.isAuthenticated()) {
            return;
        }

        let timer = createRefreshTimer(ws, req.user);
        ws.on('close', () => {
            clearInterval(timer);
        });
    });

    createHeartbeatCheck(expressWs.getWss());

    return expressWs.getWss();
}


function createHeartbeatCheck(wss) {
    return setInterval(function ping() {
        wss.clients.forEach(function each(ws) {
            if (ws.isAlive === false) {
                return ws.terminate();
            }

            ws.isAlive = false;
            ws.ping('', false, true);
        });
    }, 3 * 60 * 1000);
}

function createRefreshTimer(ws, user) {
    return setInterval(function () {
        if (ws.isAlive) {
            pushServer.getUpdatedEstateList(user)
                .then(estates => {
                    if (estates.length) {
                        ws.send(JSON.stringify({
                            id: 'new-estates',
                            estates
                        }));
                    }
                });
        }
    }, 60000);
}
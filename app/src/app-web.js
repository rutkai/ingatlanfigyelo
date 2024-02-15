const express = require('express');
const expressWsFactory = require('express-ws');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const config = require('config');
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const envUtils = require('./utils/env');
const db = require('./db/db');
const webpush = require('./db/webpush');
const passportAuth = require('./auth/init');
const pushServer = require('./push-server/server');

const userEndpoints = require('./routes/user');
const filtersEndpoints = require('./routes/filters');
const push = require('./routes/push');
const rss = require('./routes/rss');
const stats = require('./routes/stats');
const estates = require('./routes/estates');
const estate = require('./routes/estate');


exports.getApp = getApp;
function getApp() {
    return db.init()
        .then(async () => {
            await webpush.migrate();
        })
        .then(async () => {
            const app = express();

            Sentry.init({
                dsn: config.get('sentry.polling'),
                integrations: [
                    new Sentry.Integrations.Http({ tracing: true }),
                    new Tracing.Integrations.Express({ app }),
                ],
                tracesSampleRate: 1.0
            });

            app.use(Sentry.Handlers.requestHandler());
            app.use(Sentry.Handlers.tracingHandler());

            if (envUtils.isDev()) {
                app.use(logger('dev'));
                app.use(require('cors')({
                    origin: true,
                    credentials: true
                }));
            }
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({extended: false}));
            app.use(cookieParser());
            if (envUtils.isDev()) {
                app.use(express.static(path.join(__dirname, '..', 'public')));
            }

            await passportAuth.init();
            app.use(session({
                store: MongoStore.create({
                    client: db.getClient(),
                    dbName: db.getCollectionName(),
                }),
                secret: config.get('express.session-secret'),
                resave: false,
                saveUninitialized: false
            }));
            app.use(passport.initialize());
            app.use(passport.session());

            const userLimiter = rateLimit({
                windowMs: 120000,
                max: 30,
            });
            const filterLimiter = rateLimit({
                windowMs: 60000,
                max: 50,
            });
            const pushLimiter = rateLimit({
                windowMs: 60000,
                max: 30,
            });
            const rssLimiter = rateLimit({
                windowMs: 60000,
                max: 20,
            });
            const statsLimiter = rateLimit({
                windowMs: 60000,
                max: 20,
            });
            const apiLimiter = rateLimit({
                windowMs: 60000,
                max: 0,
            });
            const estateLimiter = rateLimit({
                windowMs: 60000,
                max: 100,
            });

            app.use('/user', userLimiter, userEndpoints);
            app.use('/filters', filterLimiter, filtersEndpoints);
            app.use('/push', pushLimiter, push);
            app.use('/rss', rssLimiter, rss);
            app.use('/stats', statsLimiter, stats);
            app.use('/estates', apiLimiter, estates);
            app.use('/estate', estateLimiter, estate);

            app.use(Sentry.Handlers.errorHandler());

            return app;
        });
}

exports.attachErrorHandlers = attachErrorHandlers;
function attachErrorHandlers(app) {
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        console.error('Not found: ' + req.url);

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

        let timer = createRefreshTimer(ws, req.user.username);
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
            ws.ping();
        });
    }, 3 * 60 * 1000);
}

const userRepository = require('./repository/user');
function createRefreshTimer(ws, username) {
    return setInterval(async function () {
        if (ws.isAlive) {
            const user = await userRepository.getByUsername(username);
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

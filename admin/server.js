require('colors');

var fs = require('fs'),
    path = require('path');
var cli = require('express-admin/lib/app/cli'),
    project = require('express-admin/lib/app/project');

var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    multipart = require('connect-multiparty'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    csrf = require('csurf'),
    methodOverride = require('method-override'),
    serveStatic = require('serve-static'),
    consolidate = require('consolidate'),
    hogan = require('hogan.js');

var moment = require('moment'),
    async = require('async');

var Client = require('express-admin/lib/db/client'),
    schema = require('express-admin/lib/db/schema'),
    settings = require('express-admin/lib/app/settings'),
    routes = require('express-admin/lib/app/routes');

var Xsql = require('xsql'),
    qb = require('express-admin/lib/qb');

var xAdmin = require('express-admin');

var User = require('../models/user').User;
var knex = require('../libs/db').knex;

var config = {
    dpath: './admin',
    config: require('./config.json'),
    settings: require('./settings.json'),
    custom: require('./custom.json'),
    users: require('./users.json')
};

var initServer = function(args) {
    var r = require('express-admin/routes');

    // override login function to use spark DB
    var r_auth_login = function (req, res) {
        // query the db for the given username
        new User({email: req.body.username}).fetch().then(function (user) {
            if (user === null || !user.validPassword(req.body.password) || !user.attributes.validated || !user.attributes.enabled || !user.isAdmin) {
                req.session.error = "Could not find a valid user";
                req.session.username = req.body.username;
                res.redirect(res.locals.root+'/login');
            } else {
                req.session.regenerate(function () {
                    req.session.user = user;
                    res.redirect(res.locals.root+'/');
                });
            }
        });
    };

    // general settings
    var app = express()
        .set('views', path.resolve('node_modules/express-admin/views'))
        .set('view engine', 'html')
        .engine('html', consolidate.hogan)

        .use(logger('dev'))
        .use(bodyParser.json())
        .use(bodyParser.urlencoded({extended: true}))
        .use(multipart())

        .use(cookieParser())
        .use(args.session || session({name: 'express-admin', secret: 'very secret - required',
                saveUninitialized: true, resave: true}))
        .use(r.auth.status)// session middleware
        .use(csrf())

        .use(methodOverride())
        .use(serveStatic(path.join('node_modules', 'express-admin', 'public')))
        .use(serveStatic((function () {
            return path.resolve('node_modules/express-admin-static');
        })()));

    if (!args.debug) app.set('view cache', true);

    // register custom static local paths
    for (var key in args.custom) {
        var assets = args.custom[key].public;
        if (!assets || !assets.local || !assets.local.path ||
            !fs.existsSync(assets.local.path)) continue;
        app.use(serveStatic(assets.local.path));
    }

    // pass server wide variables
    app.use(function (req, res, next) {
        // app data
        res.locals._admin = args;

        // i18n
        var lang = req.cookies.lang || 'en';
        res.cookie('lang', lang, {path: '/', maxAge: 900000000});
        moment.locale(lang == 'cn' ? 'zh-cn' : lang);

        // template vars
        res.locals.string = args.langs[lang];
        res.locals.root = args.config.app.root;
        res.locals.libs = args.libs;
        res.locals.themes = args.themes;
        res.locals.layouts = args.layouts;
        res.locals.languages = args.languages;

        // required for custom views
        res.locals._admin.views = app.get('views');

        next();
    });

    // routes

    // init regexes
    var _routes = routes.init(args.settings, args.custom);

    // register custom apps
    (function () {
        var have = false;
        for (var key in args.custom) {
            var _app = args.custom[key].app;
            if (_app && _app.path && fs.existsSync(_app.path)) {
                var view = require(_app.path);
                app.use(view);
                have = true;
            }
        }
        if (have && _routes.custom) app.all(_routes.custom, r.auth.restrict, r.render.admin);
    }());

    // login/logout
    app.get('/login', r.login.get, r.render.admin);
    app.post('/login', r_auth_login);
    app.get('/logout', r.auth.logout);

    // editview
    app.get(_routes.editview, r.auth.restrict, r.editview.get, r.render.admin);
    app.post(_routes.editview, r.auth.restrict, r.editview.post, r.render.admin);

    // listview
    app.get(_routes.listview, r.auth.restrict, r.listview.get, r.render.admin);
    app.post(_routes.listview, r.auth.restrict, r.listview.post, r.render.admin);

    // mainview
    app.get(_routes.mainview, r.auth.restrict, r.mainview.get, r.render.admin);

    // not found
    app.all('*', r.auth.restrict, r.notfound.get, r.render.admin);

    return app;
};

xAdmin.initDatabase(config, function (err) {
    if (err) {
        console.log(err);
    } else {
        xAdmin.initSettings(config);
        var app = initServer(config);
    }
    app.listen(3030, function () {
        console.log('Spark admin site listening on port 3030');
    });
});

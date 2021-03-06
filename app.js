var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

mongoose.connect(config.db);

var app = express();


app.locals.title = config.app.title;

// Globbing model files
config.getGlobbedFiles('./app/models/**/*.js').forEach(function (modelPath) {
    require(path.resolve(modelPath));
});


// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

var usersController = require('./app/controllers/users');
usersController.createMasterUser();


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    resave: true,
    store: new mongoStore({
        url: config.db,
        collection: config.sessionCollection
    })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {

    if (req.url !== "/login/") {
        if (!req.isAuthenticated()) {
            res.redirect('/login/');
            return res.send(401, {
                message: 'User is not logged in'
            });
        }

    }

    next();
});

config.getGlobbedFiles('./app/routes/**/*.js').forEach(function (routePath) {
    require(path.resolve(routePath))(app);
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res,) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

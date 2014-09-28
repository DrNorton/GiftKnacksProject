    //boot/express.js
var config = require("nconf");
var express = require('express');
var passport = require('passport');
var connect = require('connect');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var connectSession = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');

var path = require('path');


module.exports = function (app) {
    app.set('port', process.env.PORT || 3000);
    app.set('view engine', 'jade');
    app.use(cookieParser());
    app.use(connectSession({ secret: 'your secret here', maxAge: 24 * 60 * 60 * 1000, cookie: { httpOnly: false } }));
    app.use(bodyParser());
    app.use(flash());
  
 
    app.use(passport.initialize());
    app.use(passport.session());
};
    //boot/express.js
var config = require("nconf");
var express = require('express');
var passport = require('passport');
var connect = require('connect');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var exphbs = require('express3-handlebars');

var path = require('path');


module.exports = function (app) {
    app.set('port', process.env.PORT || 3000);
    app.use(cookieParser());
 //   app.use(connect.session({ secret: 'your secret here', maxAge: 24 * 60 * 60 * 1000, cookie: { httpOnly: false } }));
    app.use(bodyParser());
   
  
 
    app.use(passport.initialize());
    app.use(passport.session());
};
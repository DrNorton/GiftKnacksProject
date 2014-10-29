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
var cors = require('cors');
var jwt = require('jsonwebtoken'); //https://npmjs.org/package/node-jsonwebtoken
var expressJwt = require('express-jwt'); //https://npmjs.org/package/express-jwt

var path = require('path');

module.exports = function (app) {
	app.set('port', process.env.PORT || 3000);
	app.set('view engine', 'jade');
	app.use(cookieParser());
	app.use(cors());
	app.use(connectSession({ secret: config.get("session:secret"), maxAge: config.get("session:maxAge"), cookie: { httpOnly: config.get("session:cookie:httpOnly"), path: config.get("session:cookie:path"), } }));
	app.use(bodyParser());
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
};
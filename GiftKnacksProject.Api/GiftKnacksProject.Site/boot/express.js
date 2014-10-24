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

var path = require('path');

/*var allowCrossDomain = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	
	// intercept OPTIONS method
	if ('OPTIONS' == req.method) {
		res.status(200).end();
	}
	else {
		next();
	}
};*/

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
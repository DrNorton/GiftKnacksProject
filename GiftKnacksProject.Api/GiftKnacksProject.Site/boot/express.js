    //boot/express.js
var config = require("nconf");
var express = require('express');
var passport = require('passport');
var connect = require('connect');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
var jwt = require('jsonwebtoken'); //https://npmjs.org/package/node-jsonwebtoken
var expressJwt = require('express-jwt'); //https://npmjs.org/package/express-jwt


module.exports = function (app) {
    app.set('port', process.env.PORT || 3000);
    app.use(cors());
    app.use('/api', expressJwt({ secret: config.get("session:secret") }));
    app.use(bodyParser());
    app.use(passport.initialize());
    app.use(passport.session());
};
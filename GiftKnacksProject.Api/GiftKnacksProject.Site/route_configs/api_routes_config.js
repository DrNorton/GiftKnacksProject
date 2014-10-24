var express = require('express');
var router = express.Router();
var AuthRouter = require('../api/routers/auth_router').AuthRouter;
var WishRouter = require('../api/routers/wish_router').WishRouter;


var authRouter = new AuthRouter();
var wishRouter = new WishRouter();

router.route('/auth/:action').get(function (req, res, next) {
    authRouter.route(req, res, next);
}).post(function (req, res, next) {
    authRouter.route(req, res, next);
});

router.route('/wish/:action').get(function (req, res, next) {
    wishRouter.route(req, res, next);
}).post(function (req, res, next) {
    wishRouter.route(req, res, next);
});

module.exports.router = router;




//http://scotch.io/tutorials/javascript/learn-to-use-the-new-router-in-expressjs-4
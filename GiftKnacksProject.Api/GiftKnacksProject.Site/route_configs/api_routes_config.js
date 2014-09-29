var express = require('express');
var router = express.Router();
var AuthRouter = require('../api/routers/auth_router').AuthRouter;
var authRouter = new AuthRouter();

router.route('/auth/:action').get(function (req, res, next) {
    authRouter.route(req, res, next);
}).post(function (req, res, next) {
    authRouter.route(req, res, next);
});

module.exports.router = router;




//http://scotch.io/tutorials/javascript/learn-to-use-the-new-router-in-expressjs-4
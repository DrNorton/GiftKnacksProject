var express = require('express');
var router = express.Router();
var RestrictAuthRouter = require('../api/routers/restrict_auth_router').RestrictAuthRouter;
var WishRouter = require('../api/routers/wish_router').WishRouter;


var restrictAuthRouter = new RestrictAuthRouter();

router.route('/auth/:action').get(function (req, res, next) {
    restrictAuthRouter.route(req, res, next);
}).post(function (req, res, next) {
    restrictAuthRouter.route(req, res, next);
});

module.exports.router = router;
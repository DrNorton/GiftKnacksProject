var express = require('express');
var router = express.Router();
var AuthRouter = require('../api/routers/auth_router').AuthRouter;
var authRouter = new AuthRouter();



router.route('/auth/:action').get(function (req, res) {
    authRouter.route(req, res);
}).post(function (req, res) {
    authRouter.route(req, res);
});
    

module.exports.router = router;




//http://scotch.io/tutorials/javascript/learn-to-use-the-new-router-in-expressjs-4
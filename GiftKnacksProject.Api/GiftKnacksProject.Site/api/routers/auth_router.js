
var BaseRouter = require('./base_router').BaseRouter;
var AuthManager = require('../managers/auth_manager').AuthManager;


var AuthRouter = function () {
    this.authManager = new AuthManager();
};

AuthRouter.prototype = new BaseRouter();

AuthRouter.prototype._doRoute = function (action, params, req, response,next) {
    var self = this;
    switch (action) {
        case 'login':
			this.authManager.login(req, response, next, params,
							 function (user) {
                req.logIn(user, function (err) {
                    if (err) {
                        response.sendError(response, err, 1);
                    }
                    response.sendResult(user);
                });
            },  response.sendError);
            break;

        case 'register':
            var email, pass;
                email = req.body.login;
                pass = req.body.pass;

            this.authManager.register(email,pass, function (result) {
                response.sendResult(result);
            },  response.sendError);
            
            break;

        case 'changepassword':
            var oldpass = req.body.oldpass;
            var newpass = req.body.newpass;
            var userid=req.session.userid;
            this.authManager.changePassword(userid,oldpass, newpass, function (result) {
                response.sendResult(result);
            }, response.sendError);

            break;
    }

};

exports.AuthRouter = AuthRouter;
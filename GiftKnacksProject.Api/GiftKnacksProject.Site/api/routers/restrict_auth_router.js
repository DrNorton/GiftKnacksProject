
var BaseRouter = require('./base_router').BaseRouter;
var AuthManager = require('../managers/auth_manager').AuthManager;


var RestrictAuthRouter = function () {
    this.authManager = new AuthManager();
};

RestrictAuthRouter.prototype = new BaseRouter();

RestrictAuthRouter.prototype._doRoute = function (action, params, req, response, next) {
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
            }, response.sendError);
            break;

        case 'register':
            var email, pass;
            email = req.body.username;
            pass = req.body.password;
            
            this.authManager.register(email, pass, function (result) {
                response.sendResult(result);
            }, response.sendError);
            
            break;

       
    }

};

exports.RestrictAuthRouter = RestrictAuthRouter;
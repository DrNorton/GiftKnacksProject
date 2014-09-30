
var BaseRouter = require('./base_router').BaseRouter;
var AuthManager = require('../managers/auth_manager').AuthManager;


var AuthRouter = function () {
    this.authManager = new AuthManager();
};

AuthRouter.prototype = new BaseRouter();

AuthRouter.prototype._doRoute = function (action, params, req, response,next) {
    var self = this;
    switch (action) {
        case 'logon':
            this.authManager.logon(req, response, next,params, function (user) {
                req.logIn(user, function (err) {
                    if (err) {
                        response.sendError(response, err, 1);
                    }
                    response.sendResult(user);
                });
            },  response.sendError);
            break;

        case 'register':
            var login, pass;
            if (req.method == "GET") {
                login = params.login;
                pass = params.pass;
            }
            if (req.method == "POST") {
                login = req.body.login;
                pass = req.body.pass;
            }

            this.authManager.register(login,pass, function (result) {
                response.sendResult(result);
            },  response.sendError);
            
            break;
    }

};

exports.AuthRouter = AuthRouter;
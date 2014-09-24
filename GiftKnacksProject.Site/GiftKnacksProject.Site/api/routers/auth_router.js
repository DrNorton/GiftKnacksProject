var BaseRouter = require('./base_router').BaseRouter;
var AuthManager = require('../managers/auth_manager').AuthManager;

var AuthRouter = function () {
    this.authManager = new AuthManager();
};

AuthRouter.prototype = new BaseRouter();

AuthRouter.prototype._doRoute = function (action, params, response, req) {
    var self = this;
   
    switch (action) {
        case 'logon':
            this.authManager.logon(params, function (login, userId) {
                req.session.authorized = true;
                req.session.username = login;
                req.session.userId = userId;
                response.sendResult(login);
            }, function (errorMessage, code) {
                self._sendError(response, errorMessage, code);
            });

            break;

    }

};

exports.AuthRouter = AuthRouter;
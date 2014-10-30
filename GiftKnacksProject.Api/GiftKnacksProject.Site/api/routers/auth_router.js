
var BaseRouter = require('./base_router').BaseRouter;
var AuthManager = require('../managers/auth_manager').AuthManager;


var AuthRouter = function () {
    this.authManager = new AuthManager();
};

AuthRouter.prototype = new BaseRouter();

AuthRouter.prototype._doRoute = function (action, params, req, response,next) {
    var self = this;
    switch (action) {

        case 'changepassword':
            var oldpass = req.body.oldpassword;
            var newpass = req.body.newpassword;
            var userid=req.user.UserId;
            this.authManager.changePassword(userid,oldpass, newpass, function (result) {
                response.sendResult(result);
            }, response.sendError);

            break;
    }

};

exports.AuthRouter = AuthRouter;
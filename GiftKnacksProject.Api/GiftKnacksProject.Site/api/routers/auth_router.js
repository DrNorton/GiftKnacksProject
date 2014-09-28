var passport = require('passport');
var BaseRouter = require('./base_router').BaseRouter;
var AuthManager = require('../managers/auth_manager').AuthManager;


var AuthRouter = function (passport) {
    this.passport = passport;
    this.authManager = new AuthManager();
};

AuthRouter.prototype = new BaseRouter();

AuthRouter.prototype._doRoute = function (action, params, req, response,next) {
    var self = this;
   
    switch (action) {
        case 'logon':

            passport.authenticate('local', function (err, user, info) {
                if (err) { response.sendError("BadLogin", 401); }
                if (!user) {
                    //Фейл регистрации
                    self._sendError(response, "BadLogin", 401);
                } else {
                    req.logIn(user, function (err) {
                        if (err) {
                            onError(err, 1);
                        }
                        response.sendResult(user);
                    });  
                }
             
            })(req, response, next);
    

            break;

    }

};

exports.AuthRouter = AuthRouter;
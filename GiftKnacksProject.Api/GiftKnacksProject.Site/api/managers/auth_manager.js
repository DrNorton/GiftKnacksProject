var SqlManager = require("./sql_manager").SqlManager;
var sql = require("mssql");
//var PasswordHelper = require("./passwordHelper").PasswordHelper;
var passport = require('passport');
var PasswordHelper = require("./passwordHelper").PasswordHelper;
var AuthLocalStrategy = require('passport-local').Strategy;
var sqlManager = new SqlManager();

var AuthManager = function () {
    this.sqlManager = sqlManager;
    this.passwordHelper = new PasswordHelper();
};

var sqlManager = new SqlManager();

var AuthManager = function () {
  
};
passport.use('local', new AuthLocalStrategy(
    function (username, password, done) {
        FindUserByLogin(username, function() {
            return done(null, {
                username: "admin",
                photoUrl: "url_to_avatar",
                profileUrl: "url_to_profile"
            });
        }, function(code,message) {
                return done(null, false, {
                    message: 'Неверный логин или пароль'
                });
        });
   
    
}
));

AuthManager.prototype.logon = function (req, response, next,params, onSuccess, onError) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            onError("BadLogin", 401);
        }
        if (!user) {
            //Фейл регистрации
            onError("BadLogin", 401);
        } else {
            onSuccess(user);
        }
             
    })(req, response, next);
};

AuthManager.prototype.register = function (login, pass, onSuccess, onError) {
    var md5Hash = this.passwordHelper.createHash(pass);
    CheckEmailExists(login, function() {
        //Такая почта не зарегана
        var params = [{ name: "Email", type: sql.NVarChar(50), value: login, isOutput: false },{ name: "Password", type: sql.NVarChar(50), value: md5Hash, isOutput: false },{ name: "new_identity", type: sql.BigInt, isOutput: true }];
        this.sqlManager.invoke("[dbo].[Register]", params, function (result) {
            onSuccess(result);
        }, onError);
    }, function() {
        //Такая почта уже существует
        onError("Данный почтовый адрес уже зарегистрирован", 1);
    }, onError);
};

function CheckEmailExists(login, onNotExists, onExists, onError) {
    var params = [{ name: "Email", type: sql.NVarChar(50), value: login, isOutput: false }];
    this.sqlManager.invoke("[dbo].[GetUserByEmail]",params, function (result) {
        if (result.length == 0) {
            onNotExists();
        }
        else {
            onExists();
        }
    }, onError);
};

var FindUserByLogin=function(login, onSuccess, onError) {
    var self = this;
    var params = [{ name: "Email", type: sql.NVarChar(50), value: login, isOutput: false }];
    sqlManager.invoke("[dbo].[GetUserByEmail]", params, function (result) {
        if (result.length == 0) {
            onSuccess(result);
        }
        else {
            onError();
        }
    }, onError);
};






exports.AuthManager = AuthManager;
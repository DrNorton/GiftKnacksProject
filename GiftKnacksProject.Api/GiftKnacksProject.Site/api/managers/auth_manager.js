var SqlManager = require("./sql_manager").SqlManager;
var sql = require("mssql");
//var PasswordHelper = require("./passwordHelper").PasswordHelper;
var passport = require('passport');
var PasswordHelper = require("./passwordHelper").PasswordHelper;
var AuthLocalStrategy = require('passport-local').Strategy;
var sqlManager = new SqlManager();

var AuthManager = function () {
   
    this.passwordHelper = new PasswordHelper();
};

var sqlManager = new SqlManager();


passport.use('local', new AuthLocalStrategy(
    function (username, password, done) {
        FindUserByLogin(username, function(result) {
            return done(null, result);
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
            onError("Ошибка авторизации", 400);
        }
        if (!user) {
            //Фейл регистрации
            onError("Неверный логин или пароль", 400);
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
        sqlManager.invoke("[dbo].[Register]", params, function (result) {
            onSuccess({ "UserId": result });
        }, onError);
    }, function() {
        //Такая почта уже существует
        onError("Данный почтовый адрес уже зарегистрирован", 401);
    }, onError);
};

function CheckEmailExists(login, onNotExists, onExists, onError) {
    var params = [{ name: "Email", type: sql.NVarChar(50), value: login, isOutput: false }];
    sqlManager.invoke("[dbo].[GetUserByEmail]",params, function (result) {
        if (result[0].length === 0) {
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
        if (result.length != 0) {
            onSuccess(result);
        }
        else {
            onError();
        }
    }, onError);
};






exports.AuthManager = AuthManager;
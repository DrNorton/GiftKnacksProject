var SqlManager = require("./sql_manager").SqlManager;
var sql = require("mssql");
//var PasswordHelper = require("./passwordHelper").PasswordHelper;
var passport = require('passport');
var PasswordHelper = require("./passwordHelper").PasswordHelper;
var AuthLocalStrategy = require('passport-local').Strategy;
var sqlManager = new SqlManager();
var jwt = require('jsonwebtoken');
var config = require("nconf");

var AuthManager = function () {
    this.passwordHelper = new PasswordHelper();
};

var sqlManager = new SqlManager();
var passwordHelper = new PasswordHelper();


passport.use('local', new AuthLocalStrategy(
    function (username, password, done) {
    getUserByEmail(username, function (result) {
        validatePassword(password, result.Password, function() {
            return done(null, result);
        }, function() {
            return done(null, false, {
                message: 'Не верный пароль'
            });
        });

    },function() {
            return done(null, false, {
                message: 'Такой пользователь не заристрирован'
            });
        }, function () {
        return done(null, false, {
            message: 'Ошибка'
        });
    });
    }
));

AuthManager.prototype.login = function (req, response, next,params, onSuccess, onError) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            onError("Ошибка авторизации", 400);
        }
        if (!user) {
            //Фейл регистрации
            onError(info.message, 400);
        } else {
        
            var token = jwt.sign(user, config.get("session:secret") , { expiresInMinutes: 60 * 5 });
            onSuccess({ token: token });
        }
             
    })(req, response, next);
};

AuthManager.prototype.register = function(email, pass, onSuccess, onError) {
    getUserByEmail(email, function (result) {
        onError("Пользователь уже существует", 402);
    }, function() {
        //пользователь не существует, регистрируемся
        addUser({ email: email, pass: pass }, onSuccess, onError);
    },onError);
};

AuthManager.prototype.changePassword = function(userid,oldpass, newpass, onSuccess, onError) {
    getUserById(userid,function(user) {
        validatePassword(oldpass, user.Password, function() {
            //Старый пароль норм
            updatePassword(userid, newpass, onSuccess, onError);
        }, onError);
    },onError);
};


var getUserByEmail = function (email, onExist, onNotExist,onError) {
    var params = [{ name: "Email", type: sql.NVarChar(50), value: email, isOutput: false }];
    sqlManager.invoke("[dbo].[GetUserByEmail]", params, function (result) {
        if (result[0].length === 0) {
            onNotExist();
        }
        else {
            onExist(result[0][0]);
        }
    }, onError);
};

var getUserById = function (userid, onExist, onNotExist, onError) {
    var params = [{ name: "Id", type: sql.BigInt, value: userid, isOutput: false }];
    sqlManager.invoke("[dbo].[GetUserById]", params, function (result) {
        if (result[0].length === 0) {
            onNotExist();
        }
        else {
            onExist(result[0][0]);
        }
    }, onError);
};

var validatePassword = function(password, passwordHash, onSuccess, onError) {
    var validateResult = passwordHelper.validateHash(passwordHash, password);
    if (validateResult) {
        onSuccess();
    } else {
        onError("Неверный пароль",400);
    }
};
var addUser = function (userinfo, onSuccess, onError) {
    var email = userinfo.email;
    var pass = userinfo.pass;
    var md5Hash = passwordHelper.createHash(pass);
    var params = [{ name: "Email", type: sql.NVarChar(50), value: email, isOutput: false },{ name: "Password", type: sql.NVarChar(50), value: md5Hash, isOutput: false },{ name: "new_identity", type: sql.BigInt, isOutput: true }];
    sqlManager.invoke("[dbo].[Register]", params, function (result) {
        onSuccess({ "UserId": result });
    }, onError);
};

var updatePassword = function (userid, newpass, onSuccess, onError) {
    var md5Hash = passwordHelper.createHash(newpass);
    var params = [{ name: "UserId", type: sql.BigInt, value: userid, isOutput: false },{ name: "newpass", type: sql.NVarChar(50), value: md5Hash, isOutput: false }];
    sqlManager.invoke("[dbo].[UpdatePassword]", params, function (result) {
        onSuccess({ "UserId": userid });
    }, onError);
};

exports.AuthManager = AuthManager;
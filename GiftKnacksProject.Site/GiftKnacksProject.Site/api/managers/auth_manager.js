var SqlManager = require("./sql_manager").SqlManager;
//var PasswordHelper = require("./passwordHelper").PasswordHelper;


var AuthManager = function () {
    this.sqlManager = new SqlManager();

};


AuthManager.prototype.logon = function (params, onSuccess, onError) {
    var self = this;
};




exports.AuthManager = AuthManager;
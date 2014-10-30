var sql = require("mssql");
var nconf = require("nconf");

var config = {
    user: nconf.get("database:user"),
    password: nconf.get("database:password"),
    server: nconf.get("database:server"), // You can use 'localhost\\instance' to connect to named instance
    database: nconf.get("database:database"),

    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
};

var SqlManager = function () {

};

SqlManager.prototype.invoke = function(procedureName,params, onSuccess, onError) {
    sql.connect(config, function(err) {
        if (err) {
            onError("Невозможно подключиться к базе", 500);
        } else {
            var request = new sql.Request();
            params.forEach(function(par) {
                if (par.isOutput) {
                    request.output(par.name, par.type);
                    
                } else {
                    request.input(par.name, par.type, par.value);
                }
            });
            
            request.execute(procedureName, function(err, recordset, returnValue) {
                if (err != null) {
                    onError(err.message, err.code);
                }
                if (recordset.length===0) {
                    onSuccess(recordset.returnValue);
                } else {
                    onSuccess(recordset);
                }

            });
        }
    });
};

exports.SqlManager = SqlManager;
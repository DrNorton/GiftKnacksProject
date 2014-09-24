var sql = require("mssql");
var config = require('../settings/config').config;

var SqlManager = function () {

};

SqlManager.prototype.invoke = function (query, onSuccess, onError) {
    sql.connect(config, function (err) {
        if (err) {
            onError("Could not connect to database", "0");
        }
        else {
            var request = new sql.Request();
            request.query(query, function (err, recordset) {
                if (err != null) {
                    onError(err.message, err.code);
                }
                if (recordset == undefined) {
                    onSuccess("success");
                } else {
                    onSuccess(recordset);
                }

            });
        }
    });
}

exports.SqlManager = SqlManager;
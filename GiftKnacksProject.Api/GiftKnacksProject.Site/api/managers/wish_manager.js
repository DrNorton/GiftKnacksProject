var SqlManager = require("./sql_manager").SqlManager;
var sqlManager = new SqlManager();
var sql = require("mssql");

var WishManager = function () {
    
};
WishManager.prototype.getAll = function (onSuccess, onError) {
    sqlManager.invoke("[dbo].[GetAllWishes]",[], function (result) {
        onSuccess(result);
    }, onError);
};

WishManager.prototype.addwish = function(newWishInfo,onSuccess, onError) {
    var params = [{ name: "wishname", type: sql.NVarChar(50), value: newWishInfo.wishname, isOutput: false },
        { name: "wisherid", type: sql.BigInt, value: newWishInfo.wisherid, isOutput: false },
        { name: "description", type: sql.NVarChar(300), value: newWishInfo.description, isOutput: false },
        { name: "new_identity", type: sql.BigInt, isOutput: true }];
    sqlManager.invoke("[dbo].[AddWish]", params, function (result) {
        onSuccess(result);
    }, onError);
};

WishManager.prototype.deletewish = function(userid,wishid, onSuccess, onError) {
    getWishByUserId(userid, function(result) {
        if (result.length == 0) {
            onError("500", "Желание не найдено");
        } else {
            var params = [{ name: "wishid", type: sql.BigInt, value: wishid, isOutput: false }];
            sqlManager.invoke("[dbo].[DeleteWish]", params, function (result) {
                onSuccess({"WishId":wishid});
            }, onError);
        }
    }, onError);

};

var getWishByUserId = function (userid, onSuccess, onError) {
    var params = [{ name: "wishid", type: sql.BigInt, value: userid, isOutput: false }];
    sqlManager.invoke("[dbo].[GetWishById]", params, function(result) {
        onSuccess(result);
    },onError);

};

exports.WishManager = WishManager;
var BaseRouter = require('./base_router').BaseRouter;
var WishManager = require('../managers/wish_manager').WishManager;


var WishRouter = function () {
    this.wishManager = new WishManager();
};

WishRouter.prototype = new BaseRouter();

WishRouter.prototype._doRoute = function(action, params, req, response, next) {
    switch (action) {
        case 'getall':
            this.wishManager.getAll(function (result) {
                response.sendResult(result);
            }, response.sendError);
            break;

        case 'addwish':
            var wishname = req.body.wishname;
            var userid = req.session.userid;
            var description = req.body.description;
            var newWishInfo = { wishname: wishname, wisherid: userid, description: description };

            this.wishManager.addwish(newWishInfo,function (result) {
                response.sendResult(result);
            }, response.sendError);
            break;

        case 'deletewish':
            var userid = req.user.UserId;
            var wishid = req.body.wishid;
            this.wishManager.deletewish(userid,wishid, function (result) {
                response.sendResult(result);
            }, response.sendError);
            break;
    };

};


exports.WishRouter = WishRouter;
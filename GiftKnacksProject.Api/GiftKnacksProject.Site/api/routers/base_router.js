var Response = require('./response').Response;


var BaseRouter = function () {

};

BaseRouter.prototype.route = function (req, res,next) {
    this._doRoute(req.params.action, req.query,req, new Response(res),next);
};

BaseRouter.prototype._doRoute = function (action, params, req, res,next) {

};

BaseRouter.prototype._sendError = function (response, errorMessage, code) {
    response.sendError(errorMessage, code);
};



exports.BaseRouter = BaseRouter;
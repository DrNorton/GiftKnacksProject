var Response = require('./response').Response;


var BaseRouter = function () {

};

BaseRouter.prototype.route = function (req, res) {
    this._doRoute(req.params.action, req.query, new Response(res), req);
};

BaseRouter.prototype._doRoute = function (action, params, response, req) {

};

BaseRouter.prototype._sendError = function (response, errorMessage, code) {
    response.sendError(errorMessage, code);
};



exports.BaseRouter = BaseRouter;
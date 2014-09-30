var respon; //Что за хуйня опять this.response не работает
var Response = function (response) {
    this.response = response;
    respon = response;
};

Response.prototype.sendError = function (errorMessage, errorCode) {
    console.log(errorCode);
    if (!errorCode)
        errorCode = 0;
    //this.response.json(errorNum,{ status:'error', message:errorCode });
    var res = { errorCode: errorCode, errorMessage: errorMessage, result: "" };
    respon.charset = 'utf-8';
    respon.contentType('text');
    respon.end(JSON.stringify(res));
};

Response.prototype.sendResult = function (result) {
    //console.log(result);
    var res = { errorCode: '0', errorMessage: '', result: result };
    respon.charset = 'utf-8';
    respon.contentType('text');
    respon.end(JSON.stringify(res));

};

exports.Response = Response;
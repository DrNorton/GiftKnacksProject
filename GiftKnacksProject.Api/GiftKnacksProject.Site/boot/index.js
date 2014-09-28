    //boot/index.js
module.exports = function (app) {
    require("./express")(app);
    require("./passport")(app);
};
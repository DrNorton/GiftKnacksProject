var config = require("nconf");
var express = require('express');
var passport = require('passport');
var app = express();

config.argv()
    .env()
    .file({ file: 'config.json' });
//boot
require('./boot/index')(app);


//routers с авторизацией
app.use('/api', require('./route_configs/api_routes_config').router);

//auth RESTRICT без авторизации
app.use(require('./route_configs/no_auth_routes_config').router);

 
app.listen(app.get('port'), function () {
    console.log('Listening on port ', app.get('port'));
});
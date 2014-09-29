var config = require("nconf");
var express = require('express');
var passport = require('passport');
var app = express();

config.argv()
    .env()
    .file({ file: 'config.json' });
//boot
require('./boot/index')(app);
//routers
app.use('/api', require('./route_configs/api_routes_config').router);

 app.get('/auth', function (req, res) {
        if (req.isAuthenticated()) {
            res.redirect('/');
            return;
        }
        res.render('auth', {
            error: req.flash('error')
        });
    });
 
app.listen(app.get('port'), function () {
    console.log('Listening on port ', app.get('port'));
});
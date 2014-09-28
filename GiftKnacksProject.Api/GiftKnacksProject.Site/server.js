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






app.post('/auth', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth',
    failureFlash: true
})
  );

app.get('/auth', function (req, res) {
    var data = {
        title: "Node + Handlebars",
        body: "Hello World!"
    };
    res.render('auth', data);
});

app.listen(app.get('port'), function () {

    console.log('Listening on port ', app.get('port'));
});
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
var routerConfig = require('./route_configs/api_routes_config');
routerConfig.configureAuthRouter(passport);
app.use('/api', routerConfig.router);

 app.get('/auth', function (req, res) {
 
        if (req.isAuthenticated()) {
            res.redirect('/');
            return;
        }
 
        res.render('auth', {
            error: req.flash('error')
        });
    });
 
    app.get('/sign-out', function (req, res) {
        req.logout();
        res.redirect('/');
    });
 
   
   

    app.get('/auth/fb',
        passport.authenticate('facebook', {
            scope: 'read_stream'
        })
    );
 
    app.get('/auth/fb/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/auth' })
    );
 
    app.get('/auth/vk',
        passport.authenticate('vk', {
            scope: ['friends']
        }),
        function (req, res) {
         // The request will be redirected to vk.com 
         // for authentication, so
         // this function will not be called.
        });
 
    app.get('/auth/vk/callback',
        passport.authenticate('vk', {
            failureRedirect: '/auth'
        }),
        function (req, res) {
            // Successful authentication
            //, redirect home.
            res.redirect('/');
        });


app.listen(app.get('port'), function () {
    console.log('Listening on port ', app.get('port'));
});
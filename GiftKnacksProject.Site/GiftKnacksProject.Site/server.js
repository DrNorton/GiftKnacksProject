var connect = require('connect');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var express = require('express')
  , exphbs  = require('express3-handlebars')
  , app = express()
  , port = (process.env.PORT || 80);
var sass = require('node-sass');

//mapping sass dir to css dir
app.use(sass.middleware({
    src: __dirname + '/Sass',
    dest: __dirname + '/Styles',
    debug: true,
    outputStyle: 'compressed'
}));


app.use(cookieParser());
//app.use(connect.session({ secret: 'your secret here', maxAge: 24 * 60 * 60 * 1000, cookie: { httpOnly: false } }));
app.use(bodyParser());



app.use('/api', require('./route_configs/api_routes_config').router);
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));

app.set('view engine', 'handlebars');




app.get('/', function (req, res) {
    var data = {
        title: "Node + Handlebars",
        body: "Hello World!"
    }
    res.render('home', data);
});


app.listen(port, function () {

  console.log('Listening on port ', port);
});
var connect = require('connect');
var express = require('express')
  , exphbs  = require('express3-handlebars')
  , app = express()
  , port = (process.env.PORT || 80);

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));

app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.listen(port, function () {
  console.log('Listening on port ', port);
});
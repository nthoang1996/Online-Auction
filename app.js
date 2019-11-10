var express = require('express');
var exphbs = require('express-handlebars');

var app = express();
app.use(express.static(__dirname))

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    res.render('home');
});

app.get('/MSIcatgory', function(req, res) {
    res.render('layouts/Laptop/MSI/all');
});

app.listen(3000);
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

app.get('/msi-gaming-series', function(req, res) {
    res.render('layouts/Laptop/MSI/msi-gaming-series');
});

app.get('/msi-gaming-series-1', function(req, res) {
    res.render('layouts/Laptop/MSI/msi-gaming-series-1');
});

app.get('/star', function(req, res) {
    res.render('layouts/Laptop/star');
});

app.get('/admin', function(req, res) {
    res.render('seller/post_product', { layout: false });
});

app.listen(3000);
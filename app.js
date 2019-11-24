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

app.get('/login', function(req, res) {
    res.render('guest/login', { layout: false });
});

app.get('/category', function(req, res) {
    res.render('admin/category', { layout: false });
});

app.get('/create_category', function(req, res) {
    res.render('admin/create_category', { layout: false });
});

app.get('/user_manament', function(req, res) {
    res.render('admin/list_user', { layout: false });
});

app.get('/register', function(req, res) {
    res.render('guest/register', { layout: false });
});

app.get('/product_manament', function(req, res) {
    res.render('admin/list_product', { layout: false });
});

app.get('/profile', function(req, res) {
    res.render('admin/profile', { layout: false });
});

app.listen(3000);
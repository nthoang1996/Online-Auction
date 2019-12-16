const express = require('express');
const exphbs = require('express-handlebars');
const express_handlebars_sections = require('express-handlebars-sections');
const morgan = require('morgan');
const numeral = require('numeral');
require('express-async-errors');

const app = express();
app.use(morgan('dev'));
app.use(express.static(__dirname));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({
    helpers: {
        format: val => numeral(val).format('0,0') + " ₫",
        section: express_handlebars_sections()
    },
}));
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

app.get('/post_product', function(req, res) {
    res.render('seller/post_product', { layout: false });
});

app.get('/login', function(req, res) {
    res.render('guest/login', { layout: false });
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

// app.use(require('./middlewares/locals.mdw'));
require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw')(app);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.render('error500', { layout: false });
})

app.use((req, res, next) => {
    res.render('error404', { layout: false });
})

app.listen(3000);
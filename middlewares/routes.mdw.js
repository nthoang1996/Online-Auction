module.exports = function(app) {
    app.use('/account', require('../routes/account.routes'));
    app.use('/admin/category', require('../routes/admin/category.route'));
    app.use('/admin/user', require('../routes/admin/user.route'));
    app.use('/category', require('../routes/category.routes'));
    app.use('/admin/product', require('../routes/admin/product.route'));
}
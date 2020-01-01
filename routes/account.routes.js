const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const categoryModel = require('../models/category.model');
const restrict = require('../middlewares/auth.mdw');
router.get('/register', async(req, res) => {
    res.render('guest/register', { layout: false });
});

router.post('/register', async(req, res) => {
    const N = 10;
    const hash = bcrypt.hashSync(req.body.password, N);

    const entity = {
        "name": req.body.name,
        "phone": req.body.phone,
        "address": req.body.address,
        "email": req.body.email,
        "password": hash,
        "role": '[3]',
        "point": '0/0',
        "is_active": 1
    };
    const result = await categoryModel.add('tbluser', entity);
    res.render('guest/register', { layout: false });
});

router.get('/login', async(req, res) => {
    res.render('guest/login', { layout: false });
});

router.post('/login', async(req, res) => {
    // const user = {
    //     email: req.body.email,
    //     password: req.body.password
    // };

    console.log(req.body.email);

    const user = await categoryModel.single_by_email('tbluser', req.body.email);
    if (user === null) {
        return res.render('guest/login', {
            layout: false,
            err_message: 'Email không tồn tại'
        });
    }

    const rs = bcrypt.compareSync(req.body.password, user.password);
    if (rs === false) {
        return res.render('guest/login', {
            layout: false,
            err_message: 'Mật khẩu bạn nhập vào sai'
        });
    }

    delete user.password;
    req.session.isAuthenticated = true;
    req.session.authUser = user;

    const url = req.query.retUrl || '/';
    res.redirect(url);
    // res.redirect(req.headers.referer);
});

router.post('/logout', (req, res) => {
    req.session.isAuthenticated = false;
    req.session.authUser = null;
    res.redirect(req.headers.referer);
});

router.get('/profile', restrict, (req, res) => {
    res.render('admin/profile', { layout: false });

});

module.exports = router;
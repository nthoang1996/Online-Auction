const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const categoryModel = require('../models/category.model');
router.get('/register', async(req, res) => {
    res.render('guest/register', { layout: false });
});

router.post('/register', async(req, res) => {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
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
            showError: true,
            err_message: 'Email không tồn tại'
        });
    }

    const rs = bcrypt.compareSync(req.body.password, user.password);
    if (rs === false) {
        return res.render('guest/login', {
            layout: false,
            showError: true,
            err_message: 'Mật khẩu bạn nhập vào sai'
        });
    }

    delete user.password;
    req.session.isAuthenticated = true;
    req.session.authUser = user;

    res.redirect('/');
});

module.exports = router;
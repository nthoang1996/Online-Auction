const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const categoryModel = require('../models/category.model');
const request = require('request');
const restrict = require('../middlewares/auth.mdw');
const secretKey = "6LeQAMwUAAAAANC665bQZKP5KE-JUtd6UQdXcG-D";
router.get('/register', async(req, res) => {
    res.render('guest/register', { layout: false });
});

router.post('/verify', (req, res) => {
    if (!req.body.captcha) {
        console.log("err");
        return res.json({ "success": false, "msg": "Capctha is not checked" });
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}`;

    request(verifyUrl, (err, response, body) => {

        if (err) { console.log(err); }

        body = JSON.parse(body);

        if (!body.success && body.success === undefined) {
            return res.json({ "success": false, "msg": "captcha verification failed" });
        } else if (body.score < 0.5) {
            return res.json({ "success": false, "msg": "you might be a bot, sorry!", "score": body.score });
        }

        // return json message or continue with your function. Example: loading new page, ect
        return res.json({ "success": true, "msg": "captcha verification passed", "score": body.score });

    })
})

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
        "is_active": 1
    };

    console.log(entity);
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
    let temp = req.session.authUser;

    console.log('Day la email:', temp)
    res.render('admin/profile', {

        layout: false,
        profile: temp
    });

});

router.post('/profile', async(req, res) => {
    let entityId = { id: req.session.authUser.id };
    const hash = bcrypt.hashSync(req.body.new_password, 10);
    const user = await categoryModel.single_by_email('tbluser', req.body.email);
    console.log('Day la userID:', req.body);
    const entity = {
        "name": req.body.name,
        "phone": req.body.phone,
        "address": req.body.address,
        "email": req.body.email,
        "password": hash,
        "role": user.role,
        "point": user.point,
        "is_active": 1
    };
    const rs = bcrypt.compareSync(req.body.old_password, user.password);
    if (rs === false) {
        return res.render('admin/profile', {
            layout: false,
            err_message: 'Mật khẩu bạn nhập vào sai'
        });
    }
    const data = await categoryModel.edit("tbluser", entity, entityId);

    res.redirect('/admin/category');
});
module.exports = router;
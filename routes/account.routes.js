const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const categoryModel = require('../models/category.model');
const request = require('request');
const moment = require('moment');
const restrict = require('../middlewares/auth.mdw');
const secretKey = "6LeQAMwUAAAAANC665bQZKP5KE-JUtd6UQdXcG-D";
const passport = require('passport');

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

    const user = await categoryModel.single_by_email('tbluser', req.body.email);
    if (user != null) {
        return res.render('guest/register', {
            layout: false,
            err_message: 'Email đã tồn tại'
        });
    }

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
    temp["not_seller"] = !res.locals.isSeller;
    // console.log('co phai la seller ko? ', temp["not_seller"]);

    temp["is_seller"] = res.locals.isSeller;
    if (!temp["is_seller"]) {
        temp["is_bidder"] = res.locals.isBidder;
    }
    var listDanhGia1 = JSON.parse(temp.point);
    var listDanhGia = listDanhGia1[0];
    // console.log('Day la Danh gia foreach :', listDanhGia);
    //     var arr = [];
    //     for (var key in listDanhGia) {
    //         if (listDanhGia.hasOwnProperty(key)) {
    //             arr.push(key + '=' + listDanhGia[key]);
    //         }
    //     };
    //    // var result = arr.join(',');
    //     console.log(arr[0]);
    let tempKeyPair = Object.entries(listDanhGia).map(([key, value]) => ({ key, value }))
    var likeSel = parseInt(tempKeyPair[0].value.split("-")[0]);
    var unlikeSel = parseInt(tempKeyPair[0].value.split("-")[1]);
    var seller = likeSel + unlikeSel;
    //   console.log("Key Value: ",like+unlike);
    if (seller == 0) {
        temp["likeSel"] = 100;
        temp["unlikeSel"] = 100;
    }
    if (seller > 0) {
        temp["likeSel"] = Math.ceil(likeSel / seller * 100);
        temp["unlikeSel"] = unlikeSel / seller * 100;
    }


    var likeBid = parseInt(tempKeyPair[1].value.split("-")[0]);
    var unlikeBid = parseInt(tempKeyPair[1].value.split("-")[1]);
    var bidder = likeBid + unlikeBid;
    //   console.log("Key Value: ",like+unlike);
    if (bidder == 0) {
        temp["likeBid"] = 100;
        temp["unlikeBid"] = 100;
    }
    if (bidder > 0) {
        temp["likeBid"] = Math.ceil(likeBid / bidder * 100);
        temp["unlikeBid"] = unlikeBid / bidder * 100;
    }

    res.render('general/profile', {

        layout: false,
        profile: temp,

    });

});

router.post('/profile', async(req, res) => {
    let entityId = { id: req.session.authUser.id };
    const hash = bcrypt.hashSync(req.body.new_password, 10);
    const user = await categoryModel.single_by_email('tbluser', req.body.email);

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

    res.redirect('/account/login');
});

router.post('/promote', async(req, res) => {
    let entityId = { id: req.body.id };
    console.log('Day la userID:', req.body);
    const entity = {
        "is_approve_seller": 1
    };
    const data = await categoryModel.edit("tbluser", entity, entityId);

    res.send({ "success": true });
});

router.get('/list_evaluate/:kind', restrict, async(req, res) => {

    let user = req.session.authUser;
    let list_product_winning;
    if (req.params.kind == "bidder") {
        list_product_winning = JSON.parse(user.list_product_winner);
    }
    if (req.params.kind == "seller") {
        list_product_winning = JSON.parse(user.list_product_selled);
    }

    var rows = [];
    for (let i = 0; i < list_product_winning.length; i++) {
        if (list_product_winning[i].status != -1) {
            var tempProduct = await categoryModel.single_by_id("tblproduct", list_product_winning[i].id);
            rows.push(tempProduct[0]);
        }
    }
   //  console.log("day la winning length: ",list_product_winning.length);

    for (let i = 0; i < rows.length; i++) {
        // rows[i]["status"] = rows[i].is_active == 1 ? "Bình thường" : "Vô hiệu hóa";
        // rows[i]["can_disable"] = rows[i].is_active == 1 ? true : false;
        rows[i]["start_date_format"] = moment(rows[i].start_date).format('DD-MM-YYYY');
        rows[i]["end_date_format"] = moment(rows[i].end_date).format('DD-MM-YYYY HH:mm:ss');
    

        let listBidder = JSON.parse(rows[i].list_bidder);
        if (listBidder.length > 0) {
            rows[i]["top_price"] = listBidder[listBidder.length - 1].price;
        } else {
            rows[i]["top_price"] = rows[i].start_price;
        }
        rows[i]["cmt"] = list_product_winning[i].comment;
        if (list_product_winning[i].status == 0)
            rows[i]["status"] = "Không thích";
        else
            rows[i]["status"] = "Thích";
        //  console.log("ngay bat dau",rows[i]["start_date_format"]);

        let seller = await categoryModel.single_by_id("tbluser", rows[i].id_seller);
        rows[i]["name_seller"] = seller[0].name;
        console.log("day la row ${i}",rows[i])
    }
    // console.log("day la nhung product winner: ",rows);
    res.render('general/list_evaluate', {
        listProduct: rows,
        // empty: rows.length === 0,
        layout: false
    });
})
router.post('/edit', async(req, res) => {
    if (!res.locals.isAdmin) {
        return res.render('error_permission', { layout: false });
    }
    let entityId = {
        "id": parseInt(req.body.id)
    }
    let entity = {
        "is_active": req.body.is_active
    }
    const data = await categoryModel.edit("tblproduct", entity, entityId);
    res.redirect('/admin/user');
});
module.exports = router;
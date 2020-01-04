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
    temp["not_seller"] = !res.locals.isSeller;
   // console.log('co phai la seller ko? ', temp["not_seller"]);

   temp["is_seller"] = res.locals.isSeller;
   temp["is_bidder"] = res.locals.isBidder;
 
     var listDanhGia1 = JSON.parse(temp.point);
    var listDanhGia =listDanhGia1[0];
       // console.log('Day la Danh gia foreach :', listDanhGia);
    //     var arr = [];
    //     for (var key in listDanhGia) {
    //         if (listDanhGia.hasOwnProperty(key)) {
    //             arr.push(key + '=' + listDanhGia[key]);
    //         }
    //     };
    //    // var result = arr.join(',');
    //     console.log(arr[0]);
    let tempKeyPair =Object.entries(listDanhGia).map(([key, value]) => ({ key, value }))
    var likeSel = parseInt(tempKeyPair[0].value.split("-")[0]);
    var unlikeSel =parseInt(tempKeyPair[0].value.split("-")[1]);
    var seller = likeSel+unlikeSel;
     //   console.log("Key Value: ",like+unlike);
        if( seller==0 )
        {
            temp["likeSel"] = 100;
            temp["unlikeSel"] = 100; 
        }
        if( seller > 0 )
        {
            temp["likeSel"] = Math.ceil(likeSel/seller*100);
            temp["unlikeSel"]  = unlikeSel/seller*100; 
        }


        var likeBid = parseInt(tempKeyPair[1].value.split("-")[0]);
        var unlikeBid =parseInt(tempKeyPair[1].value.split("-")[1]);
        var bidder = likeBid+unlikeBid;
         //   console.log("Key Value: ",like+unlike);
            if( bidder==0 )
            {
                temp["likeBid"]  = 100;
                temp["unlikeBid"] = 100; 
            }
            if( bidder > 0 )
            {
                temp["likeBid"] = Math.ceil(likeBid/bidder*100);
                temp["unlikeBid"]  = unlikeBid/bidder*100; 
            }
    // listDanhGia.forEach(element => {
       
    // });
    



    res.render('admin/profile', {

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
module.exports = router;
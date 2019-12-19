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

module.exports = router;
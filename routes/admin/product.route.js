var express = require('express');
var moment = require('moment');
const categoryModel = require('../../models/category.model');

const router = express.Router();

router.get('/', async(req, res) => {
    if (!res.locals.isAdmin) {
        return res.render('error_permission', { layout: false });
    }
    const rows = await categoryModel.all("tblproduct");
    const rowscat = await categoryModel.all("tblcategory");
    const rowsUser = await categoryModel.all('tbluser');

    for (let i = 0; i < rows.length; i++) {
        rows[i]["status"] = rows[i].is_active == 1 ? "Bình thường" : "Vô hiệu hóa";
        rows[i]["can_disable"] = rows[i].is_active == 1 ? true : false;
        for (let j = 0; j < rowscat.length; j++) {
            if (rowscat[j].id === rows[i].cat_id) {
                rows[i]['cat_name'] = rowscat[j].name;
                rows[i]["start_date_format"] = moment(rows[i].start_date).format('DD-MM-YYYY HH:mm:ss');
                rows[i]["end_date_format"] = moment(rows[i].end_date).format('DD-MM-YYYY HH:mm:ss');
                let listBidder = JSON.parse(rows[i].list_bidder);
                if (listBidder.length > 0) {
                    rows[i]["top_price"] = listBidder[listBidder.length - 1].price;
                } else {
                    rows[i]["top_price"] = rows[i].start_price;
                }
                break;
            }
        }
        for (let j = 0; j < rowsUser.length; j++) {
            if (rowsUser[j].id == rows[i].id_seller) {
                rows[i]['seller'] = rowsUser[j].name;
            }
        }
    }
    res.render('admin/list_product', {
        listProduct: rows,
        empty: rows.length === 0,
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

router.post('/delete', async(req, res) => {
    if (!res.locals.isAdmin) {
        return res.render('error_permission', { layout: false });
    }
    let entityId = {
        "id": req.body.id
    }
    const data = await categoryModel.del("tblproduct", entityId);
    res.redirect('/admin/user');
});

router.get('/fav', async(req, res) => {
    // let temp_list = [];
    //  temp_list = JSON.parse(req.session.authUser.list_product);
    // console.log("log req body page fav get :",temp_list.length);
    const rows = JSON.parse(req.session.authUser.list_product);
    
    const rowscat = await categoryModel.all("tblcategory");
    const rowsUser = await categoryModel.all('tbluser');

    for (let i = 0; i < rows.length; i++) {
      

        rows[i]["status"] = rows[i].is_active == 1 ? "Bình thường" : "Vô hiệu hóa";
        rows[i]["can_disable"] = rows[i].is_active == 1 ? true : false;
        for (let j = 0; j < rowscat.length; j++) {
            if (rowscat[j].id === rows[i].cat_id) {
                rows[i]['cat_name'] = rowscat[j].name;
                rows[i]["start_date_format"] = moment(rows[i].start_date).format('DD-MM-YYYY HH:mm:ss');
                rows[i]["end_date_format"] = moment(rows[i].end_date).format('DD-MM-YYYY HH:mm:ss');
                let listBidder = JSON.parse(rows[i].list_bidder);
                if (listBidder.length > 0) {
                    rows[i]["top_price"] = listBidder[listBidder.length - 1].price;
                } else {
                    rows[i]["top_price"] = rows[i].start_price;
                }
                break;
            }
        }
        for (let j = 0; j < rowsUser.length; j++) {
            if (rowsUser[j].id == rows[i].id_seller) {
                rows[i]['seller'] = rowsUser[j].name;
            }
        }
        // console.log("log req body page fav get :",rows[i]);
    }
    
    res.render('bidder/favouriteProducts', {
        listProduct: rows,
        empty: rows.length === 0,
        layout: false
        });
      
});

module.exports = router;
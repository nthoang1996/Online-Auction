const express = require('express');
const moment = require('moment');
var multer = require('multer');
const fs = require('fs');

const categoryModel = require('../../models/category.model');

const router = express.Router();

router.post('/fav', async(req, res) => {
    let list_productTemp = {};
    console.log("log req body page fav post:", req.body.id);
    const rows = await categoryModel.single_by_id('tblproduct', req.body.id);
    const tempUser = await categoryModel.single_by_id('tbluser', req.session.authUser.id);
    list_productTemp = JSON.parse(tempUser[0].list_product);
    // console.log('list product log:',list_productTemp);
    list_productTemp.push(rows[0].id);
    console.log(list_productTemp);
    let entity = { "list_product": JSON.stringify(list_productTemp) };
    let entityID = { "id": req.session.authUser.id };
    const update = await categoryModel.edit('tbluser', entity, entityID);


    // res.render('bidder/favouriteProducts', {

    //     layout:false,

    //     });
});

router.get('/list_bidding', async(req, res) => {
    const user = await categoryModel.single_by_id('tbluser', res.locals.authUser.id);
    let list_bidding = [];
    const rowsUser = await categoryModel.all('tbluser');
    const rows = await categoryModel.all("tblproduct");
    const rowscat = await categoryModel.all("tblcategory");
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
                    rows[i]["top_bidder"] = listBidder[listBidder.length - 1].id;
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
    list_bidding = JSON.parse(user[0].list_product_bidding);
    for (let i = 0; i < list_bidding.length; i++) {
        for (let j = 0; j < rows.length; j++) {
            if (rows[j].id == list_bidding[i].id) {
                list_bidding[i]["seller"] = rows[j].seller;
                list_bidding[i]["cat_name"] = rows[j].cat_name;
                list_bidding[i]["name"] = rows[j].name;
                list_bidding[i]["top_price"] = rows[j].top_price;
                list_bidding[i]["start_date_format"] = rows[j].start_date_format;
                list_bidding[i]["end_date_format"] = rows[j].end_date_format;
                list_bidding[i]["min_increase"] = rows[j].min_increase;
                list_bidding[i]["day_bidder"] = moment(list_bidding[i].date).format('DD-MM-YYYY HH:mm:ss');
                if (user[0].id == rows[j].top_bidder) {
                    list_bidding[i]["top_bidder"] = true;
                }
                break;
            }
        }
    }

    console.log(list_bidding);

    res.render('bidder/list_product_bidding', {
        listProduct: list_bidding,
        empty: list_bidding.length === 0,
        layout: false
    });
})
module.exports = router;
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

    res.render('bidder/list_product_bidding', {
        listProduct: list_bidding,
        empty: list_bidding.length === 0,
        layout: false
    });
})

router.get('/winner', async(req, res) => {
    if (!res.locals.isBidder) {
        return res.render('error_permission', { layout: false });
    }
    const userBidder = await categoryModel.single_by_id('tbluser', res.locals.authUser.id);
    let listProductWinner = JSON.parse(userBidder[0].list_product_winner);
    const rowscat = await categoryModel.all("tblcategory");
    const rowsUser = await categoryModel.all('tbluser');

    for (let i = 0; i < listProductWinner.length; i++) {
        let product = await categoryModel.single_by_id('tblproduct', listProductWinner[i].id);
        for (let j = 0; j < rowscat.length; j++) {
            if (rowscat[j].id === product[0].cat_id) {
                product[0]['cat_name'] = rowscat[j].name;
                product[0]["start_date_format"] = moment(product[0].start_date).format('DD-MM-YYYY HH:mm:ss');
                product[0]["end_date_format"] = moment(product[0].end_date).format('DD-MM-YYYY HH:mm:ss');
                let listBidder = JSON.parse(product[0].list_bidder);
                let minPriceIndex = 0;
                for (let l = 0; l < listBidder.length - 1; l++) {
                    minPriceIndex = l;
                    for (let k = l + 1; k < listBidder.length; k++) {
                        if (listBidder[k].price < listBidder[minPriceIndex].price) {
                            let temp = {...listBidder[minPriceIndex] };
                            listBidder[minPriceIndex] = {...listBidder[k] };
                            listBidder[k] = {...temp };
                        } else if (listBidder[k].price == listBidder[minPriceIndex].price) {
                            if (listBidder[k].date > listBidder[minPriceIndex].date) {
                                let temp = {...listBidder[minPriceIndex] };
                                listBidder[minPriceIndex] = {...listBidder[k] };
                                listBidder[k] = {...temp };
                            }
                        }
                    }
                }
                for (let l = 0; l < rowsUser.length; l++) {
                    if (rowsUser[l].id == product[0].id_seller) {
                        product[0]["seller"] = rowsUser[l].name;
                        let point = JSON.parse(rowsUser[l].point);
                        product[0]["seller_point"] = point[0].seller;
                        break;
                    }
                }
                if (listBidder.length > 0) {
                    product[0]["top_price"] = listBidder[listBidder.length - 1].price;
                    product[0]["date_bid"] = moment(listBidder[listBidder.length - 1].date).format('DD-MM-YYYY HH:mm:ss');
                } else {
                    product[0]["top_price"] = product[0].start_price;
                    product[0]["date_bid"] = "Không lượt đấu giá";
                }
                break;
            }
        }
        listProductWinner[i]["name"] = product[0].name;
        listProductWinner[i]["cat_name"] = product[0].cat_name;
        listProductWinner[i]["start_date_format"] = product[0].start_date_format;
        listProductWinner[i]["end_date_format"] = product[0].end_date_format;
        listProductWinner[i]["top_price"] = product[0].top_price;
        listProductWinner[i]["seller"] = product[0].seller;
        listProductWinner[i]["seller_point"] = product[0].seller_point;
        listProductWinner[i]["date_bid"] = product[0].date_bid;

    }
    // let offsetGMT = +7;
    // let today = new Date(new Date().getTime() + offsetGMT * 3600 * 1000);
    // console.log(today);

    // for (let i = 0; i < rows.length; i++) {
    //     rows[i]["status"] = rows[i].is_active == 1 ? "Bình thường" : "Vô hiệu hóa";
    //     rows[i]["can_disable"] = rows[i].is_active == 1 ? true : false;
    //     for (let j = 0; j < rowscat.length; j++) {
    //         if (rowscat[j].id === rows[i].cat_id) {
    //             rows[i]['cat_name'] = rowscat[j].name;
    //             rows[i]["start_date_format"] = moment(rows[i].start_date).format('DD-MM-YYYY HH:mm:ss');
    //             rows[i]["end_date_format"] = moment(rows[i].end_date).format('DD-MM-YYYY HH:mm:ss');
    //             let listBidder = JSON.parse(rows[i].list_bidder);
    //             if (listBidder.length > 0) {
    //                 rows[i]["top_price"] = listBidder[listBidder.length - 1].price;
    //                 rows[i]["winner"] = listBidder[listBidder.length - 1].name;
    //             } else {
    //                 rows[i]["top_price"] = rows[i].start_price;
    //                 rows[i]["winner"] = "Không ai";
    //             }
    //             break;
    //         }
    //     }
    //     for (let j = 0; j < rowsUser.length; j++) {
    //         if (rowsUser[j].id == rows[i].id_seller) {
    //             rows[i]['seller'] = rowsUser[j].name;
    //         }
    //     }
    // }

    // let result = [];
    // for (let i = 0; i < rows.length; i++) {
    //     if (rows[i].end_date < today) {
    //         result.push(rows[i]);
    //     }
    // }

    res.render('bidder/list_product_winner', {
        listProduct: listProductWinner,
        empty: listProductWinner.length === 0,
        layout: false
    });

})
module.exports = router;
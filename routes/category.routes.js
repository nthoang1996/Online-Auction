var express = require('express');
var moment = require('moment');
const categoryModel = require('../models/category.model');
const config = require('../config/default.json')

const router = express.Router();

router.get('/:id/products', async(req, res) => {
    // for(const c of res.locals.lcCategories){
    //     if(c.id === +req.params.id){
    //         c.isActive = true;
    //     }
    // }
    const limit = config.paginate.limit;
    const id = req.params.id;

    const page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }
    const offset = (page - 1) * limit;

    const [total, rows] = await Promise.all([
        categoryModel.count_product_by_cat('tblproduct', id),
        categoryModel.page_product_by_cat('tblproduct', id, offset)
    ]);
    let disable_prev = false;
    let disable_next = false;

    if (rows.length == 0) {
        const catRows = await categoryModel.single_by_id('tblcategory', id);
        if (catRows[0].level == 2) {
            const subCats = await categoryModel.all_by_pid('tblcategory', id);
            let result = [];
            for (let i = 0; i < subCats.length; i++) {
                let product = await categoryModel.all_product_by_cat('tblproduct', subCats[i].id);
                result.push.apply(result, product);
            }
            console.log(offset);
            let rowsCombine = result.slice(offset, offset + limit);
            let nPage = Math.floor(result.length / limit);
            if (result.length % limit > 0) {
                nPage++;
            }
            let page_numbers = [];
            for (let i = 1; i <= nPage; i++) {
                page_numbers.push({
                    "value": i,
                    isCurrentPage: i === +page
                })
            }
            if (page == 1) {
                disable_prev = true;
            }
            if (page == page_numbers.length) {
                disable_next = true;
            }
            for (let i = 0; i < rowsCombine.length; i++) {
                let list_bidder_json = rowsCombine[i]["list_bidder"];
                let list_bidder_object = JSON.parse(list_bidder_json);
                let bidder_name = "";
                bidder_name = list_bidder_object[list_bidder_object.length - 1].name;
                bidder_name = bidder_name.substring(bidder_name.lastIndexOf(" ") + 1);
                top_price = list_bidder_object[list_bidder_object.length - 1].price;
                bidder_name = "****" + bidder_name;
                rowsCombine[i]["bidder"] = bidder_name;
                rowsCombine[i]["top_price"] = top_price;
                rowsCombine[i]["count_bid"] = list_bidder_object.length + " lượt";
                rowsCombine[i]["date_time"] = moment(rowsCombine[i].end_date).format('DD-MM-YYYY HH:mm:ss');
            }
            res.render('products/allByCat', {
                products: rowsCombine,
                empty: rowsCombine.length === 0,
                page_numbers,
                prev_value: +page - 1,
                next_value: +page + 1,
                disable_prev,
                disable_next
            });
        } else {
            let nPage = Math.floor(total / limit);
            if (total % limit > 0) {
                nPage++;
            }
            let page_numbers = [];
            for (let i = 1; i <= nPage; i++) {
                page_numbers.push({
                    "value": i,
                    isCurrentPage: i === +page
                })
            }
            if (page == 1) {
                disable_prev = true;
            }
            if (page == page_numbers.length) {
                disable_next = true;
            }

            for (let i = 0; i < rows.length; i++) {
                let list_bidder_json = rows[i]["list_bidder"];
                let list_bidder_object = JSON.parse(list_bidder_json);
                // console.log(list_bidder_object[list_bidder_object.length - 1].name);
                let bidder_name = "";
                bidder_name = list_bidder_object[list_bidder_object.length - 1].name;
                bidder_name = bidder_name.substring(bidder_name.lastIndexOf(" ") + 1);
                top_price = list_bidder_object[list_bidder_object.length - 1].price;
                bidder_name = "****" + bidder_name;
                // console.log(rows[i].end_date);
                rows[i]["bidder"] = bidder_name;
                rows[i]["top_price"] = top_price;
                rows[i]["count_bid"] = list_bidder_object.length + " lượt";
                rows[i]["date_time"] = moment(rows[i].end_date).format('DD-MM-YYYY HH:mm:ss');
            }
            // console.log(rows);
            res.render('products/allByCat', {
                products: rows,
                empty: rows.length === 0,
                page_numbers,
                prev_value: +page - 1,
                next_value: +page + 1,
                disable_prev,
                disable_next
            });
        }
    } else {
        let nPage = Math.floor(total / limit);
        if (total % limit > 0) {
            nPage++;
        }
        let page_numbers = [];
        for (let i = 1; i <= nPage; i++) {
            page_numbers.push({
                "value": i,
                isCurrentPage: i === +page
            })
        }
        if (page == 1) {
            disable_prev = true;
        }
        if (page == page_numbers.length) {
            disable_next = true;
        }
        for (let i = 0; i < rows.length; i++) {
            let list_bidder_json = rows[i]["list_bidder"];
            let list_bidder_object = JSON.parse(list_bidder_json);
            // console.log(list_bidder_object[list_bidder_object.length - 1].name);
            let bidder_name = "";
            bidder_name = list_bidder_object[list_bidder_object.length - 1].name;
            bidder_name = bidder_name.substring(bidder_name.lastIndexOf(" ") + 1);
            top_price = list_bidder_object[list_bidder_object.length - 1].price;
            bidder_name = "****" + bidder_name;
            // console.log(rows[i].end_date);
            rows[i]["bidder"] = bidder_name;
            rows[i]["top_price"] = top_price;
            rows[i]["count_bid"] = list_bidder_object.length + " lượt";
            rows[i]["date_time"] = moment(rows[i].end_date).format('DD-MM-YYYY HH:mm:ss');
        }
        // console.log(rows);
        res.render('products/allByCat', {
            products: rows,
            empty: rows.length === 0,
            page_numbers,
            prev_value: +page - 1,
            next_value: +page + 1,
            disable_prev,
            disable_next
        });
    }
})


module.exports = router;
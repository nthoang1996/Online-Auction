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
    let dt = new Date();

    if (rows.length == 0) {
        const catRows = await categoryModel.single_by_id('tblcategory', id);
        if (catRows[0].level == 2) {
            const subCats = await categoryModel.all_by_pid('tblcategory', id);
            let result = [];
            for (let i = 0; i < subCats.length; i++) {
                let product = await categoryModel.all_product_by_cat('tblproduct', subCats[i].id);
                result.push.apply(result, product);
            }
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
                let minPriceIndex = 0;
                for (let j = 0; j < list_bidder_object.length - 1; j++) {
                    minPriceIndex = j;
                    for (let k = j + 1; k < list_bidder_object.length; k++) {
                        if (list_bidder_object[k].price < list_bidder_object[minPriceIndex].price) {
                            let temp = {...list_bidder_object[minPriceIndex] };
                            list_bidder_object[minPriceIndex] = {...list_bidder_object[k] };
                            list_bidder_object[k] = {...temp };
                        } else if (list_bidder_object[k].price == list_bidder_object[minPriceIndex].price) {
                            if (list_bidder_object[k].date > list_bidder_object[minPriceIndex].date) {
                                let temp = {...list_bidder_object[minPriceIndex] };
                                list_bidder_object[minPriceIndex] = {...list_bidder_object[k] };
                                list_bidder_object[k] = {...temp };
                            }
                        }
                    }
                }
                let bidder_name = "";
                bidder_name = list_bidder_object[list_bidder_object.length - 1].name;
                bidder_name = bidder_name.substring(bidder_name.lastIndexOf(" ") + 1);
                top_price = list_bidder_object[list_bidder_object.length - 1].price;
                bidder_name = "****" + bidder_name;
                rowsCombine[i]["bidder"] = bidder_name;
                rowsCombine[i]["top_price"] = top_price;
                rowsCombine[i]["count_bid"] = list_bidder_object.length + " lượt";
                let difference_in_time = rowsCombine[i].end_date.getTime() - dt.getTime();
                let difference_in_date = difference_in_time / (1000 * 3600 * 24);
                if (difference_in_date >= 1 && difference_in_date < 4) {
                    rowsCombine[i]["date_time"] = "" + parseInt(difference_in_date) + " ngày nữa";
                } else if (difference_in_date < 1) {
                    let difference_in_hour = difference_in_time / (1000 * 3600);
                    if (difference_in_hour < 1) {
                        let difference_in_minute = difference_in_time / (1000 * 60);
                        if (difference_in_minute < 1) {
                            rowsCombine[i]["date_time"] = "" + parseInt(difference_in_time / (1000)) + " giây nữa";
                        } else {
                            rowsCombine[i]["date_time"] = "" + parseInt(difference_in_minute) + " phút nữa";
                        }
                    } else {
                        rowsCombine[i]["date_time"] = "" + parseInt(difference_in_hour) + " giờ nữa";
                    }
                } else {
                    rowsCombine[i]["date_time"] = moment(rowsCombine[i].end_date).format('DD-MM-YYYY HH:mm:ss');
                }
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
                let minPriceIndex = 0;
                for (let j = 0; j < list_bidder_object.length - 1; j++) {
                    minPriceIndex = j;
                    for (let k = j + 1; k < list_bidder_object.length; k++) {
                        if (list_bidder_object[k].price < list_bidder_object[minPriceIndex].price) {
                            let temp = {...list_bidder_object[minPriceIndex] };
                            list_bidder_object[minPriceIndex] = {...list_bidder_object[k] };
                            list_bidder_object[k] = {...temp };
                        } else if (list_bidder_object[k].price == list_bidder_object[minPriceIndex].price) {
                            if (list_bidder_object[k].date > list_bidder_object[minPriceIndex].date) {
                                let temp = {...list_bidder_object[minPriceIndex] };
                                list_bidder_object[minPriceIndex] = {...list_bidder_object[k] };
                                list_bidder_object[k] = {...temp };
                            }
                        }
                    }
                }
                let bidder_name = "";
                bidder_name = list_bidder_object[list_bidder_object.length - 1].name;
                bidder_name = bidder_name.substring(bidder_name.lastIndexOf(" ") + 1);
                top_price = list_bidder_object[list_bidder_object.length - 1].price;
                bidder_name = "****" + bidder_name;
                rows[i]["bidder"] = bidder_name;
                rows[i]["top_price"] = top_price;
                rows[i]["count_bid"] = list_bidder_object.length + " lượt";
                let difference_in_time = rows[i].end_date.getTime() - dt.getTime();
                let difference_in_date = difference_in_time / (1000 * 3600 * 24);
                if (difference_in_date >= 1 && difference_in_date < 4) {
                    rows[i]["date_time"] = "" + parseInt(difference_in_date) + " ngày nữa";
                } else if (difference_in_date < 1) {
                    let difference_in_hour = difference_in_time / (1000 * 3600);
                    if (difference_in_hour < 1) {
                        let difference_in_minute = difference_in_time / (1000 * 60);
                        if (difference_in_minute < 1) {
                            rows[i]["date_time"] = "" + parseInt(difference_in_time / (1000)) + " giây nữa";
                        } else {
                            rows[i]["date_time"] = "" + parseInt(difference_in_minute) + " phút nữa";
                        }
                    } else {
                        rows[i]["date_time"] = "" + parseInt(difference_in_hour) + " giờ nữa";
                    }
                } else {
                    rows[i]["date_time"] = moment(rows[i].end_date).format('DD-MM-YYYY HH:mm:ss');
                }
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
            let minPriceIndex = 0;
            for (let j = 0; j < list_bidder_object.length - 1; j++) {
                minPriceIndex = j;
                for (let k = j + 1; k < list_bidder_object.length; k++) {
                    if (list_bidder_object[k].price < list_bidder_object[minPriceIndex].price) {
                        let temp = {...list_bidder_object[minPriceIndex] };
                        list_bidder_object[minPriceIndex] = {...list_bidder_object[k] };
                        list_bidder_object[k] = {...temp };
                    } else if (list_bidder_object[k].price == list_bidder_object[minPriceIndex].price) {
                        if (list_bidder_object[k].date > list_bidder_object[minPriceIndex].date) {
                            let temp = {...list_bidder_object[minPriceIndex] };
                            list_bidder_object[minPriceIndex] = {...list_bidder_object[k] };
                            list_bidder_object[k] = {...temp };
                        }
                    }
                }
            }
            let bidder_name = "";
            bidder_name = list_bidder_object[list_bidder_object.length - 1].name;
            bidder_name = bidder_name.substring(bidder_name.lastIndexOf(" ") + 1);
            top_price = list_bidder_object[list_bidder_object.length - 1].price;
            bidder_name = "****" + bidder_name;
            // console.log(rows[i].end_date);
            rows[i]["bidder"] = bidder_name;
            rows[i]["top_price"] = top_price;
            rows[i]["count_bid"] = list_bidder_object.length + " lượt";
            let difference_in_time = rows[i].end_date.getTime() - dt.getTime();
            let difference_in_date = difference_in_time / (1000 * 3600 * 24);
            if (difference_in_date >= 1 && difference_in_date < 4) {
                rows[i]["date_time"] = "" + parseInt(difference_in_date) + " ngày nữa";
            } else if (difference_in_date < 1) {
                let difference_in_hour = difference_in_time / (1000 * 3600);
                if (difference_in_hour < 1) {
                    let difference_in_minute = difference_in_time / (1000 * 60);
                    if (difference_in_minute < 1) {
                        rows[i]["date_time"] = "" + parseInt(difference_in_time / (1000)) + " giây nữa";
                    } else {
                        rows[i]["date_time"] = "" + parseInt(difference_in_minute) + " phút nữa";
                    }
                } else {
                    rows[i]["date_time"] = "" + parseInt(difference_in_hour) + " giờ nữa";
                }
            } else {
                rows[i]["date_time"] = moment(rows[i].end_date).format('DD-MM-YYYY HH:mm:ss');
            }
        }
        // console.log(rows);
        res.render('product/allByCat', {
            products: rows,
            empty: rows.length === 0,
            page_numbers,
            prev_value: +page - 1,
            next_value: +page + 1,
            disable_prev,
            disable_next
        });
    }
});

router.get('/products/:id', async(req, res) => {
    const rows = await categoryModel.single_by_id('tblproduct', req.params.id);
    const product = rows[0];
    const rowsUser = await categoryModel.single_by_id('tbluser', product.id_seller);
    product["seller_name"] = rowsUser[0].name;
    product["seller_phone"] = rowsUser[0].phone;
    product["seller_email"] = rowsUser[0].email;
    product["seller_point"] = rowsUser[0].point;
    let like = parseInt(rowsUser[0].point.substring(0, rowsUser[0].point.indexOf("/")));
    let disLike = parseInt(rowsUser[0].point.substring(rowsUser[0].point.indexOf("/") + 1));
    if (like / (like + disLike) > 0.8 || like + disLike == 0) {
        product["react_haha"] = true;
    } else {
        product["react_haha"] = false;
    }
    product["start_date_format"] = moment(product.start_date).format('DD-MM-YYYY HH:mm:ss');
    product["end_date_format"] = moment(product.end_date).format('DD-MM-YYYY HH:mm:ss');
    listBidder1 = JSON.parse(product.list_bidder);
    product["list_bidder_object"] = [...listBidder1];
    for (let i = 0; i < product.list_bidder_object.length; i++) {
        product.list_bidder_object[i].date = moment(product.list_bidder_object[i].date).format('DD-MM-YYYY HH:mm:ss');
        product.list_bidder_object[i].name = "****" + product.list_bidder_object[i].name.substring(product.list_bidder_object[i].name.lastIndexOf(" ") + 1);;
    }
    let minPriceIndex = 0;
    for (let j = 0; j < listBidder1.length - 1; j++) {
        minPriceIndex = j;
        for (let k = j + 1; k < listBidder1.length; k++) {
            if (listBidder1[k].price < listBidder1[minPriceIndex].price) {
                let temp = {...listBidder1[minPriceIndex] };
                listBidder1[minPriceIndex] = {...listBidder1[k] };
                listBidder1[k] = {...temp };
            } else if (listBidder1[k].price == listBidder1[minPriceIndex].price) {
                if (listBidder1[k].date > listBidder1[minPriceIndex].date) {
                    let temp = {...listBidder1[minPriceIndex] };
                    listBidder1[minPriceIndex] = {...listBidder1[k] };
                    listBidder1[k] = {...temp };
                }
            }
        }
    }
    bidder_name = listBidder1[listBidder1.length - 1].name;
    bidder_name = bidder_name.substring(bidder_name.lastIndexOf(" ") + 1);
    bidder_name = "****" + bidder_name;
    product["top_bidder"] = bidder_name;
    let bidder_id = listBidder1[listBidder1.length - 1].id;
    let bidderInfo = await categoryModel.single_by_id('tbluser', bidder_id);
    product["bidder_point"] = bidderInfo[0].point;
    like = parseInt(bidderInfo[0].point.substring(0, bidderInfo[0].point.indexOf("/")));
    disLike = parseInt(bidderInfo[0].point.substring(bidderInfo[0].point.indexOf("/") + 1));
    if (like / (like + disLike) > 0.8 || like + disLike == 0) {
        product["bidder_react_haha"] = true;
    } else {
        product["bidder_react_haha"] = false;
    }
    product["top_price"] = listBidder1[listBidder1.length - 1].price;

    let categoryProduct = await categoryModel.all_product_by_cat('tblproduct', product.cat_id);
    console.log(categoryProduct.length);
    for (let i = 0; i < categoryProduct.length; i++) {
        if (categoryProduct[i].id == product.id) {
            // console.log(categoryProduct[i]);
            categoryProduct.splice(i, 1);
        }
    }
    categoryProduct = categoryProduct.slice(0, 5);
    let dt = new Date();
    for (let i = 0; i < categoryProduct.length; i++) {
        let list_bidder_json = categoryProduct[i]["list_bidder"];
        let list_bidder_object = JSON.parse(list_bidder_json);
        let minPriceIndex = 0;
        for (let j = 0; j < list_bidder_object.length - 1; j++) {
            minPriceIndex = j;
            for (let k = j + 1; k < list_bidder_object.length; k++) {
                if (list_bidder_object[k].price < list_bidder_object[minPriceIndex].price) {
                    let temp = {...list_bidder_object[minPriceIndex] };
                    list_bidder_object[minPriceIndex] = {...list_bidder_object[k] };
                    list_bidder_object[k] = {...temp };
                } else if (list_bidder_object[k].price == list_bidder_object[minPriceIndex].price) {
                    if (list_bidder_object[k].date > list_bidder_object[minPriceIndex].date) {
                        let temp = {...list_bidder_object[minPriceIndex] };
                        list_bidder_object[minPriceIndex] = {...list_bidder_object[k] };
                        list_bidder_object[k] = {...temp };
                    }
                }
            }
        }
        let bidder_name = "";
        bidder_name = list_bidder_object[list_bidder_object.length - 1].name;
        bidder_name = bidder_name.substring(bidder_name.lastIndexOf(" ") + 1);
        top_price = list_bidder_object[list_bidder_object.length - 1].price;
        bidder_name = "****" + bidder_name;
        categoryProduct[i]["bidder"] = bidder_name;
        categoryProduct[i]["top_price"] = top_price;
        categoryProduct[i]["count_bid"] = list_bidder_object.length + " lượt";
        let difference_in_time = categoryProduct[i].end_date.getTime() - dt.getTime();
        let difference_in_date = difference_in_time / (1000 * 3600 * 24);
        if (difference_in_date >= 1 && difference_in_date < 4) {
            categoryProduct[i]["date_time"] = "" + parseInt(difference_in_date) + " ngày nữa";
        } else if (difference_in_date < 1) {
            let difference_in_hour = difference_in_time / (1000 * 3600);
            if (difference_in_hour < 1) {
                let difference_in_minute = difference_in_time / (1000 * 60);
                if (difference_in_minute < 1) {
                    categoryProduct[i]["date_time"] = "" + parseInt(difference_in_time / (1000)) + " giây nữa";
                } else {
                    categoryProduct[i]["date_time"] = "" + parseInt(difference_in_minute) + " phút nữa";
                }
            } else {
                categoryProduct[i]["date_time"] = "" + parseInt(difference_in_hour) + " giờ nữa";
            }
        } else {
            categoryProduct[i]["date_time"] = moment(categoryProduct[i].end_date).format('DD-MM-YYYY HH:mm:ss');
        }

    }
    res.render('products/detailProduct', {
        product,
        categoryProduct
    });
});


module.exports = router;
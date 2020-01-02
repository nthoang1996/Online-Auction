const express = require('express');
const exphbs = require('express-handlebars');
const handlebars_sections = require('express-handlebars-sections');
const session = require('express-session')
const morgan = require('morgan');
const numeral = require('numeral');
require('express-async-errors');
var moment = require('moment');
const categoryModel = require('./models/category.model');

const app = express();
app.use(morgan('dev'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}))

app.use(express.static(__dirname));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.engine('handlebars', exphbs({
    helpers: {
        section: handlebars_sections(),
        format: val => numeral(val).format('0,0') + " ₫",
        formatPhone: val => {
            val = "" + val;
            val = val.slice(0, 4) + " " + val.slice(4, 7) + " " + val.slice(7);
            return val;
        },
        getContent: content => { return JSON.stringify(content); }
    },
}));
app.set('view engine', 'handlebars');

app.get('/auto_generate_list_bidder', async(req, res) => {
    const rows = await categoryModel.all('tblproduct');
    const user = await categoryModel.all('tbluser');
    let list_list_bidder = [];
    for (let i = 0; i < rows.length; i++) {
        let numBid = 5 + Math.floor(Math.random() * 45);
        let list_bidder = [];
        for (let j = 0; j < numBid; j++) {
            let bidder = {};
            bidder["number"] = j + 1;
            let idUser = Math.floor(Math.random() * user.length);
            bidder["id"] = user[idUser].id;
            bidder["name"] = user[idUser].name;
            bidder["date"] = randomDate(rows[i].start_date, rows[i].end_date, rows[i].start_date.getHours(), rows[i].end_date.getHours());
            let countRan = parseInt((rows[i].buynow_price - rows[i].start_price) / rows[i].min_increase);
            let price = Math.floor(Math.random() * countRan) * rows[i].min_increase + rows[i].start_price;
            bidder["price"] = price;
            list_bidder.push(bidder);
        }
        list_list_bidder.push(list_bidder);
    }
    // console.log(list_list_bidder);
    for (let i = 0; i < rows.length; i++) {
        let minDateIndex = 0
        for (let j = 0; j < list_list_bidder[i].length - 1; j++) {
            minDateIndex = j;
            for (let k = j + 1; k < list_list_bidder[i].length; k++) {
                if (list_list_bidder[i][k].date < list_list_bidder[i][minDateIndex].date) {
                    let temp = {...list_list_bidder[i][minDateIndex] };
                    list_list_bidder[i][minDateIndex] = {...list_list_bidder[i][k] };
                    list_list_bidder[i][k] = {...temp };
                }
            }

        }
        for (let j = 0; j < list_list_bidder[i].length; j++) {
            list_list_bidder[i][j].number = j + 1;
        }
        let entity = { "list_bidder": JSON.stringify(list_list_bidder[i]) };
        let entityID = { "id": rows[i].id };
        const update = await categoryModel.edit('tblproduct', entity, entityID);
    }
    res.render('admin/profile', { layout: false });
});

function randomDate(start, end, startHour, endHour) {
    let date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date;
}

// app.use(require('./middlewares/locals.mdw'));
require('./middlewares/locals.mdw')(app);
require('./middlewares/routes.mdw')(app);

app.get('/', async(req, res) => {
    let dt = new Date();
    const rows = await categoryModel.all('tblproduct');
    let index = 0;
    for (let i = 0; i < rows.length - 1; i++) {
        index = i;
        for (let j = i + 1; j < rows.length; j++) {
            if (rows[j].end_date < rows[index].end_date) {
                let temp = {...rows[index] };
                rows[index] = {...rows[j] };
                rows[j] = {...temp };
            }
        }
    }

    for (let i = 0; i < rows.length; i++) {
        let listBidder1 = [];
        listBidder1 = JSON.parse(rows[i].list_bidder);
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
        if (listBidder1.length > 0) {
            rows[i]["top_price"] = listBidder1[listBidder1.length - 1].price;
        } else {
            rows[i]["top_price"] = rows[i].start_price;
        }
        let difference_in_time = rows[i].end_date.getTime() - dt.getTime();
        let difference_in_date = difference_in_time / (1000 * 3600 * 24);
        if (difference_in_date >= 1 && difference_in_date < 4) {
            rows[i]["end_date_format"] = "" + parseInt(difference_in_date) + " ngày nữa";
        } else if (difference_in_date < 1) {
            let difference_in_hour = difference_in_time / (1000 * 3600);
            if (difference_in_hour < 1) {
                let difference_in_minute = difference_in_time / (1000 * 60);
                if (difference_in_minute < 1) {
                    rows[i]["end_date_format"] = "" + parseInt(difference_in_time / (1000)) + " giây nữa";
                } else {
                    rows[i]["end_date_format"] = "" + parseInt(difference_in_minute) + " phút nữa";
                }
            } else {
                rows[i]["end_date_format"] = "" + parseInt(difference_in_hour) + " giờ nữa";
            }
        } else {
            rows[i]["end_date_format"] = moment(rows[i].end_date).format('DD-MM-YYYY HH:mm:ss');
        }
    }
    // console.log(rows);
    let list_ended1 = [];
    let list_ended2 = [];
    let activeItem = {};
    for (let i = 0; i < 6; i++) {
        if (i == 0) {
            activeItem = rows[i];
        } else if (i < 3) {
            list_ended1[i] = {...rows[i] };
        } else {
            list_ended2.push(rows[i]);
        }
    }

    for (let i = 0; i < rows.length - 1; i++) {
        index = i;
        for (let j = i + 1; j < rows.length; j++) {
            let listBidder1 = JSON.parse(rows[index].list_bidder);
            let listBidder2 = JSON.parse(rows[j].list_bidder);
            if (listBidder2.length > listBidder1.length) {
                let temp = {...rows[index] };
                rows[index] = {...rows[j] };
                rows[j] = {...temp };
                rows[index]["count"] = listBidder2.length;
            }
        }
    }
    let list_popular = [];
    for (let i = 0; i < 5; i++) {
        list_popular[i] = {...rows[i] };
    }

    for (let i = 0; i < rows.length - 1; i++) {
        index = i;
        for (let j = i + 1; j < rows.length; j++) {
            let listBidder1 = JSON.parse(rows[index].list_bidder);
            let listBidder2 = JSON.parse(rows[j].list_bidder);
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
            minPriceIndex = 0;
            for (let j = 0; j < listBidder2.length - 1; j++) {
                minPriceIndex = j;
                for (let k = j + 1; k < listBidder2.length; k++) {
                    if (listBidder2[k].price < listBidder2[minPriceIndex].price) {
                        let temp = {...listBidder2[minPriceIndex] };
                        listBidder2[minPriceIndex] = {...listBidder2[k] };
                        listBidder2[k] = {...temp };
                    } else if (listBidder2[k].price == listBidder2[minPriceIndex].price) {
                        if (listBidder2[k].date > listBidder2[minPriceIndex].date) {
                            let temp = {...listBidder2[minPriceIndex] };
                            listBidder2[minPriceIndex] = {...listBidder2[k] };
                            listBidder2[k] = {...temp };
                        }
                    }
                }
            }
            let topPriceList1 = 0;
            let topPriceList2 = 0;
            if (listBidder1.length > 0) {
                topPriceList1 = parseInt(listBidder1[listBidder1.length - 1].price);
            } else {
                topPriceList1 = parseInt(rows[index].start_price);
            }
            if (listBidder2.length > 0) {
                topPriceList2 = parseInt(listBidder2[listBidder2.length - 1].price);
            } else {
                topPriceList2 = parseInt(rows[j].start_price);
            }
            if (topPriceList2 > topPriceList1) {
                let temp = {...rows[index] };
                rows[index] = {...rows[j] };
                rows[j] = {...temp };
                rows[index]["top_price"] = "" + topPriceList2;
            }
        }
    }
    let list_top_price = [];
    let first_top_price = {};
    for (let i = 0; i < 5; i++) {
        if (i == 0) {
            first_top_price = rows[i];
        } else {
            list_top_price[i] = {...rows[i] };
        }
    }
    // console.log(list_top_price);
    res.render('home', {
        activeItem,
        first_top_price,
        list_popular,
        list_ended1,
        list_ended2,
        list_top_price
    });
});

app.post('/search', async(req, res) => {
    let table = "";
    let result = [];
    if (req.body.style === "0") {
        table = "tblproduct";
        let rows = await categoryModel.full_text_search(table, req.body.search_text);
        result = rows;
        console.log(rows)
    } else if (req.body.style === "1") {
        table = "tblcategory";
        let rows = await categoryModel.full_text_search(table, req.body.search_text);
        for (let i = 0; i < rows.length; i++) {
            let data = await categoryModel.all_product_by_cat('tblproduct', rows[i].id);
            result = result.concat(data);
        }
    } else {
        table = "tbluser";
        let rows = await categoryModel.full_text_search(table, req.body.search_text);
        for (let i = 0; i < rows.length; i++) {
            let data = await categoryModel.all_product_by_seller('tblproduct', rows[i].id);
            result = result.concat(data);
        }
    }
    console.log(result);
    let dt = new Date();
    for (let i = 0; i < result.length; i++) {
        let list_bidder_json = result[i]["list_bidder"];
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
        result[i]["bidder"] = bidder_name;
        result[i]["top_price"] = top_price;
        result[i]["count_bid"] = list_bidder_object.length + " lượt";
        let difference_in_time = result[i].end_date.getTime() - dt.getTime();
        let difference_in_date = difference_in_time / (1000 * 3600 * 24);
        if (difference_in_date >= 1 && difference_in_date < 4) {
            result[i]["date_time"] = "" + parseInt(difference_in_date) + " ngày nữa";
        } else if (difference_in_date < 1) {
            let difference_in_hour = difference_in_time / (1000 * 3600);
            if (difference_in_hour < 1) {
                let difference_in_minute = difference_in_time / (1000 * 60);
                if (difference_in_minute < 1) {
                    result[i]["date_time"] = "" + parseInt(difference_in_time / (1000)) + " giây nữa";
                } else {
                    result[i]["date_time"] = "" + parseInt(difference_in_minute) + " phút nữa";
                }
            } else {
                result[i]["date_time"] = "" + parseInt(difference_in_hour) + " giờ nữa";
            }
        } else {
            result[i]["date_time"] = moment(result[i].end_date).format('DD-MM-YYYY HH:mm:ss');
        }
    }
    res.render('products/allByCat', {
        products: result,
    });
});

app.get('/star', function(req, res) {
    res.render('layouts/Laptop/star');
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.render('error500', { layout: false });
})

app.use((req, res, next) => {
    res.render('error404', { layout: false });
})

app.listen(3000);
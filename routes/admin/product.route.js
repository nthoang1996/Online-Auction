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

router.get('/list_product_winning/:kind', async(req, res) => { 
    
    let user = req.session.authUser;
    let list_product_winning;
    if(req.params.kind == "bidder")
    {
        list_product_winning = JSON.parse(user.list_product_winner);
    }
    if(req.params.kind == "seller")
    {
        list_product_winning = JSON.parse(user.list_product_selled);
    }
  
    var rows =[];
    for (let i = 0; i < list_product_winning.length; i++) {
        if(list_product_winning[i].status != -1)
        {
            var tempProduct = await categoryModel.single_by_id("tblproduct",list_product_winning[i].id);
             rows.push(tempProduct[0]);
        }
    }
   // console.log("day la nhung product winner: ",rows);

    for (let i = 0; i < rows.length; i++) {
        // rows[i]["status"] = rows[i].is_active == 1 ? "Bình thường" : "Vô hiệu hóa";
       // rows[i]["can_disable"] = rows[i].is_active == 1 ? true : false;
        rows[i]["start_date_format"] = moment(rows[i].start_date).format('DD-MM-YYYY');
                rows[i]["end_date_format"] = moment(rows[i].end_date).format('DD-MM-YYYY HH:mm:ss');
             //  console.log("day la row ${i}",rows[i])
               
                let listBidder = JSON.parse(rows[i].list_bidder);
                if (listBidder.length > 0) {
                    rows[i]["top_price"] = listBidder[listBidder.length - 1].price;
                } else {
                    rows[i]["top_price"] = rows[i].start_price;
                }
                rows[i]["cmt"]=list_product_winning[i].comment;
                if(list_product_winning[i].status == 0)
                    rows[i]["status"]="Không thích";
                else
                     rows[i]["status"]="Thích";
              //  console.log("ngay bat dau",rows[i]["start_date_format"]);
       
    }



    res.render('admin/list_product_winning', {
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

module.exports = router;
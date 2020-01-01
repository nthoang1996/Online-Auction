var express = require('express');
var moment = require('moment');
const multer = require('multer');
const storage = multer.diskStorage({
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    },
    destination: function(req, file, cb) {
        cb(null, `./picture/product/`);
    },
});
const upload = multer({ storage });
const categoryModel = require('../../models/category.model');

const router = express.Router();

router.get('/', async(req, res) => {
    // try {
    const rows = await categoryModel.all("tblproduct");
    const rowscat = await categoryModel.all("tblcategory");
    const rowsUser = await categoryModel.all('tbluser');
    // console.log(rowscat);
    for (let i = 0; i < rows.length; i++) {
        rows[i]["status"] = rows[i].is_active == 1 ? "Bình thường" : "Vô hiệu hóa";
        rows[i]["can_disable"] = rows[i].is_active == 1 ? true : false;
        for (let j = 0; j < rowscat.length; j++) {
            if (rowscat[j].id === rows[i].cat_id) {
                rows[i]['cat_name'] = rowscat[j].name;
                rows[i]["start_date_format"] = moment(rows[i].start_date).format('DD-MM-YYYY HH:mm:ss');
                rows[i]["end_date_format"] = moment(rows[i].end_date).format('DD-MM-YYYY HH:mm:ss');
                let listBidder = JSON.parse(rows[i].list_bidder);
                rows[i]["top_price"] = listBidder[listBidder.length - 1].price;
                break;
            }
        }
        for (let j = 0; j < rowsUser.length; j++) {
            if (rowsUser[j].id == rows[i].id_seller) {
                rows[i]['seller'] = rowsUser[j].name;
            }
        }
    }
    console.log(rows);
    res.render('seller/list_product', {
        listProduct: rows,
        empty: rows.length === 0,
        layout: false
    });
    // } catch (err) {
    //     console.log(err);
    //     res.end('View error log in console.');
    // }
})

// router.get('/get_user/:id', async(req, res) => {
//     try {
//         const rows = await categoryModel.single_by_id("tbluser", req.params.id);
//         res.send(rows[0]);

//     } catch (err) {
//         console.log(err);
//         //     res.end('View error log in console.');
//     }
// })

// router.get('/get_userrole', async(req, res) => {
//     try {
//         const rows = await categoryModel.all("tblrole");
//         res.send(rows);

//     } catch (err) {
//         console.log(err);
//         //     res.end('View error log in console.');
//     }
// })

// router.get('/get_userstatus', async(req, res) => {
//     try {
//         const rows = await categoryModel.all("tblstatus");
//         res.send(rows);

//     } catch (err) {
//         console.log(err);
//         //     res.end('View error log in console.');
//     }
// })

router.post('/edit', async(req, res) => {
    let entityId = {
        "id": parseInt(req.body.id)
    }
    let entity = {
        "is_active": req.body.is_active
    }
    const data = await categoryModel.edit("tblproduct", entity, entityId);
    res.redirect('/seller/product');
});

router.post('/delete', async(req, res) => {
    let entityId = {
        "id": req.body.id
    }
    const data = await categoryModel.del("tblproduct", entityId);
    res.redirect('/seller/product');
});

router.get('/post_product', async(req, res) => {
    rows = await categoryModel.getAllChildCatByLevel('tblcategory', 3);
    console.log(rows);
    res.render('seller/post_product', {
        category: rows,
        layout: false
    });
});

router.post('/post_product', function(req, res) {
    upload.single('fuMain')(req, res, err => {
        if (err) {

        }
        res.send('ok');
    });
});

module.exports = router;
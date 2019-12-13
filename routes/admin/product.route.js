var express = require('express');
const categoryModel = require('../../models/category.model');

const router = express.Router();

router.get('/', async(req, res) => {
    // try {
    const rows = await categoryModel.all("tblproduct");
    const rowscat = await categoryModel.all("tblcategory");
    // console.log(rowscat);
    for (let i = 0; i < rows.length; i++) {
        rows[i]["status"] = rows[i].is_active == 1 ? "Bình thường" : "Vô hiệu hóa";
        rows[i]["can_disable"] = rows[i].is_active == 1 ? true : false;
        for (let j = 0; j < rowscat.length; j++) {
            if (rowscat[j].id === rows[i].cat_id) {
                rows[i]['cat_name'] = rowscat[j].name;
                break;
            }
        }
    }
    console.log(rows);
    res.render('admin/list_product', {
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
    res.redirect('/admin/user');
});

router.post('/delete', async(req, res) => {
    let entityId = {
        "id": req.body.id
    }
    const data = await categoryModel.del("tblproduct", entityId);
    res.redirect('/admin/user');
});

module.exports = router;
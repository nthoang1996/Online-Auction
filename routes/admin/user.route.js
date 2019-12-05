var express = require('express');
const categoryModel = require('../../models/category.model');

const router = express.Router();

router.get('/', async(req, res) => {
    // try {
    const rows = await categoryModel.all("tbluser");
    for (let i = 0; i < rows.length; i++) {
        switch (rows[i].role) {
            case 1:
                rows[i]["role_name"] = "Quản trị viên";
                break;
            case 2:
                rows[i]["role_name"] = "Người bán";
                break;
            case 3:
                rows[i]["role_name"] = "Người Đấu giá";
                break;

        }
        rows[i]["status"] = rows[i].is_active == 1 ? "Bình thường" : "Vô hiệu hóa";
    }
    console.log(rows);
    res.render('admin/list_user', {
        listUser: rows,
        empty: rows.length === 0,
        layout: false
    });
    // } catch (err) {
    //     console.log(err);
    //     res.end('View error log in console.');
    // }
})

router.get('/get_user/:id', async(req, res) => {
    try {
        const rows = await categoryModel.single_by_id("tbluser", req.params.id);
        res.send(rows[0]);

    } catch (err) {
        console.log(err);
        //     res.end('View error log in console.');
    }
})

router.get('/get_userrole', async(req, res) => {
    try {
        const rows = await categoryModel.all("tblrole");
        res.send(rows);

    } catch (err) {
        console.log(err);
        //     res.end('View error log in console.');
    }
})

router.get('/get_userstatus', async(req, res) => {
    try {
        const rows = await categoryModel.all("tblstatus");
        res.send(rows);

    } catch (err) {
        console.log(err);
        //     res.end('View error log in console.');
    }
})

router.post('/edit', async(req, res) => {
    let entityId = {
        "id": parseInt(req.body.user_id)
    }
    let entity = {
        "role": parseInt(req.body.user_role),
        "is_active": parseInt(req.body.user_status)
    }
    console.log(entity);
    console.log(entityId);
    const data = await categoryModel.edit("tbluser", entity, entityId);
    res.redirect('/admin/user');
});

router.post('/delete', async(req, res) => {
    let entityId = {
        "id": req.body.id
    }
    const data = await categoryModel.del("tbluser", entityId);
    res.redirect('/admin/user');
});

module.exports = router;
var express = require('express');
const categoryModel = require('../../models/category.model');

const router = express.Router();

router.get('/', async(req, res) => {
    try {
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
                    rows[i]["role_name"] = "Đấu giá";
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
    } catch (err) {
        console.log(err);
        res.end('View error log in console.');
    }
})

// router.get('/get_category/:id', async(req, res) => {
//     try {
//         const rows = await categoryModel.all_by_pid("tblcategory", req.params.id);
//         res.send(rows);

//     } catch (err) {
//         console.log(err);
//         res.end('View error log in console.');
//     }
// })

// router.get('/create_category', async(req, res) => {
//     const rows = await categoryModel.add("tblcategory", {
//         "name": "abc",
//         "level": 2,
//         "parent_id": 1
//     });
//     console.log(rows);
//     res.render('admin/create_category', { layout: false });
// });

module.exports = router;
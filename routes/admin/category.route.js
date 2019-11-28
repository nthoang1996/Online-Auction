var express = require('express');
const db = require('../../utils/db');
const categoryModel = require('../../models/category.model');

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const rows = await categoryModel.all_by_level("tblcategory", 1);
        console.log(rows);
        for (let i = 0; i < rows.length; i++) {
            rows[i]['number'] = i + 1;
        }
        res.render('admin/category', {
            categories: rows,
            empty: rows.length === 0,
            layout: false
        });
    } catch (err) {
        console.log(err);
        res.end('View error log in console.');
    }
})

router.get('/get_category/:id', async(req, res) => {
    try {
        console.log(req.params.id);
        const rows = await categoryModel.all_by_pid("tblcategory", req.params.id);
        console.log(rows);
        res.send(rows);

    } catch (err) {
        console.log(err);
        res.end('View error log in console.');
    }
})
module.exports = router;
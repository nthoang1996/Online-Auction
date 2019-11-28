var express = require('express');
const db = require('../../utils/db');
const categoryModel = require('../../models/category.model');

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        // const rows = await db.load('select * from tblcategory');
        const rows = await categoryModel.all();
        for (let i = 0; i < rows.length; i++) {
            rows[i]['number'] = i + 1;
        }
        console.log(rows);
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

module.exports = router;
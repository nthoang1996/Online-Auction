var express = require('express');
const categoryModel = require('../../models/category.model');

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const rows = await categoryModel.all_by_level("tblcategory", 1);
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
        const rows = await categoryModel.all_by_pid("tblcategory", req.params.id);
        res.send(rows);

    } catch (err) {
        console.log(err);
        res.end('View error log in console.');
    }
})

router.get('/create_category', async(req, res) => {
    const rows = await categoryModel.all("tblcategory");
    res.render('admin/create_category', {
        categories: rows,
        empty: rows.length === 0,
        layout: false
    });
});

router.post('/create_category', async(req, res) => {
    console.log(req.body);
    let pid = parseInt(req.body.parent_id);
    console.log(pid);
    const dataParent = await categoryModel.single_by_id("tblcategory", pid);
    console.log(dataParent);
    let lv = dataParent[0].level + 1;

    const entity = {
        name: req.body.name,
        parent_id: pid,
        level: lv
    }
    const result = await categoryModel.add("tblcategory", entity);
    const rows = await categoryModel.all("tblcategory");
    res.render('admin/create_category', {
        categories: rows,
        empty: rows.length === 0,
        layout: false
    });
});

module.exports = router;
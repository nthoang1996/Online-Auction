var express = require('express');
const categoryModel = require('../models/category.model');

const router = express.Router();

router.get('/:id/products', async(req, res) => {
    const rows = await categoryModel.all_product_by_cat('tblproduct', req.params.id);
    console.log(rows);
    res.render('products/allByCat', {
        products: rows,
        empty: rows.length === 0,
    });
    // try {
    // const rows = await categoryModel.all_by_level("tblcategory", 1);
    // for (let i = 0; i < rows.length; i++) {
    //     rows[i]['number'] = i + 1;
    // }
    // res.render('admin/category', {
    //     categories: rows,
    //     empty: rows.length === 0,
    //     layout: false
    // });
    // } catch (err) {
    //     console.log(err);
    //     res.end('View error log in console.');
    // }
})


module.exports = router;
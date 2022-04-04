const { response } = require('express');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path')


/* GET users listing. */
/* HOme page */

router.get('/', async function (req, res, next) {
 
    res.render('admin/home', { title: 'College Fest', })
  
});





module.exports = router;
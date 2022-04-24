const e = require('express');
const { response } = require('express');
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path')
var adminHelpers = require('../helpers/admin-helpers')

const verifyAdminLogin = (req, res, next) => {
    if (req.session.NSAWEBADMIN) {
      next()
    } else {
      res.redirect('/admin/signin')
    }
  };

/* GET users listing. */
/* HOme page */
router.get('/', verifyAdminLogin,  (req, res, next)=> {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  if(req.session.Success){
    res.render('admin/home', { title: 'Admin panel', nsaWebDarkTheme, admin, "Success":req.session.Success })
    req.session.Success = false
  } else {
    res.render('admin/home', { title: 'Admin panel', nsaWebDarkTheme, admin })
  }
});


// signin and singout
router.get('/signin', (req,res)=>{
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  console.log('1');
  if(req.session.NSAWEBADMIN){
    console.log('2');
    res.redirect('/admin')
  }else if(req.session.Error){
    console.log('3');
    res.render('admin/signin', { title: 'Admin panel', nsaWebDarkTheme,"Error":req.session.Error })
    req.session.Error = false
  }else{
    console.log('4');
    res.render('admin/signin', {title : 'Admin panel', nsaWebDarkTheme})
  }
})
router.post('/signin', (req,res)=>{
  adminHelpers.authAdminLog(req.body).then((response)=>{
    if(response.EmailError){
      req.session.Error = "Email Id not match"
      res.redirect('/admin/signin')
    }else if(response.PasswordError){
      req.session.Error = "Password not match"
      res.redirect('/admin/signin' )
    }else if(response.success){
      req.session.Success = "Admin account successfully loged"
      req.session.NSAWEBADMIN = response.adminDetails
      res.redirect('/admin')
    }else{
      req.session.Error = "Somthing error! Try again"
      res.redirect('/admin/signin' )
    }
  })
});

router.get('/signout', (req,res)=>{
  req.session.NSAWEBADMIN = undefined
  res.redirect('/admin/signin')
  
})




module.exports = router;
const express = require('express');
const { response } = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path')
const adminHelpers = require('../helpers/admin-helpers')
const activeHelpers = require('../helpers/active-helpers')
const userHelpers = require('../helpers/user-helpers')


const verifyAdminLogin = (req, res, next) => {
  if (req.session.NSAWEBADMIN) {
    next()
  } else {
    res.redirect('/admin/signin')
  }
};

/* GET users listing. */
/* HOme page */
router.get('/', verifyAdminLogin, (req, res, next) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  if (req.session.Success) {
    res.render('admin/home', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, "Success": req.session.Success })
    req.session.Success = false
  } else {
    res.render('admin/home', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, })
  }
});

router.post('/activation-site', (req, res) => {
  activeHelpers.activateSite().then((response) => {
    res.json(response)
  })
})


// signin and singout
router.get('/signin', (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme

  if (req.session.NSAWEBADMIN) {

    res.redirect('/admin')
  } else if (req.session.Error) {

    res.render('admin/signin', { title: 'Admin panel', nsaWebDarkTheme, "Error": req.session.Error })
    req.session.Error = false
  } else {

    res.render('admin/signin', { title: 'Admin panel', nsaWebDarkTheme })
  }
})
router.post('/signin', (req, res) => {
  adminHelpers.authAdminLog(req.body).then((response) => {
    if (response.EmailError) {
      req.session.Error = "Email Id not match"
      res.redirect('/admin/signin')
    } else if (response.PasswordError) {
      req.session.Error = "Password not match"
      res.redirect('/admin/signin')
    } else if (response.success) {
      req.session.Success = "Admin account successfully loged"
      req.session.NSAWEBADMIN = response.adminDetails
      res.redirect('/admin')
    } else {
      req.session.Error = "Somthing error! Try again"
      res.redirect('/admin/signin')
    }
  })
});

router.get('/signout', (req, res) => {
  req.session.NSAWEBADMIN = undefined
  res.redirect('/admin/signin')

});

// First pages

router.get('/first-page', verifyAdminLogin, (req, res, next) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  res.render('admin/first-page/first-page', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, })

});


// First page - slider

router.get('/first-page/slider', verifyAdminLogin, async (req, res, next) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  var Slides = await userHelpers.getFullSlide()
  if (req.session.Success) {
    res.render('admin/first-page/slider', {
      title: 'Admin panel', "Success": req.session.Success,
      nsaWebDarkTheme, admin, sideHeader: true, Slides
    })
    req.session.Success = false
  } else {
    res.render('admin/first-page/slider', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, Slides })
  }

});

router.post('/first-pege/slider/edit-slider', verifyAdminLogin, (req, res) => {

  let Image = req.files
  if (Image) {
    Image = req.files.slider
    Image.mv('./public/images/slider/' + req.body.id + '.jpg')
  }
  adminHelpers.editSlider(req.body).then((result) => {
    req.session.Success = 'Slider successfully edited'
    res.redirect('/admin/first-page/slider')
  })

});

router.post('/first-page/slider/find-slider', (req, res) => {
  userHelpers.getOneSlide(req.body).then((result) => {
   
    res.json(result)
  })

});

// First page - the nsa

router.get('/first-page/the-nsa', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let TheNsa = await userHelpers.getTheNsa()
  if (req.session.Success) {
    res.render('admin/first-page/the-nsa', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, TheNsa })
    req.session.Success = false
  } else {
    res.render('admin/first-page/the-nsa', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, TheNsa })
  }
});

router.post('/first-page/the-nsa', verifyAdminLogin, (req, res) => {
  let type = "The Nsa"
  adminHelpers.editFirstPagePeragraph(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/first-page/the-nsa')
  })
});



// First page - the majma'a

router.get('/first-page/the-majma', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let TheMajma = await userHelpers.getTheMajma()
  if (req.session.Success) {
    res.render('admin/first-page/the-majma', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, TheMajma })
    req.session.Success = false
  } else {
    res.render('admin/first-page/the-majma', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, TheMajma })
  }
});

router.post('/first-page/the-majma', verifyAdminLogin, (req, res) => {
  let type = "The Majma"
  adminHelpers.editFirstPagePeragraph(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/first-page/the-majma')
  })
});

// First page - Links

router.get('/first-page/links', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  var Links = await userHelpers.getFLinks()
  if (req.session.Success) {
    res.render('admin/first-page/links', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, Links })
    req.session.Success = false
  } else {
    res.render('admin/first-page/links', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, Links })
  }
});

router.post('/first-page/links', verifyAdminLogin, (req, res) => {
  let type = "Links"
  adminHelpers.editFirstLinks(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/first-page/links')
  })
});

// College - Our teacher

router.get('/our-teachers', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let teachers = await userHelpers.getAllTeachers()

   if(req.session.Success){
    res.render('admin/college/our-teachers', { title: 'Admin panel', "Success":req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, teachers })
    req.session.Success = false
  }else{
    res.render('admin/college/our-teachers', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, teachers })
  }
});

router.post('/our-teachers', verifyAdminLogin, (req, res) => {
  adminHelpers.addUpdateTeacher(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.Profile
      Image.mv('./public/images/profiles/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/our-teachers')
  })
});

router.post('/our-teachers/delete-profile',(req,res)=>{
 
  adminHelpers.deleteProfile(req.body).then((response)=>{
    let Imagepath = path.join(__dirname, '../public/images/profiles/' + req.body.Id + '.jpg')
    fs.unlink(Imagepath, function (err) {
      if (err)
       return ;
     
    });
  
    res.json(response)
  })
});


// Our leaders

router.get('/our-leaders', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
 // let teachers = await userHelpers.getAllTeachers()
   if(req.session.Success){
    res.render('admin/college/our-tea', { title: 'Admin panel', "Success":req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, teachers })
    req.session.Success = false
  }else{
    res.render('admin/college/our-teachers', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, teachers })
  }
});






















module.exports = router;
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
  let Id1 = "PRGPH01"
  var TheNsa = await userHelpers.getNormalPara(Id1);
  if (req.session.Success) {
    res.render('admin/first-page/the-nsa', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, TheNsa })
    req.session.Success = false
  } else {
    res.render('admin/first-page/the-nsa', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, TheNsa })
  }
});

router.post('/first-page/the-nsa', verifyAdminLogin, (req, res) => {
  let type = "The Nsa"
  adminHelpers.editPeragraph(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/first-page/the-nsa')
  })
});



// First page - the majma'a

router.get('/first-page/the-majma', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Id2 = "PRGPH02"
  var TheMajma = await userHelpers.getNormalPara(Id2);
  if (req.session.Success) {
    res.render('admin/first-page/the-majma', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, TheMajma })
    req.session.Success = false
  } else {
    res.render('admin/first-page/the-majma', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, TheMajma })
  }
});

router.post('/first-page/the-majma', verifyAdminLogin, (req, res) => {
  let type = "The Majma"
  adminHelpers.editPeragraph(req.body, type).then(() => {
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

  if (req.session.Success) {
    res.render('admin/college/our-teachers', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, teachers })
    req.session.Success = false
  } else {
    res.render('admin/college/our-teachers', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, teachers })
  }
});

router.post('/our-teachers', verifyAdminLogin, (req, res) => {
  req.body.Type = 'Teacher'
  adminHelpers.addUpdateProfile(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.Profile
      Image.mv('./public/images/profiles/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/our-teachers')
  })
});

router.post('/delete-profile', (req, res) => {

  adminHelpers.deleteProfile(req.body).then((response) => {
    let Imagepath = path.join(__dirname, '../public/images/profiles/' + req.body.Id + '.jpg')
    fs.unlink(Imagepath, function (err) {
      if (err)
        return;

    });

    res.json(response)
  })
});


// Our leaders

router.get('/our-leaders', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let leaders = await userHelpers.getAllLeaders()
  if (req.session.Success) {
    res.render('admin/college/our-leaders', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, leaders })
    req.session.Success = false
  } else {
    res.render('admin/college/our-leaders', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, leaders })
  }
});

router.post('/our-leaders', verifyAdminLogin, (req, res) => {
  req.body.Type = 'Leader'
  adminHelpers.addUpdateProfile(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.Profile
      Image.mv('./public/images/profiles/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/our-leaders')
  })
});

// Our faculty

router.get('/our-faculty', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  res.render('admin/college/our-faculty', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, })
});

// Pre - OUr faculty
router.get('/our-faculty/pre', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Id1 = "PRGPH03"
  let Pre = await userHelpers.getNormalPara(Id1);
  if (req.session.Success) {
    res.render('admin/college/pre', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, Pre })
    req.session.Success = false
  } else {
    res.render('admin/college/pre', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, Pre })
  }
});


router.post('/our-faculty/pre', verifyAdminLogin, (req, res) => {

  let type = "Pre"
  adminHelpers.editPeragraph(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/our-faculty/pre')
  })
});

// UG - Our faculty

router.get('/our-faculty/ug', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Id2 = "PRGPH04"
  let Ug = await userHelpers.getNormalPara(Id2);
  if (req.session.Success) {
    res.render('admin/college/ug', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, Ug })
    req.session.Success = false
  } else {
    res.render('admin/college/ug', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, Ug })
  }
});

router.post('/our-faculty/ug', verifyAdminLogin, (req, res) => {
  let type = "Ug"
  adminHelpers.editPeragraph(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/our-faculty/ug')
  })
});


// PG - Our faculty

router.get('/our-faculty/pg', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Id3 = "PRGPH05"
  let Pg = await userHelpers.getNormalPara(Id3);
  if (req.session.Success) {
    res.render('admin/college/pg', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, Pg })
    req.session.Success = false
  } else {
    res.render('admin/college/pg', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, Pg })
  }
});

router.post('/our-faculty/pg', verifyAdminLogin, (req, res) => {

  let type = "Pg"
  adminHelpers.editPeragraph(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/our-faculty/pg')
  })
});

// HOD our faculty

router.get('/our-faculty/pg-hod', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Hod = await userHelpers.getHodData()
  if (req.session.Success) {
    res.render('admin/college/pg-hod', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, Hod })
    req.session.Success = false
  } else {
    res.render('admin/college/pg-hod', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, Hod })
  }
});


router.post('/our-faculty/pg-hod', verifyAdminLogin, (req, res) => {
  req.body.Type = 'Hod'
  adminHelpers.addUpdateProfile(req.body).then((response) => {
   
    let Image = req.files
    if (Image) {
      Image = req.files.Profile
      Image.mv('./public/images/profiles/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/our-faculty/pg-hod')
  })
});

// NSA

router.get('/nsa', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  res.render('admin/nsa/nsa-all', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, })
});

router.get('/nsa/nsa-about', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Id = "PRGPH06"
  let nsaPara = await userHelpers.getNormalPara(Id);
  if (req.session.Success) {
    res.render('admin/nsa/nsa-a', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, nsaPara })
    req.session.Success = false
  } else {
    res.render('admin/nsa/nsa-a', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, nsaPara })
  }
});

router.get('/nsa/nsa-members', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Type = "NSA"
  let nsaPro = await userHelpers.getNormalProfile(Type);
  if (req.session.Success) {
    res.render('admin/nsa/nsa-m', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true,nsaPro  })
    req.session.Success = false
  } else {
    res.render('admin/nsa/nsa-m', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true,nsaPro  })
  }
});

router.get('/nsa/nsa-links', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Type = "Nsa"
  let NsaLinks = await userHelpers.getNormelLinks(Type);

  if (req.session.Success) {
    res.render('admin/nsa/nsa-links', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, NsaLinks  })
    req.session.Success = false
  } else {
    res.render('admin/nsa/nsa-links', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, NsaLinks  })
  }
});

router.post('/nsa/nsa-members', verifyAdminLogin, (req, res) => {
  req.body.Type = 'NSA'
  adminHelpers.addUpdateProfile(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.Profile
      Image.mv('./public/images/profiles/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/nsa/nsa-members')
  })
});

router.post('/nsa/nsa-about', verifyAdminLogin, (req, res) => {
  let type = "Nsa"
  adminHelpers.editPeragraphWithButton(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/nsa/nsa-about')
  })
});

router.post('/nsa/nsa-links', verifyAdminLogin, (req, res) => {
  let type = "Nsa"
  adminHelpers.updateLinks(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/nsa/nsa-links')
  })
});


// NSa - Fine arts
router.get('/nsa/fine-arts-about', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Id = "PRGPH07"
  let FineArts = await userHelpers.getNormalPara(Id);
  if (req.session.Success) {
    res.render('admin/nsa/fine-a', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, FineArts })
    req.session.Success = false
  } else {
    res.render('admin/nsa/fine-a', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, FineArts })
  }
});

router.get('/nsa/fine-arts-members', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Type = "Fine"
  let FinePro = await userHelpers.getNormalProfile(Type);
  if (req.session.Success) {
    res.render('admin/nsa/fine-m', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true,FinePro  })
    req.session.Success = false
  } else {
    res.render('admin/nsa/fine-m', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true,FinePro  })
  }
});

router.post('/nsa/fine-arts-members', verifyAdminLogin, (req, res) => {
  req.body.Type = 'Fine'
  adminHelpers.addUpdateProfile(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.Profile
      Image.mv('./public/images/profiles/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/nsa/fine-arts-members')
  })
});

router.post('/nsa/fine-arts-about', verifyAdminLogin, (req, res) => {

  let type = "Fine"
  adminHelpers.editPeragraphWithButton(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/nsa/fine-arts-about')
  })
});

// NSA - Library Board
router.get('/nsa/library-about', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Id = "PRGPH08"
  let Library = await userHelpers.getNormalPara(Id);
  if (req.session.Success) {
    res.render('admin/nsa/library-a', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, Library })
    req.session.Success = false
  } else {
    res.render('admin/nsa/library-a', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, Library })
  }
});


router.get('/nsa/library-members', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Type = "Library"
  let LibraryPro = await userHelpers.getNormalProfile(Type);
  if (req.session.Success) {
    res.render('admin/nsa/library-m', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true,LibraryPro  })
    req.session.Success = false
  } else {
    res.render('admin/nsa/library-m', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true,LibraryPro  })
  }
});

router.post('/nsa/library-members', verifyAdminLogin, (req, res) => {
  req.body.Type = "Library"
  adminHelpers.addUpdateProfile(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.Profile
      Image.mv('./public/images/profiles/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/nsa/library-members')
  })
});

router.post('/nsa/library-about', verifyAdminLogin, (req, res) => {

  let type = "Library"
  adminHelpers.editPeragraphWithButton(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/nsa/library-about')
  })
});

// NSA - Literary
router.get('/nsa/literary-about', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Id = "PRGPH09"
  let Literary = await userHelpers.getNormalPara(Id);
  if (req.session.Success) {
    res.render('admin/nsa/literary-a', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, Literary })
    req.session.Success = false
  } else {
    res.render('admin/nsa/literary-a', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, Literary })
  }
});

router.get('/nsa/literary-members', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Type = "Literary"
  let LiteraryPro = await userHelpers.getNormalProfile(Type);
  if (req.session.Success) {
    res.render('admin/nsa/literary-m', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true,LiteraryPro  })
    req.session.Success = false
  } else {
    res.render('admin/nsa/literary-m', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true,LiteraryPro  })
  }
});

router.post('/nsa/literary-members', verifyAdminLogin, (req, res) => {
  req.body.Type = "Literary"
  adminHelpers.addUpdateProfile(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.Profile
      Image.mv('./public/images/profiles/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/nsa/literary-members')
  })
});

router.post('/nsa/literary-about', verifyAdminLogin, (req, res) => {

  let type = "Literary"
  adminHelpers.editPeragraphWithButton(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/nsa/literary-about')
  })
});

// NSA - SAB
router.get('/nsa/sab-about', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Id = "PRGPH10"
  let Sab = await userHelpers.getNormalPara(Id);
  if (req.session.Success) {
    res.render('admin/nsa/sab-a', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, Sab })
    req.session.Success = false
  } else {
    res.render('admin/nsa/sab-a', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, Sab })
  }
});

router.get('/nsa/sab-members', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Type = "Sab"
  let SabPro = await userHelpers.getNormalProfile(Type);
  if (req.session.Success) {
    res.render('admin/nsa/sab-m', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true,SabPro  })
    req.session.Success = false
  } else {
    res.render('admin/nsa/sab-m', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true,SabPro  })
  }
});

router.post('/nsa/sab-members', verifyAdminLogin, (req, res) => {
  req.body.Type = "Sab"
  adminHelpers.addUpdateProfile(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.Profile
      Image.mv('./public/images/profiles/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/nsa/sab-members')
  })
});

router.post('/nsa/sab-about', verifyAdminLogin, (req, res) => {
  let type = "Sab"
  adminHelpers.editPeragraphWithButton(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/nsa/sab-about')
  })
});

// NSA - Mediacal
router.get('/nsa/medical-about', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Id = "PRGPH11"
  let Medical = await userHelpers.getNormalPara(Id);
  if (req.session.Success) {
    res.render('admin/nsa/medical-a', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, Medical })
    req.session.Success = false
  } else {
    res.render('admin/nsa/medical-a', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, Medical })
  }
});


router.get('/nsa/medical-members', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Type = "Medical"
  let MedicalPro = await userHelpers.getNormalProfile(Type);
  if (req.session.Success) {
    res.render('admin/nsa/medical-m', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true,MedicalPro  })
    req.session.Success = false
  } else {
    res.render('admin/nsa/medical-m', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true,MedicalPro  })
  }
});

router.post('/nsa/medical-members', verifyAdminLogin, (req, res) => {
  req.body.Type = "Medical"
  adminHelpers.addUpdateProfile(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.Profile
      Image.mv('./public/images/profiles/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/nsa/medical-members')
  })
});

router.post('/nsa/medical-about', verifyAdminLogin, (req, res) => {
  let type = "Medical"
  adminHelpers.editPeragraphWithButton(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/nsa/medical-about')
  })
});

// NSA - Itnob
router.get('/nsa/pro-it-about', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Id = "PRGPH12"
  let ItNob = await userHelpers.getNormalPara(Id);
  if (req.session.Success) {
    res.render('admin/nsa/it-a', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, ItNob })
    req.session.Success = false
  } else {
    res.render('admin/nsa/it-a', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, ItNob })
  }
});


router.get('/nsa/pro-it-members', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Type = "ItNob"
  let ItNobPro = await userHelpers.getNormalProfile(Type);
  if (req.session.Success) {
    res.render('admin/nsa/it-m', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true,ItNobPro  })
    req.session.Success = false
  } else {
    res.render('admin/nsa/it-m', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true,ItNobPro  })
  }
});

router.post('/nsa/pro-it-members', verifyAdminLogin, (req, res) => {
  req.body.Type = "ItNob"
  adminHelpers.addUpdateProfile(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.Profile
      Image.mv('./public/images/profiles/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/nsa/pro-it-members')
  })
});

router.post('/nsa/pro-it-about', verifyAdminLogin, (req, res) => {
  let type = "It"
  adminHelpers.editPeragraphWithButton(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/nsa/pro-it-about')
  })
});

// NSA - Research
router.get('/nsa/research-about', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Id = "PRGPH13"
  let Research = await userHelpers.getNormalPara(Id);
  if (req.session.Success) {
    res.render('admin/nsa/research-a', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, Research })
    req.session.Success = false
  } else {
    res.render('admin/nsa/research-a', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, Research })
  }
});

router.get('/nsa/research-members', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Type = "Research"
  let ResearchPro = await userHelpers.getNormalProfile(Type);
  if (req.session.Success) {
    res.render('admin/nsa/research-m', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true,ResearchPro  })
    req.session.Success = false
  } else {
    res.render('admin/nsa/research-m', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true,ResearchPro  })
  }
});

router.post('/nsa/research-members', verifyAdminLogin, (req, res) => {
  req.body.Type = "Research"
  adminHelpers.addUpdateProfile(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.Profile
      Image.mv('./public/images/profiles/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/nsa/research-members')
  })
});

router.post('/nsa/research-about', verifyAdminLogin, (req, res) => {
  let type = "Research"
  adminHelpers.editPeragraphWithButton(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/nsa/research-about')
  })
});

// NSA - Garden
router.get('/nsa/garden-about', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Id = "PRGPH14"
  let Garden = await userHelpers.getNormalPara(Id);
  if (req.session.Success) {
    res.render('admin/nsa/garden-a', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, Garden })
    req.session.Success = false
  } else {
    res.render('admin/nsa/garden-a', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, Garden })
  }
});

router.get('/nsa/garden-members', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Type = "Garden"
  let GardenPro = await userHelpers.getNormalProfile(Type);
  if (req.session.Success) {
    res.render('admin/nsa/garden-m', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true,GardenPro  })
    req.session.Success = false
  } else {
    res.render('admin/nsa/garden-m', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true,GardenPro  })
  }
});

router.post('/nsa/garden-members', verifyAdminLogin, (req, res) => {
  req.body.Type = "Garden"
  adminHelpers.addUpdateProfile(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.Profile
      Image.mv('./public/images/profiles/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/nsa/garden-members')
  })
});

router.post('/nsa/garden-about', verifyAdminLogin, (req, res) => {
  let type = "Garden"
  adminHelpers.editPeragraphWithButton(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/nsa/garden-about')
  })
});

// SKSSF

router.get('/skssf', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  res.render('admin/skssf/skssf-all', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, })
});

router.get('/skssf/skssf-about', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Id = "PRGPH15"
  let SkssfPara = await userHelpers.getNormalPara(Id);
  if (req.session.Success) {
    res.render('admin/skssf/skssf-a', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, SkssfPara })
    req.session.Success = false
  } else {
    res.render('admin/skssf/skssf-a', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, SkssfPara })
  }
});

router.post('/skssf/skssf-about', verifyAdminLogin, (req, res) => {
  let type = "Skssf"
  adminHelpers.editPeragraphWithButton(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/skssf/skssf-about')
  })
});

router.get('/skssf/skssf-members', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Type = "Skssf"
  let SkssfPro = await userHelpers.getNormalProfile(Type);
  if (req.session.Success) {
    res.render('admin/skssf/skssf-m', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true,SkssfPro  })
    req.session.Success = false
  } else {
    res.render('admin/skssf/skssf-m', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true,SkssfPro  })
  }
});

router.post('/skssf/skssf-members', verifyAdminLogin, (req, res) => {
  req.body.Type = 'Skssf'
  adminHelpers.addUpdateProfile(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.Profile
      Image.mv('./public/images/profiles/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/skssf/skssf-members')
  })
});

router.get('/skssf/skssf-links', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Type = "Skssf"
  let SkssfLinks = await userHelpers.getNormelLinks(Type);

  if (req.session.Success) {
    res.render('admin/skssf/skssf-links', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, SkssfLinks  })
    req.session.Success = false
  } else {
    res.render('admin/skssf/skssf-links', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, SkssfLinks  })
  }
});

router.post('/skssf/skssf-links', verifyAdminLogin, (req, res) => {
  let type = "Skssf"
  adminHelpers.updateLinks(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/skssf/skssf-links')
  })
});


// SKSSF - Fund
router.get('/skssf/fund-about', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Id = "PRGPH16"
  let Fund = await userHelpers.getNormalPara(Id);
  if (req.session.Success) {
    res.render('admin/skssf/fund-a', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, Fund })
    req.session.Success = false
  } else {
    res.render('admin/skssf/fund-a', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, Fund })
  }
});

router.get('/skssf/fund-members', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Type = "Fund"
  let FundPro = await userHelpers.getNormalProfile(Type);
  if (req.session.Success) {
    res.render('admin/skssf/fund-m', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true,FundPro  })
    req.session.Success = false
  } else {
    res.render('admin/skssf/fund-m', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true,FundPro  })
  }
});

router.post('/skssf/fund-members', verifyAdminLogin, (req, res) => {
  req.body.Type = 'Fund'
  adminHelpers.addUpdateProfile(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.Profile
      Image.mv('./public/images/profiles/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/skssf/fund-members')
  })
});

router.post('/skssf/fund-about', verifyAdminLogin, (req, res) => {

  let type = "Fund"
  adminHelpers.editPeragraphWithButton(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/skssf/fund-about')
  })
});

// SKSSF - Store
router.get('/skssf/store-about', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Id = "PRGPH17"
  let Store = await userHelpers.getNormalPara(Id);
  if (req.session.Success) {
    res.render('admin/skssf/store-a', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, Store })
    req.session.Success = false
  } else {
    res.render('admin/skssf/store-a', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, Store })
  }
});


router.get('/skssf/store-members', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Type = "Store"
  let StorePro = await userHelpers.getNormalProfile(Type);
  if (req.session.Success) {
    res.render('admin/skssf/store-m', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true,StorePro  })
    req.session.Success = false
  } else {
    res.render('admin/skssf/store-m', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true,StorePro  })
  }
});

router.post('/skssf/store-members', verifyAdminLogin, (req, res) => {
  req.body.Type = "Store"
  adminHelpers.addUpdateProfile(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.Profile
      Image.mv('./public/images/profiles/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/skssf/store-members')
  })
});

router.post('/skssf/store-about', verifyAdminLogin, (req, res) => {

  let type = "Store"
  adminHelpers.editPeragraphWithButton(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/skssf/store-about')
  })
});

// Updates - News

router.get('/news', verifyAdminLogin, async (req, res) => {
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let AllNews = await userHelpers.getAllNewsFullSize();
 
  if (req.session.Success) {
    res.render('admin/updates/news', { title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, AllNews   })
    req.session.Success = false
  } else {
    res.render('admin/updates/news', { title: 'Admin panel', nsaWebDarkTheme, admin, sideHeader: true, AllNews   })
  }
});

router.post('/news', verifyAdminLogin, (req, res) => {
 
  adminHelpers.addUpdateNews(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.News
      Image.mv('./public/images/news/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/news')
  })
});

router.post('/delete-news', (req, res) => {

  adminHelpers.deleteNews(req.body).then((response) => {
    let Imagepath = path.join(__dirname, '../public/images/news/' + req.body.Id + '.jpg')
    fs.unlink(Imagepath, function (err) {
      if (err)
        return;

    });

    res.json(response)
  })
});


// About - Gallery

router.get('/gallery',verifyAdminLogin , async(req,res)=>{
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Gallery = await userHelpers.getFullGallery();
  if (req.session.Success) {
    res.render('admin/about/gallery',{ title: 'Admin panel', "Success": req.session.Success, nsaWebDarkTheme, admin, sideHeader: true, Gallery    })
    req.session.Success = false
  } else {
    res.render('admin/about/gallery',{ title: 'Admin panel',  nsaWebDarkTheme, admin, sideHeader: true,  Gallery   })
  }
});

router.post('/gallery', verifyAdminLogin, (req, res) => {
 
  adminHelpers.addUpdateGallery(req.body).then((response) => {
    let Image = req.files
    if (Image) {
      Image = req.files.Image
      Image.mv('./public/images/gallery/' + response.Id + '.jpg')
    }
    req.session.Success = response.Success
    res.redirect('/admin/gallery')
  })
});


router.post('/delete-gallery', (req, res) => {

  adminHelpers.deleteGalleryImage(req.body).then((response) => {
    let Imagepath = path.join(__dirname, '../public/images/gallery/' + req.body.Id + '.jpg')
    fs.unlink(Imagepath, function (err) {
      if (err)
        return;

    });

    res.json(response)
  })
});

// About - Social links

router.get('/social-links',verifyAdminLogin,async(req,res)=>{
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let Type2 = "Nsa"
  let NsaLinks = await userHelpers.getNormelLinks(Type2);
  console.log(req.session.Success);
  if (req.session.Success) {
    res.render('admin/about/social-links', {title: 'Admin panel',    nsaWebDarkTheme, admin, sideHeader: true, NsaLinks  })
    req.session.Success = false
    console.log(req.session.Success);
  } else {
    res.render('admin/about/social-links', {title: 'Admin panel',  nsaWebDarkTheme, admin, sideHeader: true, NsaLinks  })
  }
});

router.post('/social-links',verifyAdminLogin,async(req,res)=>{
  let type = "Nsa"
  adminHelpers.updateLinkName(req.body, type).then(() => {
    req.session.Success = "Successfully edited"
    res.redirect('/admin/social-links')
  })
});

router.get('/messages',verifyAdminLogin,async(req,res)=>{
  var nsaWebDarkTheme = req.session.nsaWebDarkTheme
  let admin = req.session.NSAWEBADMIN
  let AllMessages = await adminHelpers.getuserMessages(); 
    res.render('admin/about/message', {title: 'Admin panel',  nsaWebDarkTheme, admin, sideHeader: true, AllMessages })
  
});



module.exports = router;
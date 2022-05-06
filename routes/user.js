var express = require('express');
const adminHelpers = require('../helpers/admin-helpers');
const userHelpers = require('../helpers/user-helpers');
var router = express.Router();

// change theme
router.post('/change-theme',(req,res)=>{
   
    if(req.body.theme == "Dark"){
        req.session.nsaWebDarkTheme = true
        
    }else{
       
        req.session.nsaWebDarkTheme = false
    }
    res.json()
});

/* GET home page. */
router.get('/', async function (req, res, next) {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
  //  var Slides = await userHelpers.getFullSlide()
  ///  var TheNsa = await userHelpers.getTheNsa()
  ///  var TheMajma = await userHelpers.getTheMajma()
   // var Links = await userHelpers.getFLinks()
    res.render('user/home', { title: "Home",nsaWebDarkTheme,adminHere,user:true, Slides,TheNsa , TheMajma,Links });
});

// Our teachers

router.get('/our-teachers',(req,res)=>{
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    userHelpers.getAllTeachers().then((data)=>{
     
        res.render('user/our-teachers', { title: "Our teachers",nsaWebDarkTheme,adminHere,user:true, data })
    })
});
// Our leaders

router.get('/our-leaders',(req,res)=>{
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    userHelpers.getAllLeaders().then((leaders)=>{
        res.render('user/our-leaders', { title: "Our leaders",nsaWebDarkTheme,adminHere,user:true, leaders  })
   })
});

// Our faculty

router.get('/our-faculty',async(req,res)=>{
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Pre = await userHelpers.getPreData();
    let Ug = await userHelpers.getUgData();
    let Pg = await userHelpers.getPgData();
    let Hod = await userHelpers.getHodData();
    res.render('user/our-faculty', { title: "Our faculty",nsaWebDarkTheme,adminHere,user:true, Pre,Ug ,Pg,Hod  })

});










module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let admin = req.session.NSAWEBADMIN
    res.render('user/home', { title: "Home",nsaWebDarkTheme,admin  });
});

// Our teachers

router.get('/our-teachers',(req,res)=>{
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let admin = req.session.NSAWEBADMIN
    res.render('user/our-teachers', { title: "Our teachers",nsaWebDarkTheme,admin  })
})





// change theme
router.post('/change-theme',(req,res)=>{
    if(req.body.theme == "dark"){
        req.session.nsaWebDarkTheme = true
    }else{
        req.session.nsaWebDarkTheme = false
    }
    res.json()
});


module.exports = router;

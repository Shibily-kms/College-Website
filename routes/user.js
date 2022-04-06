var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    res.render('user/home', { title: "Home",nsaWebDarkTheme  });
});

router.post('/change-theme',(req,res)=>{
    
    if(req.body.theme == "dark"){
        req.session.nsaWebDarkTheme = true
    }else{
        req.session.nsaWebDarkTheme = false
    }
    res.json()
})

module.exports = router;

var express = require('express');
const adminHelpers = require('../helpers/admin-helpers');
const userHelpers = require('../helpers/user-helpers');
var router = express.Router();

// change theme
router.post('/change-theme', (req, res) => {

    if (req.body.theme == "Dark") {
        req.session.nsaWebDarkTheme = true

    } else {

        req.session.nsaWebDarkTheme = false
    }
    res.json()
});

/* GET home page. */
router.get('/', async function (req, res, next) {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Id1 = "PRGPH01"
    var TheNsa = await userHelpers.getNormalPara(Id1);
    let Id2 = "PRGPH02"
    var TheMajma = await userHelpers.getNormalPara(Id2);
    var Slides = await userHelpers.getFullSlide();
    var Links = await userHelpers.getFLinks();
    let FourNews = await userHelpers.getlatestNews();
    res.render('user/home', {
        title: "Home", nsaWebDarkTheme, adminHere, user: true, Slides, TheNsa, TheMajma, Links, FourNews
    });
});

// Our teachers

router.get('/our-teachers', (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    userHelpers.getAllTeachers().then((data) => {

        res.render('user/our-teachers', { title: "Our teachers", nsaWebDarkTheme, adminHere, user: true, data })
    })
});
// Our leaders

router.get('/our-leaders', (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    userHelpers.getAllLeaders().then((leaders) => {
        res.render('user/our-leaders', { title: "Our leaders", nsaWebDarkTheme, adminHere, user: true, leaders })
    })
});

// Our faculty

router.get('/our-faculty', async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Id1 = "PRGPH03"
    let Pre = await userHelpers.getNormalPara(Id1);
    let Id2 = "PRGPH04"
    let Ug = await userHelpers.getNormalPara(Id2);
    let Id3 = "PRGPH05"
    let Pg = await userHelpers.getNormalPara(Id3);
    let Hod = await userHelpers.getHodData();

    res.render('user/our-faculty', { title: "Our faculty", nsaWebDarkTheme, adminHere, user: true, Pre, Ug, Pg, Hod })

});

// NSA

router.get('/nsa', async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Id = "PRGPH06"
    let nsaPara = await userHelpers.getNormalPara(Id);
    let Type1 = "NSA"
    let nsaPro = await userHelpers.getNormalProfile(Type1);
    let Type2 = "Nsa"
    let NsaLinks = await userHelpers.getNormelLinks(Type2);

    res.render('user/nsa', { title: "The NSA", nsaWebDarkTheme, adminHere, user: true, nsaPara, nsaPro, NsaLinks })

});
router.get('/nsa/fine-arts', async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Id = "PRGPH07"
    let FineArts = await userHelpers.getNormalPara(Id);
    let Type1 = "Fine"
    let FinePro = await userHelpers.getNormalProfile(Type1);
    res.render('user/fine-arts', { title: "Fine arts", nsaWebDarkTheme, adminHere, user: true, FineArts, FinePro })

});
router.get('/nsa/library-board', async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Id = "PRGPH08"
    let Library = await userHelpers.getNormalPara(Id);
    let Type1 = "Library"
    let LibraryPro = await userHelpers.getNormalProfile(Type1);
    res.render('user/library', { title: "Library board", nsaWebDarkTheme, adminHere, user: true, Library, LibraryPro })

});
router.get('/nsa/literary-wing', async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Id = "PRGPH09"
    let Literary = await userHelpers.getNormalPara(Id);
    let Type1 = "Literary"
    let LiteraryPro = await userHelpers.getNormalProfile(Type1);
    res.render('user/literary', { title: "Literary wing", nsaWebDarkTheme, adminHere, user: true, Literary, LiteraryPro })

});
router.get('/nsa/social-affairs', async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Id = "PRGPH10"
    let Sab = await userHelpers.getNormalPara(Id);
    let Type1 = "Sab"
    let SabPro = await userHelpers.getNormalProfile(Type1);
    res.render('user/sab', { title: "Social affairs board", nsaWebDarkTheme, adminHere, user: true, Sab, SabPro })

});
router.get('/nsa/medical-board', async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Id = "PRGPH11"
    let Medical = await userHelpers.getNormalPara(Id);
    let Type1 = "Medical"
    let MedicalPro = await userHelpers.getNormalProfile(Type1);
    res.render('user/medical', { title: "Medical board", nsaWebDarkTheme, adminHere, user: true, Medical, MedicalPro })

});
router.get('/nsa/pro-itnob', async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Id = "PRGPH12"
    let ItNob = await userHelpers.getNormalPara(Id);
    let Type1 = "ItNob"
    let ItNobPro = await userHelpers.getNormalProfile(Type1);
    res.render('user/it', { title: "PRO & IT nob", nsaWebDarkTheme, adminHere, user: true, ItNob, ItNobPro })

});
router.get('/nsa/research-cell', async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Id = "PRGPH13"
    let Research = await userHelpers.getNormalPara(Id);
    let Type1 = "Research"
    let ResearchPro = await userHelpers.getNormalProfile(Type1);
    res.render('user/research', { title: "Research cell", nsaWebDarkTheme, adminHere, user: true, Research, ResearchPro })

});
router.get('/nsa/garden-committee', async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Id = "PRGPH14"
    let Garden = await userHelpers.getNormalPara(Id);
    let Type1 = "Garden"
    let GardenPro = await userHelpers.getNormalProfile(Type1);
    res.render('user/garden', { title: "Garden Committee", nsaWebDarkTheme, adminHere, user: true, Garden, GardenPro })

});

// SKSSF


router.get('/skssf', async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Id = "PRGPH15"
    let SkssfPara = await userHelpers.getNormalPara(Id);
    let Type1 = "Skssf"
    let SkssfPro = await userHelpers.getNormalProfile(Type1);
    let Type2 = "Skssf"
    let SkssfLinks = await userHelpers.getNormelLinks(Type2);

    res.render('user/skssf', { title: "The SKSSF", nsaWebDarkTheme, adminHere, user: true, SkssfPara, SkssfPro, SkssfLinks })
});

router.get('/skssf/fund', async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Id = "PRGPH16"
    let Fund = await userHelpers.getNormalPara(Id);
    let Type1 = "Fund"
    let FundPro = await userHelpers.getNormalProfile(Type1);
    res.render('user/fund', { title: "Fund", nsaWebDarkTheme, adminHere, user: true, Fund, FundPro })

});
router.get('/skssf/store', async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Id = "PRGPH17"
    let Store = await userHelpers.getNormalPara(Id);
    let Type1 = "Store"
    let StorePro = await userHelpers.getNormalProfile(Type1);
    res.render('user/store', { title: "Store", nsaWebDarkTheme, adminHere, user: true, Store, StorePro })

});

router.get("/news", async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    userHelpers.getAllNewsSmallSize().then((AllNews) => {
        res.render('user/news-all', { title: "News Updates", nsaWebDarkTheme, adminHere, user: true, AllNews })
    })
});

router.get("/news/:id", async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Id = req.params.id
    userHelpers.getOneNewsFullSize(Id).then((OneNews) => {
        res.render('user/news-One', { title: "News Updates", nsaWebDarkTheme, adminHere, user: true, OneNews })
    })
});

router.get("/gallery", async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    userHelpers.getUserGallery().then((Gallery) => {
        res.render('user/gallery', { title: "Gallery", nsaWebDarkTheme, adminHere, user: true, Gallery })
    })
});

router.get("/contact-us", async (req, res) => {
    var nsaWebDarkTheme = req.session.nsaWebDarkTheme
    let adminHere = req.session.NSAWEBADMIN
    let Type2 = "Nsa"
    let NsaLinks = await userHelpers.getNormelLinks(Type2);
    if (req.session.Success) {
        res.render('user/contact-us', { title: "Contact us", "Success": req.session.Success,  nsaWebDarkTheme, adminHere, user: true,  NsaLinks })
        req.session.Success = false
      } else {
        res.render('user/contact-us', { title: "Contact us", nsaWebDarkTheme, adminHere, user: true,  NsaLinks })
      }

   
});

router.post("/user-message", async (req, res) => {
    userHelpers.sendMessage(req.body).then(()=>{
        req.session.Success = "Your message was sended"
        res.redirect('/contact-us')
    })
   
});







module.exports = router;

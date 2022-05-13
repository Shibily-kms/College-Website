var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var ObjectId = require('mongodb').ObjectId;
const { reject, resolve, all } = require('promise')
const { response } = require('express')

module.exports = {

    getFullSlide: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FIRST_PAGE_COLLECTION).findOne({ Name: "Slide" }).then((slide) => {

                resolve(slide.Slids)
            })
        })
    },

    getOneSlide: (body) => {
        return new Promise((resolve, reject) => {
            let OneSlide = null
            db.get().collection(collection.FIRST_PAGE_COLLECTION).findOne({ Name: "Slide", Slids: { $elemMatch: { Id: body.Id } } })
                .then((slide) => {


                    for (let i = 0; i < slide.Slids.length; i++) {
                        if (slide.Slids[i].Id == body.Id) {
                            OneSlide = slide.Slids[i]
                            break;
                        }
                    }
                    resolve(OneSlide);
                })
        })
    },
    getFLinks: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FIRST_PAGE_COLLECTION).findOne({ Name: "Links" }).then((links) => {
                resolve(links)
            })
        })
    },

    getAllTeachers: () => {
        return new Promise(async (resolve, reject) => {
            let firstTwo = []
            let teachers = await db.get().collection(collection.PROFILE_COLLECTON).find({ Type: "Teacher" }).toArray()
            teachers.sort((a, b) => {
                return a.Index - b.Index;
            })

            if (teachers[1]) {
                for (let i = 0; i < 2; i++) {
                    firstTwo.push(teachers[i])
                }
                teachers.splice(0, 2)
            }
            let data = {
                firstTwo,
                teachers
            }
            resolve(data)
        })
    },

    getAllLeaders: () => {
        return new Promise(async (resolve, reject) => {

            let leaders = await db.get().collection(collection.PROFILE_COLLECTON).find({ Type: "Leader" }).toArray()
            leaders.sort((a, b) => {
                return a.Index - b.Index;
            })

            resolve(leaders)
        })
    },

    getHodData: () => {
        return new Promise(async (resolve, reject) => {

            let Hod = await db.get().collection(collection.PROFILE_COLLECTON).find({ Type: "Hod" }).toArray()
            Hod.sort((a, b) => {
                return a.Index - b.Index;
            })

            resolve(Hod)
        })
    },

    getNormalPara: (id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PARAGRAPH_COLLECTION).findOne({ Id: id }).then((paragrpah) => {
                resolve(paragrpah)
            })
        })
    },

    getNormalProfile: (Type) => {
        return new Promise(async (resolve, reject) => {
            let Profiles = await db.get().collection(collection.PROFILE_COLLECTON).find({ Type }).toArray()
            Profiles.sort((a, b) => {
                return a.Index - b.Index;
            })
            resolve(Profiles)
        })
    },

    getNormelLinks: (Type) => {
        return new Promise(async (resolve, reject) => {
            let links = await db.get().collection(collection.LINK_COLLECTION).findOne({ Type })
            resolve(links)
        });
    },

    getAllNewsFullSize: () => {
        return new Promise(async (resolve, reject) => {
            let news = await db.get().collection(collection.NEWS_COLLECTION).find().toArray();
            news.reverse();
            resolve(news)
        })
    },

    getlatestNews: () => {
        return new Promise(async (resolve, reject) => {
            let news = await db.get().collection(collection.NEWS_COLLECTION).find().toArray();
            news.reverse();
            let latest = news.slice(0, 4)
            const count1 = 300;
            const count2 = 50;
            for (let i = 0; i < latest.length; i++) {
                latest[i].Header = latest[i].Header.slice(0, count2) + (latest[i].Header.length > count2 ? "..." : "")
                latest[i].Content[0] = latest[i].Content[0].slice(0, count1) + (latest[i].Content[0].length > count1 ? "..." : "")
                latest[i].Time = latest[i].Time.toLocaleString('en-US', { timeZone: "Asia/Kolkata" });

            }
            resolve(latest)
        })
    },

    getAllNewsSmallSize: () => {
        return new Promise(async (resolve, reject) => {
            let news = await db.get().collection(collection.NEWS_COLLECTION).find().toArray();
            news.reverse();
            const count1 = 300;
            const count2 = 50;
            for (let i = 0; i < news.length; i++) {
                news[i].Header = news[i].Header.slice(0, count2) + (news[i].Header.length > count2 ? "..." : "")
                news[i].Content[0] = news[i].Content[0].slice(0, count1) + (news[i].Content[0].length > count1 ? "..." : "")
                news[i].Time = news[i].Time.toLocaleString('en-US', { timeZone: "Asia/Kolkata" });

            }
            resolve(news)

        })
    },

    getOneNewsFullSize: (Id) => {
        return new Promise(async (resolve, reject) => {
            let news = await db.get().collection(collection.NEWS_COLLECTION).findOne({ Id })
            news.Time = news.Time.toLocaleString('en-US', { timeZone: "Asia/Kolkata" });
            resolve(news)

        })
    },

    getFullGallery: () => {
        return new Promise(async (resolve, reject) => {
            let Gallery = await db.get().collection(collection.GALLERY_COLLECTION).find().toArray();
            Gallery.reverse();
            resolve(Gallery);
        })
    },

    getUserGallery: () => {
        return new Promise(async (resolve, reject) => {
            let response = []
            let Group1 = []
            let Group2 = []
            let Group3 = []
            let Group4 = []
            let Gallery = await db.get().collection(collection.GALLERY_COLLECTION).find().toArray();

            Gallery.reverse();

            
            for (let i = 0; i < Gallery.length; i++) {
                let Divide = i / 4
                var decimals = Divide - Math.floor(Divide);
                switch (decimals) {
                    case 0:
                        Group1.push(Gallery[i])
                        break;
                    case 0.25:
                        Group2.push(Gallery[i])
                        break;
                    case 0.5:
                        Group3.push(Gallery[i])
                        break;
                    case 0.75:
                        Group4.push(Gallery[i])
                        break;
                
                    default:
                        break;
                }
            }
            // response.Gallery = Gallery
            response.Group1 = Group1
            response.Group2 = Group2
            response.Group3 = Group3
            response.Group4 = Group4
            
          

            resolve(response);
        })
    }




}
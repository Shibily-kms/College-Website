var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { CourierClient } = require("@trycourier/courier");
const courier = CourierClient({ authorizationToken: "pk_prod_YQ215TTT7JMSWAP6MMRP9453JW8K" });
var ObjectId = require('mongodb').ObjectId;
const { reject, resolve, all } = require('promise')
const { response } = require('express');


module.exports = {


    // For admin
    authAdminLog: (body) => {
        return new Promise(async (resolve, reject) => {
            let response = []
            // let proAdminAuth = {
            //     EmailId: "admin@nsaonline.in",
            //     Password: "$2b$10$Uf7AtQ19KCRcfbDgAu3p5OBQEGrPiwSxCgtTNYQV0P/AzADiXV9TG"
            // }
            let Admin = await db.get().collection(collection.AUTH_COLLECTIONS).findOne({ EmailId: body.EmailId })
            if (Admin) {
                bcrypt.compare(body.Password, Admin.Password).then((result) => {
                    if (result) {
                        response.adminDetails = Admin,
                            response.success = true
                        resolve(response)
                    } else {
                        resolve({ PasswordError: true })
                    }
                })
            } else {
                resolve({ EmailError: true })
            }

            
        })
    },

    checkEmailId: (body) => {
        return new Promise(async (resolve, reject) => {
            let Admin = await db.get().collection(collection.AUTH_COLLECTIONS).findOne({ EmailId: body.EmailId })
            let response = []
            if (Admin) {
              
                let OTP = 0
                create_random_id(4)
                function create_random_id(sting_length) {
                    var randomString = '';
                    var numbers = '1234567890'
                    for (var i, i = 0; i < sting_length; i++) {
                        randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                    }
                    OTP = randomString
                }
                await db.get().collection(collection.AUTH_COLLECTIONS).updateOne({ EmailId: body.EmailId }, {
                    $set: {
                        Otp: OTP
                    }
                }).then(async () => {
                 
                    const { requestId } = await courier.send({
                        message: {
                            content: {
                                title: "Forgot password OTP",
                                body: ""
                            },
                            data: {
                                ContentHead: "nsaonline website Admin panel Forgot password OTP",
                                OTP: OTP
                            },
                            to: {
                                email: Admin.EmailId
                            }
                        }
                    });
                   
                    response.Success = "OTP Sended"
                    response.EmailId = body.EmailId
                    resolve(response)
                })

            } else {
                response.Error = "Email id not match, Try again"
                resolve(response)
            }
        })
    },

    checkOTP: (body) => {
        return new Promise(async (resolve, reject) => {
            let check = await db.get().collection(collection.AUTH_COLLECTIONS).findOne({ EmailId: body.EmailId, Otp: body.Otp })
            if (check) {
                resolve(check)
            } else {
                response.Error = "Otp Not match",
                    response.EmailId = body.EmailId
                resolve(response)
            }
        })
    },

    setNewPassword: (body) => {
        return new Promise(async (resolve, reject) => {
            body.Password = await bcrypt.hash(body.Password, 10)
            db.get().collection(collection.AUTH_COLLECTIONS).updateOne({ EmailId: body.EmailId }, {
                $set: {
                    Password: body.Password,
                    Otp: 0
                }
            }).then(() => {
                resolve()
            })
        })
    },

    checkActivation: () => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.FIRST_PAGE_COLLECTION).findOne({ Name: "Slide" }).then((check) => {

                resolve(check)
            })
        })
    },

    // First page
    editSlider: (body) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collection.FIRST_PAGE_COLLECTION).updateOne({ Name: "Slide", "Slids.Id": body.id }, {
                $set: {
                    "Slids.$.Header": body.header,
                    "Slids.$.Content": body.content
                }
            }).then((response) => {
                resolve()
            })
        })
    },

    addUpdateDayBar: (body) => {
        return new Promise((resolve, reject) => {
            if (body.Id == '') {

                create_random_id(10)
                function create_random_id(sting_length) {
                    var randomString = '';
                    var numbers = '123456789ABCDEFGHJKLMNOPQRSTUVWXYZ'
                    for (var i, i = 0; i < sting_length; i++) {
                        randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                    }
                    body.Id = randomString
                }

                create_random_idn(1)
                function create_random_idn(sting_length) {
                    var randomString = '';
                    var numbers = '123456789'
                    for (var i, i = 0; i < sting_length; i++) {
                        randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                    }
                    body.Color = randomString
                }
                body.Filter = body.Month + body.Day
                body.Filter = parseInt(body.Filter)
                body.Day = parseInt(body.Day)
                body.Month = parseInt(body.Month)

                db.get().collection(collection.DAY_BAR_COLLECTION).insertOne(body).then(() => {
                    response.Id = body.Id
                    response.Success = "New day bar Successfully Created"
                    resolve(response)
                })
            } else {

                body.Filter = body.Month + body.Day
                body.Filter = parseInt(body.Filter)
                body.Day = parseInt(body.Day)
                body.Month = parseInt(body.Month)

                db.get().collection(collection.DAY_BAR_COLLECTION).updateOne({ Id: body.Id }, {
                    $set: {
                        Day: body.Day,
                        Month: body.Month,
                        Title: body.Title,
                        Description: body.Description,
                        Link: body.Link,
                        Filter: body.Filter
                    }
                }).then(() => {
                    response.Id = body.Id
                    response.Success = "This Day bar Successfully Updated"
                    resolve(response)
                })
            }
        })
    },

    deleteDayBar: (body) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.DAY_BAR_COLLECTION).deleteOne({ Id: body.Id }).then((response) => {
                resolve(response)
            })
        })
    },

    getAllDayBar: () => {
        return new Promise(async (resolve, reject) => {
            let days = await db.get().collection(collection.DAY_BAR_COLLECTION).find().toArray()
            days.sort((a, b) => {
                return a.Filter - b.Filter;
            })
            resolve(days)
        })
    },

    editPeragraph: (body, type) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PARAGRAPH_COLLECTION).updateOne({ Name: type }, {
                $set: {
                    Header: body.Header,
                    Para1: body.Para1,
                    Para2: body.Para2,
                    Para3: body.Para3,
                    Para4: body.Para4,
                    Para5: body.Para5

                }
            }).then(() => {
                resolve()
            })
        })
    },
    editPeragraphWithButton: (body, type) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collection.PARAGRAPH_COLLECTION).updateOne({ Name: type, }, {
                $set: {

                    Header: body.Header,
                    Para1: body.Para1,
                    Para2: body.Para2,
                    Para3: body.Para3,
                    Para4: body.Para4,
                    Para5: body.Para5,
                    "Btn1.Name": body.B1Name,
                    "Btn1.Link": body.B1Link,
                    "Btn1.New": body.B1New,
                    "Btn2.Name": body.B2Name,
                    "Btn2.Link": body.B2Link,
                    "Btn2.New": body.B2New
                }
            }).then(() => {

                resolve()
            })
        })
    },

    editFirstLinks: (body, type) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FIRST_PAGE_COLLECTION).updateOne({ Name: type }, {
                $set: {
                    Cic: body.cic,
                    College: body.college,
                    Wsf: body.wsf
                }
            }).then(() => {
                resolve()
            })
        })
    },

    addUpdateProfile: (body) => {

        let response = []
        return new Promise((resolve, reject) => {
            if (body.Mobile) {
                body.Mobile = parseInt(body.Mobile)
            }
            body.Index = parseInt(body.Index)
            if (body.Id == '') {

                create_random_id(10)
                function create_random_id(sting_length) {
                    var randomString = '';
                    var numbers = '123456789ABCDEFGHJKLMNOPQRSTUVWXYZ'
                    for (var i, i = 0; i < sting_length; i++) {
                        randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                    }
                    body.Id = randomString
                }

                db.get().collection(collection.PROFILE_COLLECTON).insertOne(body).then(() => {
                    response.Id = body.Id
                    response.Success = "New Profile Successfully Created"
                    resolve(response)
                })
            } else {
                db.get().collection(collection.PROFILE_COLLECTON).updateOne({ Id: body.Id }, {
                    $set: {
                        Index: body.Index,
                        FullName: body.FullName,
                        Address: body.Address,
                        Position: body.Position,
                        Mobile: body.Mobile,
                    }
                }).then(() => {
                    response.Id = body.Id
                    response.Success = "This Profile Successfully Updated"
                    resolve(response)
                })
            }
        })
    },

    deleteProfile: (body) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PROFILE_COLLECTON).deleteOne({ Id: body.Id }).then((Id) => {
                resolve(Id)
            })
        })
    },

    updateLinks: (body, Type) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.LINK_COLLECTION).updateOne({ Type }, {
                $set: {
                    Discord: body.Discord,
                    Email: body.Email,
                    Facebook: body.Facebook,
                    Github: body.Github,
                    Website: body.Website,
                    Instagram: body.Instagram,
                    Linkedin: body.Linkedin,
                    Messenger: body.Messenger,
                    Mobile: body.Mobile,
                    Signal: body.Signal,
                    Telegram: body.Telegram,
                    Tiktok: body.Tiktok,
                    Twitter: body.Twitter,
                    Whatsapp: body.Whatsapp,
                    Youtube: body.Youtube
                }
            }).then(() => {
                resolve()
            })
        })
    },

    addUpdateNews: (body) => {

        let response = []
        return new Promise((resolve, reject) => {

            if (body.Id == '') {
                body.Time = new Date();
                create_random_id(10)
                function create_random_id(sting_length) {
                    var randomString = '';
                    var numbers = '123456789ABCDEFGHJKLMNOPQRSTUVWXYZ'
                    for (var i, i = 0; i < sting_length; i++) {
                        randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                    }
                    body.Id = randomString
                }

                db.get().collection(collection.NEWS_COLLECTION).insertOne(body).then(() => {
                    response.Id = body.Id
                    response.Success = "New news Successfully Created"
                    resolve(response)
                })
            } else {
                db.get().collection(collection.NEWS_COLLECTION).updateOne({ Id: body.Id }, {
                    $set: {
                        Header: body.Header,
                        Content: body.Content,

                    }
                }).then(() => {
                    response.Id = body.Id
                    response.Success = "This news Successfully Updated"
                    resolve(response)
                })
            }
        })
    },

    deleteNews: (body) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.NEWS_COLLECTION).deleteOne({ Id: body.Id }).then((Id) => {
                resolve(Id)
            })
        })
    },

    addUpdateGallery: (body) => {

        let response = []
        return new Promise((resolve, reject) => {
            if (body.Id == '') {

                create_random_id(10)
                function create_random_id(sting_length) {
                    var randomString = '';
                    var numbers = '123456789ABCDEFGHJKLMNOPQRSTUVWXYZ987654321qwertyuioplkjhgfdsazxcvbnm'
                    for (var i, i = 0; i < sting_length; i++) {
                        randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                    }
                    body.Id = randomString
                }

                db.get().collection(collection.GALLERY_COLLECTION).insertOne(body).then(() => {
                    response.Id = body.Id
                    response.Success = "New Image Successfully added to Gallery"
                    resolve(response)
                })
            } else {
                db.get().collection(collection.GALLERY_COLLECTION).updateOne({ Id: body.Id }, {
                    $set: {
                        Title: body.Title,
                        Description: body.Description
                    }
                }).then(() => {
                    response.Id = body.Id
                    response.Success = "This Image Successfully Updated"
                    resolve(response)
                })
            }
        })
    },

    deleteGalleryImage: (body) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.GALLERY_COLLECTION).deleteOne({ Id: body.Id }).then((Id) => {
                resolve(Id)
            })
        })
    },

    updateLinkName: (body, Type) => {

        return new Promise((resolve, reject) => {
            db.get().collection(collection.LINK_COLLECTION).updateOne({ Type }, {
                $set: {
                    NameDiscord: body.NameDiscord,
                    NameFacebook: body.NameFacebook,
                    NameGithub: body.NameGithub,
                    NameWebsite: body.NameWebsite,
                    NameInstagram: body.NameInstagram,
                    NameLinkedin: body.NameLinkedin,
                    NameMessenger: body.NameMessenger,
                    NameTelegram: body.NameTelegram,
                    NameTiktok: body.NameTiktok,
                    NameTwitter: body.NameTwitter,
                    NameWhatsapp: body.NameWhatsapp,
                    NameYoutube: body.NameYoutube
                }
            }).then(() => {
                resolve()
            })
        })
    },

    getuserMessages: () => {
        return new Promise(async (resolve, reject) => {
            let Message = await db.get().collection(collection.MESSAGE_COLLECTION).find().toArray();
            Message.reverse();
            resolve(Message)
        })
    },

    addUpdateFrame: (body) => {
        function calculateRatio(num_1, num_2) {

            for (num = num_2; num > 1; num--) {

                if ((num_1 % num) == 0 && (num_2 % num) == 0) {
                    num_1 = num_1 / num;
                    num_2 = num_2 / num;
                }

            }
            var ratio = {
                W: num_1,
                H: num_2
            }
            return ratio;
        }
        return new Promise((resolve, reject) => {
            let response = []

            if (body.Id == "") {
                create_random_id(10)
                function create_random_id(sting_length) {
                    var randomString = '';
                    var numbers = '123456789ABCDEFGHJKLMNOPQRSTUVWXYZ'
                    for (var i, i = 0; i < sting_length; i++) {
                        randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                    }
                    body.Id = randomString
                }
                var Imageratio = calculateRatio(body.IW, body.IH)
                body.RW = Imageratio.W
                body.RH = Imageratio.H
                body.Count = null

                db.get().collection(collection.FRAME_COLLECTION).insertOne(body).then(() => {
                    response.Success = "New frame succesfully created"
                    response.Id = body.Id
                    resolve(response)
                })


            } else {
                var Imageratio = calculateRatio(body.IW, body.IH)
                db.get().collection(collection.FRAME_COLLECTION).updateOne({ Id: body.Id }, {
                    $set: {
                        Header: body.Header,
                        IX: body.IX,
                        IY: body.IY,
                        IW: body.IW,
                        IH: body.IH,
                        NX: body.NX,
                        NY: body.NY,
                        NW: body.NW,
                        NH: body.NH,
                        RW: Imageratio.W,
                        RH: Imageratio.H
                    }
                }).then(() => {
                    response.Success = "This Frame succesfully updated"
                    response.Id = body.Id
                    resolve(response)
                })
            }
        })
    },

    hideFrame: (body) => {
       
        let response = []
        return new Promise((resolve, reject) => {
            if (body.Hide === "1") {
                db.get().collection(collection.FRAME_COLLECTION).updateOne({ Id: body.Id }, {
                    $set: {
                        Hide: ""
                    }
                }).then(() => {

                    body.Hide = ""
                    response.Hide = body.Hide
                    resolve(response)
                })
            } else {
                db.get().collection(collection.FRAME_COLLECTION).updateOne({ Id: body.Id }, {
                    $set: {
                        Hide: 1
                    }
                }).then((response) => {
                    body.Hide = "1"
                    response.Hide = body.Hide
                    resolve(response)
                })
            }
        })
    },

    deleteFrame: (body) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FRAME_COLLECTION).deleteOne({ Id: body.Id }).then((Id) => {
                resolve(Id)
            })
        })
    },

    downloadCountFrame: (body) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.FRAME_COLLECTION).findOne({ Id: body.Id }).then((result) => {
                db.get().collection(collection.FRAME_COLLECTION).updateOne({ Id: body.Id }, {
                    $set: {
                        Count: result.Count + 1
                    }
                })

            }).then(() => {
                resolve()
            })
        })
    }


















}
var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { CourierClient } = require("@trycourier/courier");
const courier = CourierClient({ authorizationToken: "pk_prod_YQ215TTT7JMSWAP6MMRP9453JW8K" });
var ObjectId = require('mongodb').ObjectId;
const { reject, resolve, all } = require('promise')
const { response } = require('express');
const DeviceDetector = require('node-device-detector');


module.exports = {


    // For admin
    authAdminLog: (body, deviceInfo) => {
        return new Promise(async (resolve, reject) => {
            let response = []
           
            let Admin = await db.get().collection(collection.AUTH_COLLECTIONS).findOne({ EmailId: body.EmailId })
            if (Admin) {
                bcrypt.compare(body.Password, Admin.Password).then(async (result) => {
                    if (result) {

                        let data = {
                            DeviceId: null,
                            EmailId: body.EmailId,
                            os: deviceInfo.os,
                            client: deviceInfo.client,
                            device: deviceInfo.device,
                            Online: null,
                            Status: null
                        }
                        create_random_id(16)
                        function create_random_id(sting_length) {
                            var randomString = '';
                            var numbers = '1234567890'
                            for (var i, i = 0; i < sting_length; i++) {
                                randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                            }
                            data.DeviceId = randomString
                        }
                        await db.get().collection(collection.ADMIN_LOG_COLLECTION).insertOne(data).then(() => {
                            response.adminDetails = Admin
                            response.adminDetails.deviceId = data.DeviceId
                            response.success = true
                            resolve(response)
                        })
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
                            brand_id: "QWERTYUIOP01",
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
                        NS: body.NS,
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
    },

    addUpdateVisit: () => {
        return new Promise(async (resolve, reject) => {

            let NowCount = 0
            var Time = new Date();
            let NowDate = Time.getDate() + "," + (Time.getMonth() + 1) + "," + Time.getFullYear()
            let Now = await db.get().collection(collection.COUNT_COLLECTION).findOne({ Name: "Visit Count", NowDate })
            
            if (Now) {
                NowCount = Now.Count
                db.get().collection(collection.COUNT_COLLECTION).updateOne({ Name: "Visit Count", NowDate }, {
                    $set: {
                        Count: NowCount + 1
                    }
                }).then(() => {
                    
                        resolve()
                    
                })
            } else {
                db.get().collection(collection.COUNT_COLLECTION).insertOne({ Name: "Visit Count", NowDate, Count: 1, Time }).then(() => {
                  
                        resolve()
                   
                })

            }
        })
    },

    // Home

    getTop4Frame: () => {
        return new Promise(async (resolve, reject) => {
            let Sort = await db.get().collection(collection.FRAME_COLLECTION).find().sort({ Count: -1 }).limit(4).toArray()
            let Array = []
            for (let i = 0; i < Sort.length; i++) {
                let obj = {
                    Id: Sort[i].Id,
                    Header: Sort[i].Header,
                    Count: Sort[i].Count
                }
                Array.push(obj)
            }
            resolve(Array);
        })
    },

    getMessageCount: () => {
        return new Promise(async (resolve, reject) => {
            let Messages = await db.get().collection(collection.MESSAGE_COLLECTION).find().toArray()
            Messages = Messages.length
            // 0 - 1000
            if (Messages < 1000) {
                resolve(Messages)
                // 1K - 9.9K
            } else if (Messages < 10000) {
                const firstNum = String(Messages)[0];
                const SecondNum = String(Messages)[1];
                if (SecondNum == "0") {
                    resolve(firstNum + "K")
                } else {
                    resolve(firstNum + "." + SecondNum + "K")
                }
                // 10K - 99.9K
            } else if (Messages < 100000) {
                const firstNum = String(Messages).slice(0, 2);
                const SecondNum = String(Messages)[2];
               
                if (SecondNum == "0") {
                    resolve(firstNum + "K")
                } else {
                    resolve(firstNum + "." + SecondNum + "K")
                }
                // 100K - 999.9K
            } else if (Messages < 1000000) {
                const firstNum = String(Messages).slice(0, 3);
                const SecondNum = String(Messages)[3];
                
                if (SecondNum == "0") {
                    resolve(firstNum + "K")
                } else {
                    resolve(firstNum + "." + SecondNum + "K")
                }
                // 1M - 9.9M
            } else if (Messages < 10000000) {
                const firstNum = String(Messages)[0];
                const SecondNum = String(Messages)[1];
               
                if (SecondNum == "0") {
                    resolve(firstNum + "M")
                } else {
                    resolve(firstNum + "." + SecondNum + "M")
                }
            } else {
                resolve("10M")
            }

        })
    },

    getVisiterCount: () => {
        return new Promise(async (resolve, reject) => {
            let allSubscriber = await db.get().collection(collection.COUNT_COLLECTION).find({ Name: "Visit Count" }).toArray();
            let TotalCount = 0
            let MillionView = 0
            let TodayCount = 0
            let MonthCount = 0
            let YearCount = 0
            let WeekCount = 0
            let date = new Date();
            let NowDate = date.getDate() + "," + (date.getMonth() + 1) + "," + date.getFullYear()

            for (let i = 0; i < allSubscriber.length; i++) {
                TotalCount = TotalCount + allSubscriber[i].Count
                // Today 
                if (NowDate == allSubscriber[i].NowDate) {
                    TodayCount = TodayCount + allSubscriber[i].Count
                }
                // Week
                var days = 7; // 7 Day
                var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
        
                if (last < allSubscriber[i].Time) {
                    WeekCount = WeekCount + allSubscriber[i].Count
                }
                // Month 
                if (date.getMonth() == allSubscriber[i].Time.getMonth() && date.getFullYear() == allSubscriber[i].Time.getFullYear()) {
                    MonthCount = MonthCount + allSubscriber[i].Count
                }
                // Year
                if (date.getFullYear() == allSubscriber[i].Time.getFullYear()) {
                    YearCount = YearCount + allSubscriber[i].Count
                }
            }

            // 0 - 1000
            if (TotalCount < 1000) {
                MillionView = TotalCount
                // 1K - 9.9K
            } else if (TotalCount < 10000) {
                const firstNum = String(TotalCount)[0];
                const SecondNum = String(TotalCount)[1];
                if (SecondNum == "0") {
                    MillionView = firstNum + "K"

                } else {
                    MillionView = firstNum + "." + SecondNum + "K"

                }
                // 10K - 99.9K
            } else if (TotalCount < 100000) {
                const firstNum = String(TotalCount).slice(0, 2);
                const SecondNum = String(TotalCount)[2];
         
                if (SecondNum == "0") {
                    MillionView = firstNum + "K"
                } else {
                    MillionView = firstNum + "." + SecondNum + "K"
                }
                // 100K - 999.9K
            } else if (TotalCount < 1000000) {
                const firstNum = String(TotalCount).slice(0, 3);
                const SecondNum = String(TotalCount)[3];
               
                if (SecondNum == "0") {
                    MillionView = firstNum + "K"
                } else {
                    MillionView = firstNum + "." + SecondNum + "K"
                }
                // 1M - 9.9M
            } else if (TotalCount < 10000000) {
                const firstNum = String(TotalCount)[0];
                const SecondNum = String(TotalCount)[1];
              
                if (SecondNum == "0") {
                    MillionView = firstNum + "M"
                } else {
                    MillionView = firstNum + "." + SecondNum + "M"
                }
            } else {
                MillionView = "10M"
            }
            let Obj = {
                TotalCount: TotalCount,
                MillionView: MillionView,
                TodayCount: TodayCount,
                MonthCount: MonthCount,
                YearCount: YearCount,
                WeekCount: WeekCount,
            }
            resolve(Obj)
        })
    },

    getSubscriberCount: () => {
        return new Promise(async (resolve, reject) => {
            let allSubscriber = await db.get().collection(collection.SUBSCRIBE_COLLECTION).find().toArray();
            let TotalCount = 0
            let MillionView = 0
            let TodayCount = 0
            let MonthCount = 0
            let YearCount = 0
            let WeekCount = 0
            let date = new Date();
            let NowDate = date.getDate() + "," + (date.getMonth() + 1) + "," + date.getFullYear()

            TotalCount = allSubscriber.length

            for (let i = 0; i < allSubscriber.length; i++) {
                // Today 
                if (date.getDate() == allSubscriber[i].Time.getDate() && date.getMonth() == allSubscriber[i].Time.getMonth() && date.getFullYear() == allSubscriber[i].Time.getFullYear()) {
                    TodayCount = TodayCount + 1
                }
                // Week
                var days = 7; // 7 Day
                var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
          
                if (last < allSubscriber[i].Time) {
                    WeekCount = WeekCount + 1
                }
                // Month 
                if (date.getMonth() == allSubscriber[i].Time.getMonth() && date.getFullYear() == allSubscriber[i].Time.getFullYear()) {
                    MonthCount = MonthCount + 1
                }
                // Year
                if (date.getFullYear() == allSubscriber[i].Time.getFullYear()) {
                    YearCount = YearCount + 1
                }
            }

            // 0 - 1000
            if (TotalCount < 1000) {
                MillionView = TotalCount
                // 1K - 9.9K
            } else if (TotalCount < 10000) {
                const firstNum = String(TotalCount)[0];
                const SecondNum = String(TotalCount)[1];
                if (SecondNum == "0") {
                    MillionView = firstNum + "K"

                } else {
                    MillionView = firstNum + "." + SecondNum + "K"

                }
                // 10K - 99.9K
            } else if (TotalCount < 100000) {
                const firstNum = String(TotalCount).slice(0, 2);
                const SecondNum = String(TotalCount)[2];
           
                if (SecondNum == "0") {
                    MillionView = firstNum + "K"
                } else {
                    MillionView = firstNum + "." + SecondNum + "K"
                }
                // 100K - 999.9K
            } else if (TotalCount < 1000000) {
                const firstNum = String(TotalCount).slice(0, 3);
                const SecondNum = String(TotalCount)[3];
             
                if (SecondNum == "0") {
                    MillionView = firstNum + "K"
                } else {
                    MillionView = firstNum + "." + SecondNum + "K"
                }
                // 1M - 9.9M
            } else if (TotalCount < 10000000) {
                const firstNum = String(TotalCount)[0];
                const SecondNum = String(TotalCount)[1];
              
                if (SecondNum == "0") {
                    MillionView = firstNum + "M"
                } else {
                    MillionView = firstNum + "." + SecondNum + "M"
                }
            } else {
                MillionView = "10M"
            }
            let Obj = {
                TotalCount: TotalCount,
                MillionView: MillionView,
                TodayCount: TodayCount,
                MonthCount: MonthCount,
                YearCount: YearCount,
                WeekCount: WeekCount,
            }
            resolve(Obj)
        })
    },

    adminLastLogin: (Id) => {
        return new Promise((resolve, reject) => {
            let time = new Date();
            db.get().collection(collection.ADMIN_LOG_COLLECTION).updateOne({ DeviceId: Id }, {
                $set: {
                    Online: time
                }
            }).then(() => {
                resolve()
            })
        })
    },

    getAllAdminLogs: (deviceId) => {
        return new Promise(async (resolve, reject) => {
            let all = await db.get().collection(collection.ADMIN_LOG_COLLECTION).find().toArray()
            for (let i = 0; i < all.length; i++) {
                all[i].Online = all[i].Online.toLocaleString('en-US', { timeZone: "Asia/Kolkata" });
                if (all[i].DeviceId == deviceId) {
                    all[i].ThisDevice = true
                }
                switch (all[i].device.type) {
                    case "smartphone":
                        all[i].SmartPhone = true
                        break;
                    case "tv":
                        all[i].Tv = true
                        break;
                    case "tablet":
                        all[i].Tablet = true
                        break;
                    case "desktop":
                        all[i].Desktop = true
                        break;
                    default:
                        all[i].OtherDevice = true
                        break;
                }
            }
            resolve(all.reverse())
        })
    },

    TerminateAdmin: (body) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ADMIN_LOG_COLLECTION).deleteOne({ DeviceId: body.Id }).then((response) => {
                resolve(response)
            })
        })
    },

    checkActiveAdmin: (deviceId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ADMIN_LOG_COLLECTION).findOne({ DeviceId: deviceId }).then((response) => {
                resolve(response)
            })
        })
    },

    getAllSubscribers: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.SUBSCRIBE_COLLECTION).find().toArray().then((result) => {
                resolve(result)
            })
        })
    },
    getAdminLogCount:()=>{
        return new Promise(async(resolve, reject) => { 
            let admin = await db.get().collection(collection.ADMIN_LOG_COLLECTION).find().toArray()
            let count = admin.length
            resolve(count)
         })
    }

   


















}
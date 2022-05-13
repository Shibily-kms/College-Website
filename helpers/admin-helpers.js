var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var ObjectId = require('mongodb').ObjectId;
const { reject, resolve, all } = require('promise')
const { response } = require('express')

module.exports = {


    // For admin
    authAdminLog: (body) => {
        return new Promise((resolve, reject) => {
            let response = []
            let proAdminAuth = {
                EmailId: "admin@nsaonline.in",
                Password: "$2b$10$Uf7AtQ19KCRcfbDgAu3p5OBQEGrPiwSxCgtTNYQV0P/AzADiXV9TG"
            }

            if (body.EmailId == proAdminAuth.EmailId) {
                bcrypt.compare(body.Password, proAdminAuth.Password).then((result) => {
                    if (result) {
                        response.adminDetails = proAdminAuth,
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
                    "Btn1.Name" : body.B1Name,
                    "Btn1.Link" : body.B1Link,
                    "Btn1.New" : body.B1New,
                    "Btn2.Name" : body.B2Name,
                    "Btn2.Link" : body.B2Link,
                    "Btn2.New" : body.B2New
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
            if(body.Mobile){
                body.Mobile =  parseInt(body.Mobile)
            }
            body.Index =  parseInt(body.Index)
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
                    response.Success= "New Profile Successfully Created"
                    resolve(response)
                })
            }else{
                db.get().collection(collection.PROFILE_COLLECTON).updateOne({Id:body.Id},{
                    $set:{
                        Index : body.Index,
                        FullName : body.FullName,
                        Address : body.Address,
                        Position : body.Position,
                        Mobile : body.Mobile,
                    }
                }).then(()=>{
                    response.Id = body.Id
                    response.Success= "This Profile Successfully Updated"
                    resolve(response)
                })
            }
        })
    },
    
    deleteProfile:(body)=>{
        return new Promise((resolve, reject) => { 
            db.get().collection(collection.PROFILE_COLLECTON).deleteOne({Id:body.Id}).then((Id)=>{
                resolve(Id)
            })
         })
    },

    updateLinks:(body,Type)=>{
        return new Promise((resolve, reject) => { 
            db.get().collection(collection.LINK_COLLECTION).updateOne({Type},{
                $set:{
                    Discord : body.Discord,
                    Email : body.Email,
                    Facebook : body.Facebook,
                    Github : body.Github,
                    Website : body.Website,
                    Instagram : body.Instagram,
                    Linkedin : body.Linkedin,
                    Messenger : body.Messenger,
                    Mobile : body.Mobile,
                    Signal : body.Signal,
                    Telegram : body.Telegram,
                    Tiktok : body.Tiktok,
                    Twitter : body.Twitter,
                    Whatsapp : body.Whatsapp,
                    Youtube : body.Youtube
                }
            }).then(()=>{
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
                    response.Success= "New news Successfully Created"
                    resolve(response)
                })
            }else{
                db.get().collection(collection.NEWS_COLLECTION).updateOne({Id:body.Id},{
                    $set:{
                        Header : body.Header,
                        Content : body.Content,
                        
                    }
                }).then(()=>{
                    response.Id = body.Id
                    response.Success= "This news Successfully Updated"
                    resolve(response)
                })
            }
        })
    },

    deleteNews:(body)=>{
        return new Promise((resolve, reject) => { 
            db.get().collection(collection.NEWS_COLLECTION).deleteOne({Id:body.Id}).then((Id)=>{
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
                    response.Success= "New Image Successfully added to Gallery"
                    resolve(response)
                })
            }else{
                db.get().collection(collection.GALLERY_COLLECTION).updateOne({Id:body.Id},{
                    $set:{
                        Title : body.Title,
                        Description : body.Description
                    }
                }).then(()=>{
                    response.Id = body.Id
                    response.Success= "This Image Successfully Updated"
                    resolve(response)
                })
            }
        })
    },

    deleteGalleryImage:(body)=>{
        return new Promise((resolve, reject) => { 
            db.get().collection(collection.GALLERY_COLLECTION).deleteOne({Id:body.Id}).then((Id)=>{
                resolve(Id)
            })
         })
    },
    
    














}
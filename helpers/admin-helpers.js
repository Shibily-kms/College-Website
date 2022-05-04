var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var ObjectId = require('mongodb').ObjectId;
const { reject, resolve, all } = require('promise')
const { response } = require('express')

module.exports = {


    // For admin
    authAdminLog:(body)=>{
        return new Promise((resolve, reject) => {
            let response = [] 
            let proAdminAuth = {
                EmailId : "admin@nsaonline.in",
                Password : "$2b$10$Uf7AtQ19KCRcfbDgAu3p5OBQEGrPiwSxCgtTNYQV0P/AzADiXV9TG"
            }

            if(body.EmailId == proAdminAuth.EmailId){
                bcrypt.compare(body.Password,proAdminAuth.Password).then((result)=>{
                    if(result){
                        response.adminDetails = proAdminAuth,
                        response.success = true
                        resolve(response)
                    }else{
                        resolve({PasswordError:true})
                    }
                })
            }else{
                resolve({EmailError:true})
            }
         })
    },

    // First page
    editSlider:(body)=>{
       
        return new Promise((resolve, reject) => { 
            db.get().collection(collection.FIRST_PAGE_COLLECTION).updateOne({Name : "Slide", "Slids.Id":body.id},{
                $set:{
                    "Slids.$.Header" : body.header,
                    "Slids.$.Content" : body.content
                }
            }).then((response)=>{
                resolve()
            })
         })
    },

    editFirstPagePeragraph:(body,type)=>{
        return new Promise((resolve, reject) => { 
            db.get().collection(collection.FIRST_PAGE_COLLECTION).updateOne({Name : type},{
                $set:{
                    Header : body.Header,
                    Para1 : body.Para1,
                    Para2 : body.Para2,
                    Para3 : body.Para3,
                    Para4 : body.Para4,
                    Para5 : body.Para5
                  
                }
            }).then(()=>{
                resolve()
            })
         })
    },

    editFirstLinks:(body,type)=>{
        return new Promise((resolve, reject) => { 
            db.get().collection(collection.FIRST_PAGE_COLLECTION).updateOne({Name : type},{
                $set:{
                    Cic : body.cic,
                    College : body.college,
                    Wsf : body.wsf
                }
            }).then(()=>{
                resolve()
            })
         })
    }

    
}
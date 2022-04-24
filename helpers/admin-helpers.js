var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var ObjectId = require('mongodb').ObjectId;
const { reject, resolve, all } = require('promise')
const { response } = require('express')

module.exports = {

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
    }
    
}
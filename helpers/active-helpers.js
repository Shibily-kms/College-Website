var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var ObjectId = require('mongodb').ObjectId;
const { reject, resolve, all } = require('promise')
const { response } = require('express')

module.exports = {
    activateSite:()=>{

        return new Promise(async(resolve, reject) => { 
            var Success = true
            // First page
            let slider ={
                Name : "Slide",
                Slids : [
                    {Id : "SLID01"},
                    {Id : "SLID02"},
                    {Id : "SLID03"},
                    {Id : "SLID04"},
                    {Id : "SLID05"}
                ]
            }
            let TheNsa = {
                Name : "The Nsa",
                Id : "PRGPH01"
            }
            let TheMajma = {
                Name : "The Majma",
                Id : "PRGPH02"
            }
            let Pre = {
                Name : "Pre",
                Id : "PRGPH03"
            }
            let Ug = {
                Name : "Ug",
                Id : "PRGPH04"
            }
            let Pg = {
                Name : "Pg",
                Id : "PRGPH05"
            }
            let FLinks ={
                Name : "Links"
            }

          // await db.get().collection(collection.FIRST_PAGE_COLLECTION).insertMany([slider,TheNsa,TheMajma,FLinks])
          // await db.get().collection(collection.PARAGRAPH_COLLECTION).insertMany([TheNsa,TheMajma, Pre,Ug,Pg])

           resolve(Success)
         })
    },

   

    
}
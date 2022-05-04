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
                console.log(slide.Slids);
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

    getTheNsa:()=>{
        return new Promise((resolve, reject) => { 
            db.get().collection(collection.FIRST_PAGE_COLLECTION).findOne({Name : "The Nsa"}).then((nsa)=>{
                resolve(nsa)
            })
         })
    },
    getTheMajma:()=>{
        return new Promise((resolve, reject) => { 
            db.get().collection(collection.FIRST_PAGE_COLLECTION).findOne({Name : "The Majma"}).then((majma)=>{
                resolve(majma)
            })
         })
    },
    getFLinks:()=>{
        return new Promise((resolve, reject) => { 
            db.get().collection(collection.FIRST_PAGE_COLLECTION).findOne({Name : "Links"}).then((links)=>{
                resolve(links)
            })
         })
    }


}
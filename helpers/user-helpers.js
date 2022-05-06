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
    },

    getAllTeachers:()=>{
        return new Promise(async(resolve, reject) => { 
            let firstTwo = []
            let teachers = await db.get().collection(collection.PROFILE_COLLECTON).find({Type:"Teacher"}).toArray()
            teachers.sort((a,b) => {
                return a.Index - b.Index;
            })
          
            if(teachers[1]){
                for(let i=0; i < 2 ; i++ ){
                    firstTwo.push(teachers[i])
                }
                teachers.splice(0,2)
            }
             let data = {
                 firstTwo,
                 teachers
             }
             resolve(data)
         })
    },

    getAllLeaders:()=>{
        return new Promise(async(resolve, reject) => { 
           
            let leaders = await db.get().collection(collection.PROFILE_COLLECTON).find({Type:"Leader"}).toArray()
            leaders.sort((a,b) => {
                return a.Index - b.Index;
            })
            
             resolve(leaders)
         })
    },


}
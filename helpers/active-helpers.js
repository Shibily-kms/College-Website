var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var ObjectId = require('mongodb').ObjectId;
const { reject, resolve, all } = require('promise')
const { response } = require('express')

module.exports = {
    activateSite: () => {

        return new Promise(async (resolve, reject) => {
            var Success = true
            // First page
            let slider = {
                Name: "Slide",
                Slids: [
                    { Id: "SLID01" },
                    { Id: "SLID02" },
                    { Id: "SLID03" },
                    { Id: "SLID04" },
                    { Id: "SLID05" }
                ]
            }
            let TheNsa = {
                Name: "The Nsa",
                Id: "PRGPH01"
            }
            let TheMajma = {
                Name: "The Majma",
                Id: "PRGPH02"
            }
            // College
            let Pre = {
                Name: "Pre",
                Id: "PRGPH03"
            }
            let Ug = {
                Name: "Ug",
                Id: "PRGPH04"
            }
            let Pg = {
                Name: "Pg",
                Id: "PRGPH05"
            }
            let FLinks = {
                Name: "Links"
            }

            // Union

            let Nsa = {
                Name: "Nsa",
                Id : "PRGPH06",
                Btn1: { Id: "BTN01" },
                Btn2: { Id: "BTN02" }


            }
            let Fine = {
                Name: "Fine",
                Id : "PRGPH07",
                Btn1: { Id: "BTN01" },
                Btn2: { Id: "BTN02" }
            }
            let Library = {
                Name: "Library",
                Id : "PRGPH08",
                Btn1: { Id: "BTN01" },
                Btn2: { Id: "BTN02" }
            }
            let Literary = {
                Name: "Literary",
                Id : "PRGPH09",
                Btn1: { Id: "BTN01" },
                Btn2: { Id: "BTN02" }
            }
            let Sab = {
                Name: "Sab",
                Id : "PRGPH10",
                Btn1: { Id: "BTN01" },
                Btn2: { Id: "BTN02" }
            }
            let Medical = {
                Name: "Medical",
                Id : "PRGPH11",
                Btn1: { Id: "BTN01" },
                Btn2: { Id: "BTN02" }
            }
            let It = {
                Name: "It",
                Id : "PRGPH12",
                Btn1: { Id: "BTN01" },
                Btn2: { Id: "BTN02" }
            }
            let Research = {
                Name: "Research",
                Id : "PRGPH13",
                Btn1: { Id: "BTN01" },
                Btn2: { Id: "BTN02" }
            }
            let Garden = {
                Name: "Garden",
                Id : "PRGPH14",
                Btn1: { Id: "BTN01" },
                Btn2: { Id: "BTN02" }
            }
            let NsaLinks ={
                Type : "Nsa",
                Discord : "",
                Email : "",
                Facebook : "",
                Github : "",
                Website : "",
                Instagram : "",
                Linkedin : "",
                Messenger : "",
                Mobile : "",
                Signal : "",
                Telegram : "",
                Tiktok : "",
                Twitter : "",
                Whatsapp : "",
                Youtube : "",
                NameDiscord : "",
                NameFacebook : "",
                NameGithub : "",
                NameWebsite : "",
                NameInstagram : "",
                NameLinkedin : "",
                NameMessenger : "",
                NameTelegram : "",
                NameTiktok : "",
                NameTwitter : "",
                NameYoutube : ""
            }
            let Skssf = {
                Name: "Skssf",
                Id : "PRGPH15",
                Btn1: { Id: "BTN01" },
                Btn2: { Id: "BTN02" }
            }
            let Fund = {
                Name: "Fund",
                Id : "PRGPH16",
                Btn1: { Id: "BTN01" },
                Btn2: { Id: "BTN02" }
            }
            let Store = {
                Name: "Store",
                Id : "PRGPH17",
                Btn1: { Id: "BTN01" },
                Btn2: { Id: "BTN02" }
            }
            let SkssfLinks ={
                Type : "Skssf",
                Discord : "",
                Email : "",
                Facebook : "",
                Github : "",
                Website : "",
                Instagram : "",
                Linkedin : "",
                Messenger : "",
                Mobile : "",
                Signal : "",
                Telegram : "",
                Tiktok : "",
                Twitter : "",
                Whatsapp : "",
                Youtube : ""
            }

            await db.get().collection(collection.FIRST_PAGE_COLLECTION).insertMany([slider,TheNsa,TheMajma,FLinks])
            await db.get().collection(collection.PARAGRAPH_COLLECTION).insertMany([TheNsa,TheMajma, Pre,Ug,Pg])
             await db.get().collection(collection.PARAGRAPH_COLLECTION).insertMany([Nsa, Fine, Library, Literary, Sab, Medical, It, Research, Garden])
             await db.get().collection(collection.PARAGRAPH_COLLECTION).insertMany([Skssf, Fund, Store])
            await db.get().collection(collection.LINK_COLLECTION).insertMany([NsaLinks])
            await db.get().collection(collection.LINK_COLLECTION).insertMany([SkssfLinks])

            resolve(Success)
        })
    },




}
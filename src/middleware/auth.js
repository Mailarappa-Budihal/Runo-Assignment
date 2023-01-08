const userModel = require("../Models/UserModel");
// const adminModel = require("../Models/AdminModel")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const validator = require('../validations/validation')
const ObjectId = mongoose.Types.ObjectId


//----------------------------AUTHENTICATION--------------------------------------//
const authentication = function(req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });


        jwt.verify(token, "Rono-Assignment", function(err, decodedToken) {
            if (err) {
                let message =
                    err.message === "jwt expired" ? "Token is expired" : "Token is invalid";
                return res.status(401).send({ status: false, msg: message })
            }

            req.decodedToken = decodedToken //setting an attribute in req so that we can access it everywhere

            //console.log(decodedToken)
            next()
        });


    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}


const authentication2 = function(req, res, next) {
        try {
            let token = req.headers["x-api-key"];
            if (!token) return res.status(400).send({ status: false, msg: "token must be present" });


            jwt.verify(token, "Rono-Assignment-2", function(err, decodedToken) {
                if (err) {
                    let message =
                        err.message === "jwt expired" ? "Token is expired" : "Token is invalid";
                    return res.status(401).send({ status: false, msg: message })
                }

                req.decodedToken = decodedToken //setting an attribute in req so that we can access it everywhere

                //console.log(decodedToken)
                next()
            });


        } catch (err) {
            return res.status(500).send({ status: false, msg: err.message });
        }
    }
    //-----------------------------AUTHORISATION-------------------------------------------//
const authorisation = async function(req, res, next) {
    try {
        //check authorization when data is coming from request body
        let userLoggedIn = req.decodedToken.userId
        if (req.params.userId) { //check authorization when id is coming from path params

            let bId = req.params.userId;

            if (!ObjectId.isValid(bId)) return res.status(400).send({ status: false, msg: "Please enter valid Book Id,it should be of 24 digits" })

            let checkBook = await userId.findById(bId)
            if (!checkBook) return res.status(404).send({ status: false, msg: "No book present with this book Id " })


            let userToBeModified = checkBook.userId.toString();

            //console.log(userToBeModified)

            if (userToBeModified !== userLoggedIn) return res.status(403).send({ status: false, msg: 'User not authorized to perform this action' })

            if (checkBook.isDeleted == true) return res.status(400).send({ status: false, msg: "Book with the given id is already deleted!!" })

            return next()
        }
        next()
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}
module.exports = { authentication, authorisation, authentication2 }
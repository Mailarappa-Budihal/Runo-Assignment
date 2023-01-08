const mongoose = require("mongoose")
    //==================================validation of isValid=====================================================
function isValid(value) {
    if (typeof value === "undefined" || typeof value === null) return false;
    if (typeof value === "string" && value.trim().length == 0) return false;
    return true
};

//==================================validation of isValidPassword=====================================================
let isValidPassword = function(password) {
    let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return passwordRegex.test(password)
}

//==================================validation of isValidRequestBody===========================================//
const isValidBody = function(requestBody) {
    return Object.keys(requestBody).length > 0;
};
//==================================validation of isValidObjectId=============================================//
const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const isValidPhone = (PhoneNumber) => {
    let phoneRex = /^[6789][0-9]{9}$/
    return phoneRex.test(PhoneNumber)

}
const isValidAdhar = (AdharNo) => {
    let adharRegex = /^(\d{10}|\d{12})$/
    return adharRegex.test(AdharNo)
}

const isValidAge = (Age) => {
    let Ageregex = /^[1-9]\d*(\.\d+)?$/
    return Ageregex.test(Age)

}
const isValidPincode = (Pincode) => {
    let Pincoderegex = /^[1-9][0-9]{5}$/
    return Pincoderegex.test(Pincode)
}
const isValidEnum = function(value) {
        if (typeof value === 'undefined' || value === null) { return false }
        if (typeof value === 'string' && value.trim().length == 0) { return false }
        return ["non", "firstDoseCompleted", "Allcompleted"].indexOf(value) !== -1
    }
    //====================================Module Export=============================================================
module.exports = { isValid, isValidPassword, isValidBody, isValidObjectId, isValidPhone, isValidAdhar, isValidAge, isValidPincode, isValidEnum }
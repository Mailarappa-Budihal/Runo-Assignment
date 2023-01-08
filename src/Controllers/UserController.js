const userModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const validator = require("../validations/validation");
const jwt = require("jsonwebtoken");
const moment = require("moment")
const axios = require("axios");


const createUser = async(req, res) => {
    try {
        //fetching data present in request body

        const requestBody = req.body;

        if (!validator.isValidBody(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "please provide data in the body" });
        }
        //Destructuring requestBody
        let { Name, PhoneNumber, Age, Pincode, AdharNo, password } = requestBody;
        //--------------------------------Validation starts-------------------------------
        //fname
        if (!validator.isValid(Name))
            return res
                .status(400)
                .send({ status: false, message: `Name  is Manditory` });
        if (!Name.trim().match(/^[a-zA-Z]{2,20}$/))
            return res
                .status(400)
                .send({ status: false, message: `Name should only contain alphabet` });

        //phone
        if (!validator.isValid(PhoneNumber))
            return res
                .status(400)
                .send({ status: false, message: "PhoneNumber  is required" });
        if (PhoneNumber.length < 10)
            return res
                .status(400)
                .send({
                    status: false,
                    message: `${PhoneNumber} is not valid phone number length`,
                });
        if (!validator.isValidPhone(PhoneNumber))
            return res
                .status(400)
                .send({
                    status: false,
                    message: `Please fill Indian phone number with 1st no only(6,7,8,9)`,
                });
        const isPhoneAlreadyUsed = await userModel.findOne({ PhoneNumber });
        if (isPhoneAlreadyUsed)
            return res
                .status(409)
                .send({
                    status: false,
                    message: `${PhoneNumber} phone number is already registered`,
                });

        if (!validator.isValid(Age))
            return res
                .status(400)
                .send({ status: false, message: "Age  is required" });

        if (!validator.isValidAge(Age))
            return res
                .status(400)
                .send({ status: false, message: "Age  must  be Number" });

        if (!validator.isValid(Pincode))
            return res
                .status(400)
                .send({ status: false, message: "Pincode  is required" });
        if (!validator.isValidPincode(Pincode))
            return res
                .status(400)
                .send({ status: false, message: "Pincode   is required" });

        if (!validator.isValid(AdharNo))
            return res
                .status(400)
                .send({ status: false, message: "Adhar No is required" });

        if (!validator.isValidAdhar(AdharNo))
            return res
                .status(400)
                .send({ status: false, message: "AdharNo should be valid " });
        const AdharUsed = await userModel.findOne({ AdharNo })
        if (AdharUsed)
            return res
                .status(409)
                .send({
                    status: false,
                    message: `${AdharNo} Adhar number is already registered`,
                });

        //password
        if (!validator.isValid(password)) return res.status(400).send({ status: false, message: `Password is required` })
        if (!validator.isValidPassword(password)) return res.status(400).send({ status: false, message: `Password must between 8-15 and contain a Capital,Symbol,Numeric` })
            // ---------------------------------Validation ends-------------------------------
            //generating salt
        const salt = await bcrypt.genSalt(10);
        //hashing
        const hashedPassword = await bcrypt.hash(password, salt);
        //response structure
        const userData = {
            Name: Name,
            PhoneNumber: PhoneNumber,
            password: hashedPassword,
            Age: Age,
            Pincode: Pincode,
            AdharNo: AdharNo,
        };
        let newUser = await userModel.create(userData);
        newUser = newUser.toObject();
        delete newUser.password;
        return res
            .status(201)
            .send({
                status: true,
                message: ` User created successfully`,
                data: newUser,
            });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

//===================================================loginUser===============================================//
const loginUser = async function(req, res) {
    try {
        const loginData = req.body
        const { PhoneNumber, password } = loginData

        //validation
        if (!validator.isValidBody(loginData)) return res.status(400).send({ status: false, message: "Please provide login credentials" })

        if (!validator.isValid(PhoneNumber)) return res.status(400).send({ status: false, message: " PhoneNumber is mandatory" })
        if (!validator.isValidPhone(PhoneNumber)) return res.status(400).send({ status: false, message: "Please provide valid PhoneNumber" })

        if (!validator.isValid(password)) return res.status(400).send({ status: false, message: " password is mandatory" })
        if (!validator.isValidPassword(password)) return res.status(400).send({ status: false, message: "Please provide valid password" })

        let user = await userModel.findOne({ PhoneNumber: PhoneNumber });
        if (!user) {
            return res.status(404).send({ status: false, message: "PhoneNumber is not found" });
        }
        //comparing hard-coded password to the hashed password
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(400).send({ status: false, message: "Invalid Credentials" })
        }
        //token credentials
        const token = jwt.sign({
                userId: user._id.toString(),
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
            },
            "Rono-Assignment" // => secret key
        );
        return res.status(200).send({ status: true, message: "User login successfully", data: { userId: user._id, token: token } })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//===================================get Available Slots======================================//

let getByPin = async function(req, res) {
    try {
        let pin = req.query.pincode
        let date = req.query.date
        console.log(`query params are: ${pin} ${date}`)
        var options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pin}&date=${date}`
        }
        let result = await axios(options)
        console.log(result.data)
        res.status(200).send({ msg: result.data })
    } catch (err) {
        // console.log(err)
        res.status(500).send({ msg: err.message })
    }
}



//===============================vaccineRegister==========================================//
const vaccineRegister = async(req, res) => {
    try {
        //fetching data present in request body
        const userId = req.params.userId
        const requestBody = req.body;

        if (!validator.isValidBody(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "please provide data in the body" });
        }

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "You entered a Invalid userId in params" })
        const User = await userModel.findById({ _id: userId })
        if (!User) return res.status(404).send({ status: false, message: "user not found" })
            //Destructuring requestBody
        let { firstDose, SecondDose, VaccineStatus } = requestBody;
        //--------------------------------Validation starts-------------------------------
        //fname


        firstDose = JSON.parse(firstDose)
        if (firstDose) {
            if (typeof firstDose != "object") return res.status(400).send({ status: false, message: "Please provide firstdose in Object" })
            if (firstDose) {
                if (firstDose.date) {
                    if (!validator.isValid(firstDose.Date)) return res.status(400).send({ status: false, Message: "first Dose Date is required" })
                    var date = moment(Date, "YYYY-MM-DD", true).isValid();
                    if (!date)
                        return res.status(400).send({
                            status: false,
                            msg: "format of date is wrong,correct fromat is YYYY-MM-DD",
                        });
                    User.firstDose["date"] = firstDose.date
                }
                if (firstDose.Time) {
                    if (!validator.isValid(firstDose.Time)) return res.status(400).send({ status: false, Message: "firstDose time is required" })
                    User.firstDose["Time"] = firstDose.Time
                }

            } else {
                return res.status(400).send({ status: false, message: "please provide firstDose Deatails" })
            }
        }


        SecondDose = JSON.parse(SecondDose)
        if (SecondDose) {
            if (typeof SecondDose != "object") return res.status(400).send({ status: false, message: "Please provide firstdose in Object" })
            if (SecondDose) {
                if (SecondDose.Date) {
                    if (!validator.isValid(SecondDose.Date)) return res.status(400).send({ status: false, Message: "second Dose Date is required" })
                    var date = moment(Date, "YYYY-MM-DD", true).isValid();
                    if (!date)
                        return res.status(400).send({
                            status: false,
                            msg: "format of date is wrong,correct fromat is YYYY-MM-DD",
                        });
                    User.SecondDose["date"] = SecondDose.date
                }
                if (SecondDose.Time) {
                    if (!validator.isValid(SecondDose.Time)) return res.status(400).send({ status: false, Message: "secondDose time is required" })
                    User.firstDose["Time"] = firstDose.Time
                }
            } else {
                return res.status(400).send({ status: false, message: "please provide sedcond Deatails" })
            }

            if (VaccineStatus) {
                if (!validator.isValidEnum(VaccineStatus)) return res.status(400).send({ status: false, msg: "Please enter a valid title,available titles are ['non','firstDose','Allcompleted]" })
                User.VaccineStatus = VaccineStatus
            }
            const UpdateUser1 = await User.save()
            const strUserUpdate = JSON.stringify(UpdateUser1)
            const ObjectUserUpdate = JSON.parse(strUserUpdate)
            return res
                .status(201)
                .send({
                    status: true,
                    message: ` Vaccine registered successfully`,
                    data: ObjectUserUpdate,
                });

        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

//============================update vaccine slot===================================//
let getByPin = async function(req, res) {
    try {
        let pin = req.query.pincode
        let date = req.query.date
        console.log(`query params are: ${pin} ${date}`)
        var options = {
            method: "get",
            url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${pin}&date=${date}`
        }
        let result = await axios(options)
        console.log(result.data)
        res.status(200).send({ msg: result.data })
    } catch (err) {
        // console.log(err)
        res.status(500).send({ msg: err.message })
    }
}



//===============================vaccineRegister==========================================//
const updateVaccine = async(req, res) => {
    try {
        //fetching data present in request body
        const userId = req.params.userId
        const requestBody = req.body;

        if (!validator.isValidBody(requestBody)) {
            return res
                .status(400)
                .send({ status: false, message: "please provide data in the body" });
        }

        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "You entered a Invalid userId in params" })
        const User = await userModel.findById({ _id: userId })
        if (!User) return res.status(404).send({ status: false, message: "user not found" })
            //Destructuring requestBody
        let { firstDose, SecondDose, VaccineStatus } = requestBody;
        //--------------------------------Validation starts-------------------------------
        //fname


        firstDose = JSON.parse(firstDose)
        if (firstDose) {
            if (typeof firstDose != "object") return res.status(400).send({ status: false, message: "Please provide firstdose in Object" })
            if (firstDose) {
                if (firstDose.date) {
                    if (!validator.isValid(firstDose.Date)) return res.status(400).send({ status: false, Message: "first Dose Date is required" })
                    var date = moment(Date, "YYYY-MM-DD", true).isValid();
                    if (!date)
                        return res.status(400).send({
                            status: false,
                            msg: "format of date is wrong,correct fromat is YYYY-MM-DD",
                        });
                    User.firstDose["date"] = firstDose.date
                }
                if (firstDose.Time) {
                    if (!validator.isValid(firstDose.Time)) return res.status(400).send({ status: false, Message: "firstDose time is required" })
                    User.firstDose["Time"] = firstDose.Time
                }

            } else {
                return res.status(400).send({ status: false, message: "please provide firstDose Deatails" })
            }
        }


        SecondDose = JSON.parse(SecondDose)
        if (SecondDose) {
            if (typeof SecondDose != "object") return res.status(400).send({ status: false, message: "Please provide firstdose in Object" })
            if (SecondDose) {
                if (SecondDose.Date) {
                    if (!validator.isValid(SecondDose.Date)) return res.status(400).send({ status: false, Message: "second Dose Date is required" })
                    var date = moment(Date, "YYYY-MM-DD", true).isValid();
                    if (!date)
                        return res.status(400).send({
                            status: false,
                            msg: "format of date is wrong,correct fromat is YYYY-MM-DD",
                        });
                    User.SecondDose["date"] = SecondDose.date
                }
                if (SecondDose.Time) {
                    if (!validator.isValid(SecondDose.Time)) return res.status(400).send({ status: false, Message: "secondDose time is required" })
                    User.firstDose["Time"] = firstDose.Time
                }
            } else {
                return res.status(400).send({ status: false, message: "please provide sedcond Deatails" })
            }

            if (VaccineStatus) {
                if (!validator.isValidEnum(VaccineStatus)) return res.status(400).send({ status: false, msg: "Please enter a valid title,available titles are ['non','firstDose','Allcompleted]" })
                User.VaccineStatus = VaccineStatus
            }
            const UpdateUser1 = await User.save()
            const strUserUpdate = JSON.stringify(UpdateUser1)
            const ObjectUserUpdate = JSON.parse(strUserUpdate)
            return res
                .status(200)
                .send({
                    status: true,
                    message: ` Vaccine registered successfully`,
                    data: ObjectUserUpdate,
                });

        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { createUser, loginUser, getByPin, vaccineRegister, updateVaccine }
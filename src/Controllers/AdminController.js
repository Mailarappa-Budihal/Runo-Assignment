const adminModel = require("../Models/AdminModel")
const validator = require("../validations/validation");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");


const loginAdmin = async function(req, res) {
    try {
        const loginData = req.body
        const { PhoneNumber, password } = loginData

        //validation
        if (!validator.isValidBody(loginData)) return res.status(400).send({ status: false, message: "Please provide login credentials" })

        if (!validator.isValid(PhoneNumber)) return res.status(400).send({ status: false, message: " PhoneNumber is mandatory" })
        if (!validator.isValidPhone(PhoneNumber)) return res.status(400).send({ status: false, message: "Please provide valid PhoneNumber" })

        if (!validator.isValid(password)) return res.status(400).send({ status: false, message: " password is mandatory" })
        if (!validator.isValidPassword(password)) return res.status(400).send({ status: false, message: "Please provide valid password" })

        let user = await adminModel.findOne({ PhoneNumber: PhoneNumber });
        if (!user) {
            return res.status(404).send({ status: false, message: "PhoneNumber is not found" });
        }

        const token = jwt.sign({
                adminId: user._id.toString(),
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
            },
            "Rono-Assignment-2" // => secret key
        );
        return res.status(200).send({ status: true, message: "admin login successfully", data: { userId: user._id, token: token } })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//=================================fliter the User=================================//

const getUser = async function(req, res) {
    try {
        let data = req.query;
        let { Age, Pincode, vaccineStatus } = data;
        filterQuery = {}
        if (Object.keys(data).length > 0) {
            if (Age && Age.trim() !== "") {
                if (!validator.isValidAge(Age))
                    return res.status(400).send({
                        status: false,
                        msg: "Age must be Number",
                    });
                filterQuery.Age = Age.trim();
            }
            if (Pincode && Pincode.trim() !== "") {
                filterQuery.Pincode = Pincode.trim();
            }
            if (vaccineStatus && vaccineStatus.trim() !== "") {
                filterQuery.vaccineStatus = vaccineStatus.trim();
            }

            const result = await UserModel
                .find(filterQuery)
                .select({
                    updatedAt: 0,
                    createdAt: 0,
                    __v: 0,
                })
            if (result.length === 0)
                return res
                    .status(404)
                    .send({ status: false, msg: "No books found for applied filter" });

            return res
                .status(200)
                .send({ status: true, message: "User  list", data: result });
        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
};
module.exports = { loginAdmin, getUser }
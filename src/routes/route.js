const express = require('express')
const router = express.Router();
const userController = require('../Controllers/UserController')
const adminController = require('../Controllers/AdminController')

const { authentication2, authentication, authorisation } = require('../middleware/auth')

//======User Registration ====================================//
router.post("/RegisterUser", userController.createUser)
    //======User login ====================================//
router.post("/userLogin", userController.loginUser)
    //======Available vaccine ====================================//
router.get("/Avialablevaccine", userController.getByPin)
    //======vaccine Register ====================================//
router.post("/vaccineRegister/:userId", authentication, authorisation, userController.vaccineRegister)

//======Update  Vaccine registration ====================================//

router.put("/vaccineRegister/:userId", authentication, authorisation, userController.updateVaccine)


//======Admin ====================================//
router.post("/adminLogin", adminController.loginAdmin)

//======User Registration ====================================//
router.get("/getuserDetails", authentication2, adminController.getUser)

















module.exports = router
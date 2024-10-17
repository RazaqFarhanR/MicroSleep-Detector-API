const express = require("express")
const router = express.Router()

const authController = require("../controllers/auth.controller")

router.post('/admin', authController.adminAuth)
router.post('/user', authController.userAuth)
router.post('/user/register', authController.userRegister)


module.exports = router
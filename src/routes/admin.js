const express = require("express")
const router = express.Router()

const adminController = require("../controllers/admin.controller")
const verifyUser = require("../middleware/verifyUser")

router.get('/', adminController.allAdmins)
router.get('/me', verifyUser, adminController.profile)

module.exports = router;
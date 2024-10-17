const express = require("express")
const router = express.Router()

const userController = require("../controllers/user.controller")
const verifyUser = require("../middleware/verifyUser")

router.get('/', userController.allUsers)
router.get('/me', verifyUser, userController.profile)
router.post('/emergency_contact', verifyUser, userController.addEmergencyContact)
router.put('/:id', verifyUser, userController.updateUser)
router.delete('/:id', verifyUser, userController.deleteUser)

module.exports = router;
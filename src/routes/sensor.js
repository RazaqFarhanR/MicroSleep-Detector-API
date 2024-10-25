const express = require("express")
const router = express.Router()

const sensorController = require("../controllers/sensor.controller")

router.post('/gps', sensorController.addGPSData)


module.exports = router
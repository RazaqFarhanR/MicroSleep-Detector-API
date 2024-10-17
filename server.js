const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const cors = require("cors")

require('dotenv').config()
require('./src/config/sequelize')

const PORT = process.env.PORT || 3000

const authRoutes = require('./src/routes/auth')
const adminRoutes = require('./src/routes/admin')
const userRoutes = require('./src/routes/user')
const otpRoutes = require('./src/routes/otp')
const deviceRoutes = require('./src/routes/device')
const accidentRoutes = require('./src/routes/accidents')

app.use(cors())
app.use(express.static(__dirname))
app.use(bodyParser.json())

app.use("/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/accidents', accidentRoutes);

app.listen(PORT,() =>{
    console.log('server run on port ' + PORT)
})
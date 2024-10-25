const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const models = require("../models/index")
const Admin = models.admin
const User = models.user
const OtpCodes = models.otp_codes
const { getResponse, addResponse, editResponse, errorResponse, deleteResponse } = require("../utils/responseHandler")
const { generateOTP } = require('../utils/otpGenerator');
const { sendOTP } = require('../utils/otpSender');

module.exports = {
  adminAuth: async (req, res) => {
    try {
      const user = await Admin.scope('withPassword').findOne({
        where: { email: req.body.email },
      });
      if (!user) {
        return res.status(400).json({ message: 'Incorrect Email or Password' });
      }
      const reqPass = crypto
        .createHash('md5')
        .update(req.body.password || '')
        .digest('hex');
      if (reqPass !== user.password) {
        return res.status(400).json({ message: 'Incorrect Email or Password' });
      }
      const token = jwt.sign(
        {
          user: {
            userId: user.id,
            email: user.email,
            createdAt: new Date(),
          },
        },
        process.env.SECRET,
      );
      delete user.dataValues.password;
      return getResponse(req, res, { user, token });
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },

  userAuth: async (req, res) => {
    try {
      const { phone_number, password, fcm_token } = req.body; // Ambil fcm_token dari request body
      const user = await User.scope('withPassword').findOne({
        where: { phone_number },
      });
      
      if (!user) {
        throw new Error('Incorrect Phone Number/Password');
      }
      
      const reqPass = crypto
        .createHash('md5')
        .update(password || '')
        .digest('hex');
        
      if (reqPass !== user.password) {
        throw new Error('Incorrect Phone Number/Password');
      }
      
      if (fcm_token) {
        user.fcm_token = fcm_token;
        await user.save();
      }
      
      const token = jwt.sign(
        {
          user: {
            userId: user.id,
            phone_number: user.phone_number,
            createdAt: new Date(),
          },
        },
        process.env.SECRET,
      );
      
      delete user.dataValues.password;
      return getResponse(req, res, { user, token });
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },
  

  userRegister: async (req, res) => {
    const { name, password, fcm_token } = req.body;
    const phone_number = '62' + req.body.phone_number;
  
    if (!name || !phone_number || !password) {
      return res.status(400).json({ message: 'Name, phone number and password are required' });
    }
  
    const transaction = await models.sequelize.transaction();
  
    try {
      const existingUser = await User.findOne({ where: { phone_number }, transaction });
      if (existingUser) {
        return res.status(400).json({ message: 'Phone number is already registered.' });
      }
  
      const hashedPassword = crypto
        .createHash('md5')
        .update(password)
        .digest('hex');
  
      const newUser = await User.create({
        name,
        phone_number,
        password: hashedPassword,
        fcm_token,
      }, { transaction });
  
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60000); 
  
      await OtpCodes.create({
        user_id: newUser.id,
        otp_code: otp,
        expires_at: expiresAt,
        is_verified: false,
      }, { transaction });
  
      await sendOTP(phone_number, otp); 
      await transaction.commit(); 
      const msg = "User registered successfully. OTP sent to your phone number.";
      return addResponse(req, res, newUser, msg);
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return errorResponse(req, res, error.message);
    }
  }
  
}
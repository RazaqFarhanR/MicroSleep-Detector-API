const models = require("../models/index")
const User = models.user
const OtpCodes = models.otp_codes
const { generateOTP } = require('../utils/otpGenerator');
const { sendWhatsAppMessage } = require('../services/wablasServices');
const { Op } = require("sequelize");

const otpStore = new Map();

const sendOTP = async (req, res) => {
  const phoneNumber = req.body.phone_number;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  const otp = generateOTP();
  otpStore.set(phoneNumber, otp);

  const message = `
Hello,

Your OTP code for accessing MSDCApps is: ${otp}
Please enter this code to complete the verification process. The code will expire in 10 minutes.
If you did not request this, please ignore this message.

Thank you,
MSDCApps Team
  `.trim();
  

  try {
    await sendWhatsAppMessage(phoneNumber, message);
    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    return res.status(500).json({ message: `Failed to send OTP: ${error.message}` });
  }
};

const verifyOTP = async (req, res) => {
  const { otp } = req.body;
  const phoneNumber = "62"+req.body.phone_number

  if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  try {
      const user = await User.findOne({ where: { phone_number: phoneNumber } });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const otpRecord = await OtpCodes.findOne({
          where: {
              user_id: user.id,
              otp_code: otp,
              expires_at: {
                  [Op.gt]: new Date()
              },
              is_verified: false 
          },
      });

      if (!otpRecord) {
          return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      otpRecord.is_verified = true;
      await otpRecord.save();

      return res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
      console.error('Error verifying OTP:', error);
      return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { sendOTP, verifyOTP };

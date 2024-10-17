const { sendWhatsAppMessage } = require('../services/wablasServices');

const sendOTP = async (phoneNumber, otp) => {
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
        return true;
    } catch (error) {
        console.error('Failed to send OTP:', error);
        throw new Error('Failed to send OTP');
    }
};

module.exports = { sendOTP };

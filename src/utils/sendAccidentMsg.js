const { sendWhatsAppMessage } = require('../services/wablasServices');

const sendMsgAccident = async (phoneNumber, location, tilt, date) => {

    const latitude = location.latitude
    const longitude = location.longitude

    console.log(phoneNumber);
    
    const message = `
🚨 *Emergency Alert: Car Accident Detected* 🚨


📍 *Location:* 
      https://www.google.com/maps?q=${latitude},${longitude}
📐 *Tilt Angle:* ${tilt}
⏰ *Time:* ${date}


Please act immediately! Contact emergency services.

    `.trim();

    try {
        await sendWhatsAppMessage(phoneNumber, message);
        return true;
    } catch (error) {
        console.error('Failed to send OTP:', error);
        throw new Error('Failed to send OTP');
    }
};

module.exports = { sendMsgAccident };
const axios = require('axios');
require('dotenv').config();

const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    const response = await axios.post(`https://jkt.wablas.com/api/send-message`, {
      phone: phoneNumber,
      message: message,
    }, {
      headers: {
        'Authorization': `${process.env.WABLAS_API_KEY}`,
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to send WhatsApp message: ${error.message}`);
  }
};

module.exports = { sendWhatsAppMessage };

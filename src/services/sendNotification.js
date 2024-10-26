// src/services/notificationService.js
const admin = require('../config/firebaseConfig');

const sendNotification = async (token, payload) => {
    try {
        const response = await admin.messaging().send({
            token: token,
            notification: {
                title: payload.title,
                body: payload.body,
            },
        });
        return response;
    } catch (error) {
        throw new Error(`Unable to send notification: ${error.message}`);
    }
};

module.exports = {
    sendNotification,
};

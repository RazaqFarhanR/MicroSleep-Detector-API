// src/config/firebaseConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('../../keys/microsleep01-firebase-adminsdk-8r69l-da7fa32be0.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;

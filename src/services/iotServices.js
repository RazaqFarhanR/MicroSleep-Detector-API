const AWSIoTDevice = require('aws-iot-device-sdk');
const models = require("../models/index");
const Device = models.devices;

module.exports = {
    createDevice: async (clientId) => {
    const deviceRecord = await Device.findOne({
        where: {client_id: clientId},
        logging: false
    });
    if (!deviceRecord) {
        console.error(`No credentials found for device: ${clientId}`);
        return null;
    }    

    const device = AWSIoTDevice.device({
        keyPath: `./${deviceRecord.private_key}`,
        certPath: `./${deviceRecord.certificate}`,
        caPath: `./${deviceRecord.ca}`,
        clientId: clientId,
        region: process.env.AWS_IOT_REGION,
        host: process.env.AWS_IOT_ENDPOINT,
    });

    device.on('connect', () => {
        console.log(`🌟 Connected to AWS IoT as ${clientId}`);
        device.subscribe(`devices/${clientId}/data`);
        // device.publish(`devices/${clientId}/data`, JSON.stringify({ message: 'Hello from device!' }));
    });

    device.on('message', (topic, payload) => {
        console.log(`Received message from ${topic}:`, payload.toString());
    });

    device.on('error', (error) => {
        if (error.code === 'ECONNRESET') {
            console.error('Connection was reset. Please check your network or device configuration.');
        } else {
            console.error('Connection error:', error);
        }
    });

    return device;
    },

    initializeDevices: async () => {
        const allDevices = await Device.findAll({
            logging: false
        });
        for (const device of allDevices) {
            console.log(`connecting to ${device.client_id}`);
            await module.exports.createDevice(device.client_id);
        }
    }
}

const AWSIoTDevice = require('aws-iot-device-sdk');
const models = require("../models/index");
const Device = models.devices;

module.exports = {
    createDevice: async (clientId) => {
        // const deviceRecord = await Device.findOne({
        //     where: {client_id: clientId},
        //     logging: false
        // });
        // if (!deviceRecord) {
        //     console.error(`No credentials found for device: ${clientId}`);
        //     return null;
        // }    

        const device = AWSIoTDevice.device({
            // keyPath: `./${deviceRecord.private_key}`,
            // certPath: `./${deviceRecord.certificate}`,
            // caPath: `./${deviceRecord.ca}`,
            keyPath: `./keys/37597da8-0f25-40f0-ba29-cde3deb0cd7a_private_key.pem.key`,
            certPath: `./keys/37597da8-0f25-40f0-ba29-cde3deb0cd7a_certificate.pem.crt`,
            caPath: `./keys/37597da8-0f25-40f0-ba29-cde3deb0cd7a_ca.pem`,
            clientId: 'ESP32_S3',
            region: process.env.AWS_IOT_REGION,
            host: process.env.AWS_IOT_ENDPOINT,
        });

        device.on('connect', () => {
            console.log(`🌟 Connected to AWS IoT as ${clientId}`);
            device.subscribe(`ESP32_S3_V2/sub`);
            device.publish(`ESP32_S3_V2/sub`, JSON.stringify({ message: 'test koneksi' }));
            console.log("send message test koneksi");
            
        });

        // device.on('message', (topic, payload) => {
        //     console.log(`Received message from ${topic}:`, payload.toString());
        // });

        device.on('error', (error) => {
            if (error.code === 'ECONNRESET') {
                console.error('Connection was reset. Please check your network or device configuration.');
            } else {
                console.error('Connection error:', error);
            }
        });

        return device;
    },

    publishMessage: (device, topic, message) => {
        if (device && device.connected) {
            device.publish(topic, JSON.stringify(message), { qos: 1 }, (err) => {
                if (err) {
                    console.error(`Failed to publish to ${topic}:`, err);
                } else {
                    console.log(`Message published to ${topic}:`, message);
                }
            });
        } else {
            console.error('Device is not connected.');
        }
    },

    initializeDevices: async () => {
        // const allDevices = await Device.findAll({
        //     logging: false
        // });
        // for (const device of allDevices) {
            console.log(`connecting to ESP32_S3`);
            await module.exports.createDevice('ESP32_S3');
        // }
    }
}

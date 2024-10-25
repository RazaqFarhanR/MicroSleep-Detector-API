const models = require("../models/index");
const { errorResponse, addResponse } = require("../utils/responseHandler");
const Gps = models.gps_data
const Device = models.devices;


module.exports = {
    addGPSData: async (req, res) => {
        try {
            const serial_number = req.body.sn
            const device = await models.devices.findOne({
                where: { serial_number: serial_number },
            });
            let data = {
                device_id: device.id,
                latitude: req.body.latitude,
                longitude: req.body.longitude,
                timestamp: Date.now(),
                status: 'active'
            }
            await Gps.create(data)
            return addResponse(req, res, data);
        } catch (error) {
            return errorResponse(req, res, error.message);
        }
    }
}
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const models = require("../models/index");
const Device = models.devices;
const { getResponse, paginationResponse, addResponse, editResponse, errorResponse, deleteResponse } = require("../utils/responseHandler");
const { generateSerialNumber } = require('../utils/generateSerialNumber')

module.exports = {
  allDevices: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await Device.findAndCountAll({
        order: [['createdAt', 'DESC']],
        offset: offset,
        limit,
        include: [{
            model: models.user,
            as: 'user',
            attributes: ['name'],
          }],
      });
      
      const totalPages = Math.ceil(count / limit);
      return paginationResponse(req, res, rows, page, limit, count, totalPages);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },

  createDevice: async (req, res) => {
    const { device_name, client_id, certificate, private_key, public_key } = req.body;

    if (!device_name || !client_id) {
      return res.status(400).json({ message: 'Device name, serial number, user ID, and client ID are required.' });
    }

    const SN = await generateSerialNumber();
    try {
      const newDevice = await Device.create({
        device_name,
        serial_number: SN,
        client_id,
        certificate,
        private_key,
        public_key,
      });
      return addResponse(req, res, newDevice, "Device created successfully.");
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },

  getDeviceById: async (req, res) => {
    const { id } = req.params;

    try {
      const device = await Device.findOne({where: {id: id}});
      if (!device) {
        return res.status(404).json({ message: 'Device not found.' });
      }
      return getResponse(req, res, device);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },

  updateDevice: async (req, res) => {
    const { id } = req.params;
    const { device_name, serial_number, user_id, client_id, certificate, private_key, public_key, status } = req.body;

    try {
      const device = await Device.findOne({where: {id: id}});
      if (!device) {
        return res.status(404).json({ message: 'Device not found.' });
      }

      const updatedDevice = await device.update({
        device_name: device_name || device.device_name,
        serial_number: serial_number || device.serial_number,
        user_id: user_id || device.user_id,
        client_id: client_id || device.client_id,
        certificate: certificate || device.certificate,
        private_key: private_key || device.private_key,
        public_key: public_key || device.public_key,
        status: status || device.status,
      });
      return editResponse(req, res, updatedDevice, "Device updated successfully.");
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },

  deleteDevice: async (req, res) => {
    const { id } = req.params;

    try {
      const device = await Device.findOne({where: {id: id}});
      if (!device) {
        return res.status(404).json({ message: 'Device not found.' });
      }

      await device.destroy();
      return deleteResponse(req, res, device, "Device deleted successfully.");
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },
};

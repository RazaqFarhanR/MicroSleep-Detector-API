const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const models = require("../models/index");
const Device = models.devices;
const { getResponse, paginationResponse, addResponse, editResponse, errorResponse, deleteResponse } = require("../utils/responseHandler");
const { generateSerialNumber } = require('../utils/generateSerialNumber')
const iotService = require('../services/iotServices');

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
    const { device_name, client_id } = req.body;

    if (!device_name || !client_id) {
        return res.status(400).json({ message: 'Device name and client ID are required.' });
    }

    const SN = await generateSerialNumber();
    try {
        const newDevice = await Device.create({
            device_name,
            serial_number: SN,
            client_id,
        });

        if (req.files['certificate'] && req.files['certificate'][0]) {
            newDevice.certificate = req.files['certificate'][0].path;
        }
        
        if (req.files['private_key'] && req.files['private_key'][0]) {
            newDevice.private_key = req.files['private_key'][0].path;
        }
        
        if (req.files['public_key'] && req.files['public_key'][0]) {
            newDevice.public_key = req.files['public_key'][0].path;
        }
        
        if (req.files['ca'] && req.files['ca'][0]) {
            newDevice.ca = req.files['ca'][0].path;
        }

        return addResponse(req, res, newDevice, "Device created successfully.");
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
  },

  createHundredDevice: async (req, res) => {
    const devices = [];
    for (let i = 1; i <= 100; i++) {
        const SN = await generateSerialNumber();
        devices.push({
            device_name: `Device ${i}`,
            serial_number: SN,
            client_id: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    try {
        await models.sequelize.transaction(async (transaction) => {
            await Device.bulkCreate(devices, { transaction });
        });

        return res.status(201).json({ message: '100 Devices created successfully.' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
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
    const { device_name, user_id, client_id, status } = req.body;

    try {
      const device = await Device.findOne({where: {id: id}});
      if (!device) {
        return res.status(404).json({ message: 'Device not found.' });
      }

      const updatedDevice = {
        device_name: device_name || device.device_name,
        user_id: user_id || device.user_id,
        client_id: client_id || device.client_id,
        status: status || device.status,
      };

      if (req.files.certificate && req.files.certificate[0]) {
          updatedDevice.certificate = req.files.certificate[0].path;          
      }

      if (req.files.private_key && req.files.private_key[0]) {
          updatedDevice.private_key = req.files.private_key[0].path;
      }

      if (req.files.public_key && req.files.public_key[0]) {
          updatedDevice.public_key = req.files.public_key[0].path;
      }

      if (req.files.ca && req.files.ca[0]) {
          updatedDevice.ca = req.files.ca[0].path;
      }

      const result = await Device.update(updatedDevice, {where: {id: id}});

      return editResponse(req, res, result);
    } catch (error) {
      console.log(error);
      return errorResponse(req, res, error);
      
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

  connectDevice: (req, res) => {
    const clientId = req.params.clientId;
    const device = iotService.createDevice(clientId);
    if (device) {
      res.status(201).send(`Device ${clientId} added and connected.`);
    } else {
      res.status(400).send(`Device ${clientId} already exists.`);
    }
  }
};

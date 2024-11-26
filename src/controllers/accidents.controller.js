const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const models = require("../models/index");
const AccidentReport = models.accident_report;
const AccidentDetected = models.accident_detected;
const User = models.user;
const { getResponse, paginationResponse, addResponse, editResponse, errorResponse, deleteResponse } = require("../utils/responseHandler");
const { sendMsgAccident } = require("../utils/sendAccidentMsg");
const admin = require('../config/firebaseConfig');

module.exports = {
  allReports: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await AccidentReport.findAndCountAll({
        include: [
          {
            model: models.devices,
            as: 'devices',
            attributes: ['serial_number']
          },
          {
            model: models.user,
            as: 'user',
            attributes: ['name']
          }
        ],
        order: [['timestamp', 'DESC']],
        offset: offset,
        limit,
        
      });
      
      const totalPages = Math.ceil(count / limit);
      return paginationResponse(req, res, rows, page, limit, count, totalPages);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },

  allReportsbyUser: async (req, res) => {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await AccidentReport.findAndCountAll({
        where: {user_id: id},
        include: [
          {
            model: models.devices,
            as: 'devices',
            attributes: ['serial_number']
          },
          {
            model: models.user,
            as: 'user',
            attributes: ['name']
          }
        ],
        order: [['timestamp', 'DESC']],
        offset: offset,
        limit,
        
      });
      
      const totalPages = Math.ceil(count / limit);
      return paginationResponse(req, res, rows, page, limit, count, totalPages);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },

  getReportById: async (req, res) => {
    try {
      const { id } = req.params;
      const report = await AccidentReport.findByPk(id);

      if (!report) {
        return errorResponse(req, res, 'Laporan tidak ditemukan', 404);
      }
      
      return getResponse(req, res, report);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },

  reportAccident: async (req, res) => {
    try {
      const { serial_number, latitude, longitude, tilt_angle } = req.body;
  
      const device = await models.devices.findOne({
        where: { serial_number: serial_number },
        include: [
          {
            model: models.user,
            attributes: ['id'],
            as: "user",
            include: [{
              model: models.emergency_contact,
              as: "emergency_contact",
              attributes: ['phone_number']
            }]
          }
        ]
      });
  
      if (!device) {
        return errorResponse(req, res, 'Device not found', 404);
      }
  
      const timestamp = new Date();
  
      const newReport = await AccidentReport.create({
        device_id: device.id,
        user_id: device.user ? device.user.id : null,
        latitude,
        longitude,
        tilt_angle,
        timestamp,
      });

      // console.log(
      //     {
      //       device_id: device.id,
      //       user_id: device.user ? device.user.id : null,
      //       tilt_angle,
      //       timestamp,
      //     }
      // );

      const location = {
        latitude,
        longitude
      }

      if (true) {
        const emergencyContact = device.user?.emergency_contact?.phone_number;
        if (emergencyContact) {
          sendMsgAccident(emergencyContact, location, tilt_angle, timestamp);
        } else {
          console.warn('No emergency contact found for the user');
        }
      }
  
      return addResponse(req, res, newReport);
  
    } catch (error) {
      console.error('Error creating accident report:', error);
      return errorResponse(req, res, 'Internal server error', 500);
    }
  },
  
  detectedAccident: async (req, res) => {
    const { serial_number, latitude, longitude, tilt_angle } = req.body;

    const device = await models.devices.findOne({
      where: { serial_number: serial_number },
    });

    try {
      if (!device) {
        return res.status(404).json({ message: 'Device not found' });
      }
      const user = await User.findOne({ where: { id: device.user_id } });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const fcmToken = user.fcm_token;
      
      if (!fcmToken) {
        return res.status(404).json({ message: 'FCM token not found for this user' });
      }
  
      const detectedAct = await AccidentReport.create({
        device_id: device.id,
        user_id: device.user ? device.user.id : null,
        latitude,
        longitude,
        tilt_angle,
        timestamp: Date.now(),
      });

      const message = {
        notification: {
          title: 'Panic Button Alert',
          body: 'Accident detected! Please confirm your status.',
        },
        token: fcmToken,
      };

      // await AccidentDetected.create(detectedAct)
      await admin.messaging().send(message);
      
      return res.status(200).json({ message: 'Notification sent successfully' });
    } catch (error) {
      console.error('Error sending notification:', error);
      return res.status(500).json({ message: 'Error sending notification', error: error.message });
    }
  },
};

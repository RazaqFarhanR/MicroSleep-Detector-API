const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const models = require("../models/index");
const AccidentReport = models.accident_report;
const { getResponse, paginationResponse, addResponse, editResponse, errorResponse, deleteResponse } = require("../utils/responseHandler");
const { sendMsgAccident } = require("../utils/sendAccidentMsg");

module.exports = {
  allReports: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await AccidentReport.findAndCountAll({
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
      const { serial_number, location, tilt_angle } = req.body;
  
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
  
      // const newReport = await AccidentReport.create({
      //   device_id: device.id,
      //   user_id: device.user ? device.user.id : null,
      //   location,
      //   tilt_angle,
      //   timestamp,
      // });

      console.log(
          {
            device_id: device.id,
            user_id: device.user ? device.user.id : null,
            location,
            tilt_angle,
            timestamp,
          }
      );

      if (true) {
        const emergencyContact = device.user?.emergency_contact?.phone_number;
        
        
        if (emergencyContact) {
          console.log("send");
          sendMsgAccident(emergencyContact, location, tilt_angle, timestamp);
        } else {
          console.warn('No emergency contact found for the user');
        }
      }
  
      return addResponse(req, res, {device});
  
    } catch (error) {
      console.error('Error creating accident report:', error);
      return errorResponse(req, res, 'Internal server error', 500);
    }
  }
   
};

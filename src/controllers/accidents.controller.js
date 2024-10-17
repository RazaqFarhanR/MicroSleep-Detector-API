const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const models = require("../models/index");
const AccidentReport = models.accident_report;
const { getResponse, paginationResponse, addResponse, editResponse, errorResponse, deleteResponse } = require("../utils/responseHandler");

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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(req, res, 'Validation errors: ' + JSON.stringify(errors.array()), 400);
      }
  
      const { serial_number, location, tilt_angle } = req.body;
  
      const device = await models.device.findOne({
        where: { serial_number },
        include: [{
          model: models.user,
          attributes: ['id']
        }]
      });
  
      if (!device) {
        return errorResponse(req, res, 'Device not found', 404);
      }
  
      const timestamp = new Date();
  
      const newReport = await AccidentReport.create({
        device_id: device.id,
        user_id: device.user ? device.user.id : null,
        location,
        tilt_angle,
        timestamp,
      });
  
      return addResponse(req, res, newReport);
    } catch (error) {
      console.error('Error creating accident report:', error);
      return errorResponse(req, res, 'Internal server error', 500);
    }
  }  
};

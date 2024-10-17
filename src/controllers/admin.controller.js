const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const models = require("../models/index")
const Admin = models.admin
const { getResponse, addResponse, editResponse, errorResponse, deleteResponse, paginationResponse } = require("../utils/responseHandler")

module.exports = {
  allAdmins: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await Admin.findAndCountAll({
        order: [['createdAt', 'DESC']],
        offset: offset,
        limit,
      });
      
      const totalPages = Math.ceil(count / limit);
      return paginationResponse(req, res, rows, page, limit, count, totalPages);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },

  profile : async (req, res) => {
    try {
      const { userId } = req.user;
      
      const user = await Admin.scope('withoutTimestamp').findOne({
        where: { id: userId },
      });
      return getResponse(req, res, { user });
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },
}
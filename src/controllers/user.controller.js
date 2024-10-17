const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const models = require("../models/index")
const User = models.user;
const EmergencyContact = models.emergency_contact;
const { getResponse, paginationResponse, addResponse, editResponse, errorResponse, deleteResponse } = require("../utils/responseHandler");

module.exports = {
  allUsers : async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await User.findAndCountAll({
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

  updateUser: async (req, res) => {
    const transaction = await models.sequelize.transaction();
    try {

      const userId = req.params.id
      let param = {id: req.params.id}

      let data = {
        name: req.body.name,
        email: req.body.email,
      }

      let emergencyContactData

      if (req.body.contact_name || req.body.emergency_number) {
        const emergencyData = {
          name: req.body.contact_name,
          phone_number: req.body.emergency_number
        };
  
        const emergencyContact = await EmergencyContact.findOne({ 
          where: { user_id: userId },
          transaction
        });
  
        if (emergencyContact) {
          emergencyContactData = await EmergencyContact.update(emergencyData, {
            where: { user_id: userId },
            transaction
          });
        } else {
          emergencyData.user_id = userId;
          emergencyContactData = await EmergencyContact.create(emergencyData, { transaction });
        }
      }
      await transaction.commit();
      
      const result = await User.update(data, {where:param})
      return editResponse(req, res, {user: result, emergency_contact: emergencyContactData})
    } catch (error) {
      await transaction.rollback();
      return errorResponse(req, res, error.message);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const param = {id: req.params.id}
      await EmergencyContact.destroy({where: {user_id: req.params.id}})
      const result = await User.destroy({where:param});
      return deleteResponse(req, res, result);
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },

  addEmergencyContact: async (req, res) => {
    const { name, phone_number } = req.body;
  
    if ( !name || !phone_number) {
      return res.status(400).json({ message: 'name, and phone number are required' });
    }
  
    try {

      const { userId } = req.user;
      let data = {
        user_id: userId,
        name: name,
        phone_number: phone_number,
      }

      const emergencyContact = await EmergencyContact.create(data);
      return addResponse(req, res, emergencyContact)
    } catch (error) {
      return errorResponse(req, res, error.message)
    }
  },

  profile : async (req, res) => {
    try {
      const { userId } = req.user;
      console.log(userId);
      
      const user = await User.findOne({
        where: { id: userId },
        include:[{
          model: models.emergency_contact,
          as: 'emergency_contact'
        }]
      });
      return getResponse(req, res, { user });
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },

  changePassword : async (req, res) => {
    try {
      const { userId } = req.user;
      const user = await User.scope('withSecretColumns').findOne({
        where: { id: userId },
      });

      const reqPass = crypto
        .createHash('md5')
        .update(req.body.oldPassword)
        .digest('hex');
      if (reqPass !== user.password) {
        throw new Error('Old password is incorrect');
      }

      const newPass = crypto
        .createHash('md5')
        .update(req.body.newPassword)
        .digest('hex');

      await User.update({ password: newPass }, { where: { id: user.id } });
      return successResponse(req, res, {});
    } catch (error) {
      return errorResponse(req, res, error.message);
    }
  },
}
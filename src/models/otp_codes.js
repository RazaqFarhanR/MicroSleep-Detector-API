'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class otp_codes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey: 'user_id',
        as: 'otpCode',
    });
    }
  }
  otp_codes.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: DataTypes.UUID,
    otp_code: DataTypes.STRING,
    expires_at: DataTypes.DATE,
    is_verified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'otp_codes',
    tableName: 'otp_codes',
    defaultScope: {
      attributes: {
          exclude: ['createdAt', 'updatedAt']
      },
  },
    scopes: {
      withUser: {
          attributes: {
              include: ['user_id', 'otp_code', 'expires_at', 'is_verified', [sequelize.col('user.phone_number'), 'phone_number']],
          },
      },
  },
  });
  return otp_codes;
};
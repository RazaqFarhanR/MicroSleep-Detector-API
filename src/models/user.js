'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.emergency_contact,{
        foreignKey:"user_id",
        as: "emergency_contact"
      })
      this.hasOne(models.devices,{
        foreignKey:"user_id",
        as: "devices"
      })
    }
  }
  users.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    password: DataTypes.TEXT,
    is_verified: DataTypes.BOOLEAN,
    fcm_token: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'user',
    defaultScope: {
      attributes: { exclude: ['password'] } 
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] }
      }
    }
  });
  return users;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class accident_report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  accident_report.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    device_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
    location: DataTypes.JSON,
    tilt_angle: DataTypes.FLOAT,
    timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'accident_report',
  });
  return accident_report;
};
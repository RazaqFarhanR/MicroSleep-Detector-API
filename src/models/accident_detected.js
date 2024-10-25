'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class accident_detected extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  accident_detected.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    device_id: DataTypes.UUID,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    timestamp: DataTypes.DATE,
    tilt_angle: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'accident_detected',
    tableName: 'accident_detected'
  });
  return accident_detected;
};
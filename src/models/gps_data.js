'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class gps_data extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  gps_data.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    device_id: DataTypes.UUID,
    timestamp: DataTypes.DATE,
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL,
    altitude: DataTypes.DECIMAL,
    speed: DataTypes.DECIMAL,
    heading: DataTypes.DECIMAL,
    accuracy: DataTypes.DECIMAL,
    status: DataTypes.ENUM('active', 'inactive', 'error')
  }, {
    sequelize,
    modelName: 'gps_data',
  });
  return gps_data;
};
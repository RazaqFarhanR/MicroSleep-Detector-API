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
      this.belongsTo(models.devices,{
        foreignKey: "device_id",
        as: "devices"
      }),
      this.belongsTo(models.user,{
        foreignKey:"user_id",
        as: "user"
      })
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
    latitude: DataTypes.DECIMAL,
    longitude: DataTypes.DECIMAL,
    tilt_angle: DataTypes.FLOAT,
    timestamp: DataTypes.DATE,

    location: {
      type: DataTypes.VIRTUAL,
      get() {
        return {
          latitude: this.getDataValue('latitude'),
          longitude: this.getDataValue('longitude')
        };
      }
    }
  }, {
    sequelize,
    modelName: 'accident_report',
  });
  return accident_report;
};
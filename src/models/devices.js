'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class devices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }
  devices.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    device_name: DataTypes.STRING,
    serial_number: DataTypes.STRING,
    user_id: DataTypes.UUID,
    client_id: DataTypes.STRING,
    certificate: DataTypes.TEXT,
    private_key: DataTypes.TEXT,
    public_key: DataTypes.TEXT,
    ca: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'pending_activation'),
      get() {
        const value = this.getDataValue('status');
        return value ? value.replace('_', ' ') : null;
      },
    },
  }, {
    sequelize,
    modelName: 'devices',
    tableName: 'devices',
    // defaultScope: {
    //   include: [{
    //     model: sequelize.models.user,
    //     as: 'user',
    //     attributes: ['name'],
    //   }],
    // },
  });
  return devices;
};
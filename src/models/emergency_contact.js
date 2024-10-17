'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class emergency_contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user,{
        foreignKey:"user_id",
        as: 'emergency'
      })
    }
  }
  emergency_contact.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: DataTypes.UUID,
    name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'emergency_contact',
    tableName: 'emergency_contact',
    defaultScope: { 
      attributes: ['name', 'phone_number', 'is_verified']
    }
  });
  return emergency_contact;
};
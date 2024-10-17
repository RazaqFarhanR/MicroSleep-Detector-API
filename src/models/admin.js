'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class admins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  admins.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'admin',
    tableName: 'admin',
    // Define defaultScope to exclude password by default
    defaultScope: {
      attributes: { exclude: ['password'] } // Hide password by default
    },
    scopes: {
      // Create a scope to include password if needed
      withPassword: {
        attributes: { include: ['password'] }
      },
      withoutTimestamp: {
        attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
      }
    }
  });
  return admins;
};
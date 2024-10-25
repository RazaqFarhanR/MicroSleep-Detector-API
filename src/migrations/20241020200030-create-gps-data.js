'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('gps_data', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      device_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "devices",
          key: "id"
        }
      },
      timestamp: {
        type: Sequelize.DATE
      },
      latitude: {
        type: Sequelize.DECIMAL(11, 8)
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8)
      },
      altitude: {
        type: Sequelize.DECIMAL(10, 2)
      },
      speed: {
        type: Sequelize.DECIMAL(10, 2)
      },
      heading: {
        type: Sequelize.DECIMAL(5, 2)
      },
      accuracy: {
        type: Sequelize.DECIMAL(10, 2)
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'error'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('gps_data');
  }
};
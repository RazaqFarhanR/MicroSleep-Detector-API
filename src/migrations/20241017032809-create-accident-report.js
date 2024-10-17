'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accident_reports', {
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
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "user",
          key: "id"
        }
      },
      location: {
        type: Sequelize.JSON
      },
      tilt_angle: {
        type: Sequelize.FLOAT
      },
      timestamp: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('accident_reports');
  }
};
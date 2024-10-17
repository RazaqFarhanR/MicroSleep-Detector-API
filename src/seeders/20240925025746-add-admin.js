'use strict';
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const reqPass = crypto
    .createHash('md5')
    .update('password')
    .digest('hex');

    await queryInterface.bulkInsert('admin',
    [
      {
        id: uuidv4(),
        name: 'Test admin',
        email: 'admintest@test.com',
        password: reqPass,
        updatedAt: new Date(),
        createdAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admin', null, {});
  }
};

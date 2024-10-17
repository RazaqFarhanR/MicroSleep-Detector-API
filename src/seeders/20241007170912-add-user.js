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

    await queryInterface.bulkInsert('user',
    [
      {
        id: uuidv4(),
        name: 'John Doe',
        email: 'john@example.com',
        is_verified: true,
        phone_number: '1234567890',
        password: reqPass,
        updatedAt: new Date(),
        createdAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  }
};

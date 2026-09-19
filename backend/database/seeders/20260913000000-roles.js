'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      { name: 'Director', description: 'System Administrator and Director', created_at: new Date(), updated_at: new Date() },
      { name: 'Admin', description: 'Campus Administrator', created_at: new Date(), updated_at: new Date() },
      { name: 'Teacher', description: 'Teacher', created_at: new Date(), updated_at: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};

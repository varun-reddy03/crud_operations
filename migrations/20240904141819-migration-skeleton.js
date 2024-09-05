'use strict';

const sequelize = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'address',{
      id: Sequelize.INTEGER,
      type:sequelize.STRING,
      defaultValue:null });
     
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users','address');
     
  }
};

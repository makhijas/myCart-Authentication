'use strict';

const { FOREIGNKEYS } = require("sequelize/types/lib/query-types");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('freshFoods', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        foreignKey: true
      },
      item: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.INTEGER
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('freshFoods');
  }
};
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Destinations", "activity", {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn("Destinations", "placeId", {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Destinations", "activity");
    await queryInterface.removeColumn("Destinations", "placeId");
  },
};

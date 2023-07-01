"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Destinations", "activity", {
      type: Sequelize.TEXT,
    });
    /**
     * Add altering commands here.
     *
     * Example:
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Destinations", "activity");
    /**
     * Add reverting commands here.
     *
     * Example:
     */
  },
};

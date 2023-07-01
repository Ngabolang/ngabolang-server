"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Trips", "duration", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("Trips", "meetingPoint", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Trips", "province", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Trips", "limit", {
      type: Sequelize.INTEGER,
    });
    /**
     * Add altering commands here.
     *
     * Example:
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Trips", "duration");
    await queryInterface.removeColumn("Trips", "meetingPoint");
    await queryInterface.removeColumn("Trips", "province");
    await queryInterface.removeColumn("Trips", "limit");

    /**
     * Add reverting commands here.
     *
     * Example:
     */
  },
};

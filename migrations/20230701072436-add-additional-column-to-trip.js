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
    await queryInterface.addColumn("Trips", "location", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("Trips", "limit", {
      type: Sequelize.INTEGER,
    });
    await queryInterface.addColumn("Trips", "description", {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn("Trips", "chatId", {
      type: Sequelize.STRING,
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
    await queryInterface.removeColumn("Trips", "description");
    await queryInterface.removeColumn("Trips", "chatId");

    /**
     * Add reverting commands here.
     *
     * Example:
     */
  },
};

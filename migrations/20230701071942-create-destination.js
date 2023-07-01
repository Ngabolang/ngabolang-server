"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Destinations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tripId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Trips",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      name: {
        type: Sequelize.STRING,
      },
      imgUrl: {
        type: Sequelize.STRING,
      },
      labelDay: {
        type: Sequelize.INTEGER,
      },
      startHour: {
        type: Sequelize.TIME,
      },
      longitude: {
        type: Sequelize.STRING,
      },
      latitude: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Destinations");
  },
};

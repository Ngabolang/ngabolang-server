"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TripGroups", {
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
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      review: {
        type: Sequelize.STRING,
      },
      rating: {
        type: Sequelize.INTEGER,
      },
      paymentStatus: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("TripGroups");
  },
};

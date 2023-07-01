"use strict";

let data = require("../data/tripgroup.json");
data.forEach((el) => {
  el.createdAt = new Date();
  el.updatedAt = new Date();
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("TripGroups", data, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("TripGroups", null, {});
  },
};

"use strict";

let data = require("../data/trip.json");
data.forEach((el) => {
  el.createdAt = new Date();
  el.chatId = el.name.toLowerCase().split(" ").join("-");
  el.videoUrl = el.videoUrl.replace(
    "https://youtu.be/",
    "https://www.youtube.com/embed/"
  );
  el.updatedAt = new Date();
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Trips", data, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Trips", null, {});
  },
};

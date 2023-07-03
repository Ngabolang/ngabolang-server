"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Destination extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Destination.belongsTo(models.Trip, { foreignKey: "tripId" });
    }
  }
  Destination.init(
    {
      tripId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      imgUrl: DataTypes.STRING,
      labelDay: DataTypes.INTEGER,
      startHour: DataTypes.TIME,
      longitude: DataTypes.STRING,
      latitude: DataTypes.STRING,
      activity: DataTypes.TEXT,
      placeId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Destination",
    }
  );
  return Destination;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TripGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TripGroup.belongsTo(models.Trip, { foreignKey: "tripId" });
      TripGroup.belongsTo(models.User, { foreignKey: "customerId" });
    }
  }
  TripGroup.init(
    {
      tripId: DataTypes.INTEGER,
      customerId: DataTypes.INTEGER,
      review: DataTypes.STRING,
      rating: DataTypes.INTEGER,
      paymentStatus: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "TripGroup",
    }
  );
  return TripGroup;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Trip extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Trip.belongsTo(models.User, { foreignKey: "adminId" });
      Trip.belongsTo(models.Category, { foreignKey: "categoryId" });
      Trip.hasMany(models.Destination, { foreignKey: "tripId" });
      Trip.hasMany(models.TripGroup, { foreignKey: "tripId" });
    }
  }
  Trip.init(
    {
      name: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      adminId: DataTypes.INTEGER,
      date: DataTypes.DATE,
      price: DataTypes.INTEGER,
      status: DataTypes.BOOLEAN,
      imgUrl: DataTypes.STRING,
      videoUrl: DataTypes.STRING,
      duration: DataTypes.INTEGER,
      meetingPoint: DataTypes.STRING,
      province: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Trip",
    }
  );
  return Trip;
};

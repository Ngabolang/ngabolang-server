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
    static async createTrips(body, adminId) {
      const t = await sequelize.transaction();
      try {
        const Destination = sequelize.models.Destination;
        const trip = await Trip.create(
          {
            name: body.name,
            chatId: body.name,
            categoryId: body.categoryId,
            adminId: adminId,
            date: body.date,
            price: body.price,
            status: false,
            imgUrl: body.imgUrl,
            videoUrl: body.videoUrl,
            duration: body.duration,
            meetingPoint: body.meetingPoint,
            location: body.location,
            limit: body.limit,
            description: body.description,
          },
          { transaction: t }
        );

        const destinations = body.destinations.map((destination) => {
          const obj = {
            tripId: trip.id,
            name: destination.name,
            imgUrl: destination.imgUrl,
            labelDay: destination.labelDay,
            startHour: destination.startHour,
            longitude: destination.longitude,
            latitude: destination.latitude,
            activity: destination.activity,
          };
          return obj;
        });
        const destination = await Destination.bulkCreate(destinations, {
          transaction: t,
        });
        await t.commit();
      } catch (error) {
        console.log(error);
        await t.rollback();
      }
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
      location: DataTypes.STRING,
      limit: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      chatId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Trip",
    }
  );
  Trip.beforeCreate((trip, options) => {
    trip.chatId = trip.name.toLowerCase().split(" ").join("-") + trip.id;
  });
  return Trip;
};

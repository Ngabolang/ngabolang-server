const { Trip, TripGroup } = require("../models");

async function authorization(req, res, next) {
  try {
    const tripId = req.params.tripId;
    const tripgroup = await TripGroup.findOne({
      where: {
        customerId: req.user.id,
        tripId: tripId,
      },
      include: [
        {
          model: Trip,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!tripgroup) {
      throw {
        name: "dataNotFound",
      };
    }

    if (!tripgroup.paymentStatus) {
      throw { name: "forbidden" };
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authorization;

const { Category, Destination, Trip, TripGroup, User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
const midtransClient = require("midtrans-client");
const { Op } = require("sequelize");

class Controller {
  static async register(req, res, next) {
    try {
      const { username, email, password, photoProfile, phoneNumber, address } =
        req.body;
      const createUser = await User.create({
        username,
        email,
        password,
        role: "customer",
        photoProfile,
        phoneNumber,
        address,
      });
      res.status(201).json({
        id: createUser.id,
        email: createUser.email,
        message: `Succesfully registered`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) throw { name: "EmailIsRequired" };
      if (!password) throw { name: "PasswordIsRequired" };
      const user = await User.findOne({
        where: { email },
      });
      if (!user || !comparePassword(password, user.password)) {
        throw { name: "EmailPasswordInvalid" };
      }
      res.status(200).json({
        access_token: signToken({ id: user.id }),
        username: user.username,
        email: user.email,
        photoProfile: user.photoProfile,
        id: user.id,
        message: `${user.username} is successfully logged in`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async googleSignIn(req, res, next) {
    try {
      const googleAccessToken = req.headers.google_access_token;
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

      const ticket = await client.verifyIdToken({
        idToken: googleAccessToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      const { name, email, picture } = payload;
      const password = String(Math.random());
      const [user, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          username: name,
          email: email,
          password: password,
          role: "customer",
          photoProfile: picture,
        },
      });
      res.status(created ? 201 : 200).json({
        access_token: signToken({ id: user.id }),
        user: await User.findByPk(user.id, {
          attributes: ["id", "username", "email", "photoProfile"],
        }),
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async getTrips(req, res, next) {
    try {
      let trips;
      let { search } = req.query;
      console.log(search);
      if (search) {
        trips = await Trip.findAll({
          where: {
            name: {
              [Op.iLike]: `%${search}%`,
            },
          },
          include: [
            {
              model: Category,
            },
            {
              model: Destination,
            },
          ],
          order: [["createdAt", "DESC"]],
        });
      } else {
        trips = await Trip.findAll({
          include: [
            {
              model: Category,
            },
            {
              model: Destination,
            },
          ],
          order: [["createdAt", "DESC"]],
        });
      }
      if (trips.length == 0) throw { name: "dataNotFound" };
      res.status(200).json(trips);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getTripsByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const trips = await Trip.findAll({
        include: [
          {
            model: Category,
            where: { name: category },
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (trips.length == 0) throw { name: "dataNotFound" };
      res.status(200).json(trips);
    } catch (error) {
      next(error);
    }
  }

  static async getTripsById(req, res, next) {
    try {
      const { id } = req.params;
      const trips = await Trip.findAll({
        where: { id },
        include: [
          {
            model: Category,
          },
          {
            model: Destination,
          },
          {
            model: TripGroup,
            include: [
              {
                model: User,
                attributes: { exclude: "password" },
              },
            ],
          },
          {
            model: User,
            attributes: { exclude: "password" },
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (trips.length == 0) throw { name: "dataNotFound" };
      res.status(200).json(trips);
    } catch (error) {
      next(error);
    }
  }

  static async getMyTrip(req, res, next) {
    try {
      const tripgroups = await TripGroup.findAll({
        where: {
          customerId: req.user.id,
        },
        include: [
          {
            model: Trip,
            include: [
              {
                model: User,
                attributes: { exclude: "password" },
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (tripgroups.length == 0) throw { name: "dataNotFound" };
      res.status(200).json(tripgroups);
    } catch (error) {
      next(error);
    }
  }

  static async getUserBytripId(req, res, next) {
    try {
      const { tripId } = req.params;
      const user = await User.findAll({
        include: [
          {
            model: TripGroup,
            where: { tripId },
          },
        ],
        attributes: { exclude: "password" },
        order: [["createdAt", "DESC"]],
      });
      if (user.length == 0) throw { name: "dataNotFound" };
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async createTripGroup(req, res, next) {
    try {
      const { tripId } = req.params;

      const isBuy = await TripGroup.findOne({
        where: {
          customerId: req.user.id,
          tripId: tripId,
        },
      });
      if (isBuy)
        throw {
          name: "buy",
        };

      const tripgroup = await TripGroup.create({
        tripId: tripId,
        customerId: req.user.id,
        paymentStatus: false,
        review: null,
        rating: 0,
      });
      res.status(201).json(tripgroup);
    } catch (error) {
      next(error);
    }
  }

  static async payment(req, res, next) {
    try {
      const { tripId } = req.params;
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
      if (!tripgroup) throw { name: "dataNotFound" };
      tripgroup.paymentStatus = true;
      const patchedTripgroup = await tripgroup.save();

      res.status(200).json(patchedTripgroup);
    } catch (error) {
      next(error);
    }
  }
  static async midtrans(req, res, next) {
    try {
      const { tripId } = req.params;
      const tripgroup = await TripGroup.findOne({
        where: {
          customerId: req.user.id,
          tripId: tripId,
        },
        include: [
          {
            model: Trip,
          },
          {
            model: User,
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (!tripgroup) throw { name: "dataNotFound" };
      if (tripgroup.paymentStatus === true) throw { name: "forbidden" };

      //generate midtrans token
      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      let parameter = {
        transaction_details: {
          order_id: "TRX6661-" + Math.floor(100000 + Math.random() * 900000),
          gross_amount: tripgroup.Trip.price,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          email: tripgroup.User.email,
        },
      };

      let midtransToken = await snap.createTransaction(parameter);
      res.status(201).json(midtransToken);
    } catch (error) {
      next(error);
    }
  }

  static async review(req, res, next) {
    try {
      const { id } = req.params;
      const { review, rating } = req.body;
      const tripgroup = await TripGroup.findOne({
        where: {
          customerId: req.user.id,
          id: id,
        },
        include: [
          {
            model: Trip,
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (!tripgroup) throw { name: "dataNotFound" };
      tripgroup.set({
        review,
        rating,
      });
      const updatedTripgroud = await tripgroup.save();
      res.status(200).json(updatedTripgroud);
    } catch (error) {
      next(error);
    }
  }

  static async getAllTripGroups(req, res, next) {
    try {
      const tripgroups = await TripGroup.findAll({
        where: {
          review: {
            [Op.or]: {
              [Op.ne]: null,
              [Op.ne]: "",
            },
          },
        },
        include: [
          {
            model: User,
            attributes: { exclude: "password" },
          },
          {
            model: Trip,
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json(tripgroups);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getAllCategories(req, res, next) {
    try {
      const categories = await Category.findAll({
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;

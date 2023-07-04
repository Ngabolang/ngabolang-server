const { User, Trip, Category, Destination, TripGroup } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class Controller {
  static async register(req, res, next) {
    try {
      const { username, email, password, photoProfile, phoneNumber, address } =
        req.body;
      const createUser = await User.create({
        username,
        email,
        password,
        role: "admin",
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
        message: `${user.username} is successfully logged in`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTrip(req, res, next) {
    try {
      const trips = await Trip.findAll({
        include: [
          {
            model: Category,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: User,
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
          },
          {
            model: Destination,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: TripGroup,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      });
      res.status(200).json(trips);
    } catch (error) {
      next(error);
    }
  }

  static async getTripById(req, res, next) {
    try {
      const { id } = req.params;
      const trip = await Trip.findByPk(id, {
        include: [
          {
            model: Category,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: User,
            attributes: { exclude: ["password", "createdAt", "updatedAt"] },
          },
          {
            model: Destination,
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
          {
            model: TripGroup,
            include: {
              model: User,
              attributes: ["username", "email", "photoProfile"],
            },
            attributes: { exclude: ["createdAt", "updatedAt"] },
          },
        ],
      });
      res.status(200).json(trip);
    } catch (error) {
      next(error);
    }
  }

  static async createTrip(req, res, next) {
    try {
      const newTrip = await Trip.createTrips(req.body, req.user.id);
      res.status(201).json({ message: "success add trips" });
    } catch (error) {
      next(error);
    }
  }

  static async editTrip(req, res, next) {
    try {
      const { id } = req.params;
      const {
        name,
        categoryId,
        adminId,
        date,
        price,
        status,
        imgUrl,
        videoUrl,
        duration,
        meetingPoint,
        location,
        limit,
        description,
      } = req.body;
      const trip = await Trip.findOne({ where: { id } });
      if (!trip) throw { name: "dataNotFound" };
      const updateTrip = await Trip.update(
        {
          name,
          categoryId,
          adminId: req.user.id,
          date,
          price,
          status,
          imgUrl,
          videoUrl,
          duration,
          meetingPoint,
          location,
          limit,
          description,
        },
        { where: { id } }
      );
      res.status(201).json({
        message: `success edit trips with id ${id}`,
        trip: updateTrip,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTrip(req, res, next) {
    try {
      const { id } = req.params;
      const deleteTrip = await Trip.destroy({ where: { id } });
      res.status(200).json({ message: `success delete trip with id ${id}` });
    } catch (error) {
      next(error);
    }
  }

  //category section
  static async getCategory(req, res, next) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
  static async createCategory(req, res, next) {
    try {
      const { name, imgUrl } = req.body;
      const newCategory = await Category.create({
        name,
        imgUrl,
      });
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
      // res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      // const movie = await Movie.findOne({ where: id });
      const deleteCategory = await Category.destroy({ where: { id } });
      res
        .status(200)
        .json({ message: `success delete category with id ${id}` });
    } catch (error) {
      next(error);
    }
  }
  static async editCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name, imgUrl } = req.body;
      req.body;
      const category = await Category.findOne({ where: { id } });
      if (!category || category == null) throw { name: "dataNotFound" };
      const updateCategory = await Category.update(
        {
          name,
          imgUrl,
        },
        { where: { id } }
      );
      res.status(201).json({ message: `success edit category with id ${id}` });
    } catch (error) {
      next(error);
    }
  }

  //user section
  static async getLoggedInUser(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
      });
      if (!user || user === null) throw { name: "dataNotFound" };
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const tripToUpdate = await Trip.findOne({ where: { id } });

      if (!tripToUpdate) throw { name: "dataNotFound" };

      const updatedTripStatus = await Trip.update(
        { status },
        { where: { id } }
      );
      res.status(200).json({ message: "Success update trip status" });
    } catch (error) {
      next(error);
    }
  }

  //destination section
  static async getDestinationByTripId(req, res, next) {
    try {
      const { tripId } = req.params;
      const destinations = await Destination.findAll({ where: { tripId } });
      res.status(200).json(destinations);
    } catch (error) {
      next(error);
    }
  }

  static async getTripByChatId(req, res, next) {
    try {
      const { chatId } = req.params;
      const tripToFind = await Trip.findOne({
        where: { chatId },
        attributes: ["name", "imgUrl"],
      });
      res.status(200).json(tripToFind);
    } catch (error) {
      next(error);
    }
  }
}

//user section

module.exports = Controller;

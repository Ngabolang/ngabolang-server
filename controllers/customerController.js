const { User } = require("../models");
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
      console.log(error);
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
}

module.exports = Controller;

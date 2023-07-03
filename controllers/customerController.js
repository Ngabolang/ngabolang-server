// const { User } = require("../models");
// const { comparePassword } = require("../helpers/bcrypt");
// const { signToken } = require("../helpers/jwt");
// const { OAuth2Client } = require("google-auth-library");

// class Controller {
//   static async register(req, res, next) {
//     try {
//       const { username, email, password, photoProfile, phoneNumber, address } =
//         req.body;
//       const createUser = await User.create({
//         username,
//         email,
//         password,
//         role: "customer",
//         photoProfile,
//         phoneNumber,
//         address,
//       });
//       res.status(201).json({
//         id: createUser.id,
//         email: createUser.email,
//         message: `Succesfully registered`,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   static async login(req, res, next) {
//     try {
//       const { email, password } = req.body;
//       if (!email) throw { name: "EmailIsRequired" };
//       if (!password) throw { name: "PasswordIsRequired" };
//       const user = await User.findOne({
//         where: { email },
//       });
//       if (!user || !comparePassword(password, user.password)) {
//         throw { name: "EmailPasswordInvalid" };
//       }
//       res.status(200).json({
//         access_token: signToken({ id: user.id }),
//         username: user.username,
//         email: user.email,
//         message: `${user.username} is successfully logged in`,
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   static async googleSignIn(req, res, next) {
//     try {
//       const googleAccessToken = req.headers.google_access_token;
//       const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//       const ticket = await client.verifyIdToken({
//         idToken: googleAccessToken,
//         audience: process.env.GOOGLE_CLIENT_ID,
//       });

//       const payload = ticket.getPayload();

//       const { name, email } = payload;
//       const password = String(Math.random());
//       const [user, created] = await User.findOrCreate({
//         where: { email },
//         defaults: {
//           username: name,
//           email: email,
//           password: password,
//           role: "customer",
//         },
//       });

//       res.status(created ? 201 : 200).json({
//         access_token: signToken({ id: user.id }),
//         user: await User.findByPk(user.id, {
//           attributes: ["id", "username", "email"],
//         }),
//       });
//     } catch (err) {
//       next(err);
//     }
//   }
// }

// module.exports = Controller;

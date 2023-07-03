const jwt = require("jsonwebtoken");
const secretKey = "memek";
// const secretKey = process.env.SECRET_KEY;

module.exports = {
  signToken: (payload) => jwt.sign(payload, secretKey),
  decodeToken: (token) => jwt.verify(token, secretKey),
};

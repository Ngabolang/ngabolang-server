const router = require("express").Router();
const Controller = require("../controllers/adminController");
const authentication = require("../middlewares/authentication");

router.post("/login", Controller.login);
router.post("/register", authentication, Controller.register);

module.exports = router;

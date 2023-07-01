const router = require("express").Router();
const Controller = require("../controllers/customerController");

router.post("/register", Controller.register);
router.post("/login", Controller.login);

module.exports = router;

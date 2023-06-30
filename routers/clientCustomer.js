const router = require("express").Router();
const Controller = require("../controllers/customerController");

router.get("/", Controller.test);

module.exports = router;

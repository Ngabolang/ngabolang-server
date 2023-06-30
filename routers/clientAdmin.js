const router = require("express").Router();
const Controller = require("../controllers/adminController");

router.get("/", Controller.test);

module.exports = router;

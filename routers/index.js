const router = require("express").Router();
const routerAdmin = require("./clientAdmin");
const routerCustomer = require("./clientCustomer");

// ServerClientAdmin
router.use("/admin", routerAdmin);

//ServerClientUser
router.use("/customer", routerCustomer);

module.exports = router;

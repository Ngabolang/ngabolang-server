const router = require("express").Router();
const Controller = require("../controllers/adminController");
const authentication = require("../middlewares/authentication");

router.post("/login", Controller.login);
router.post("/register", authentication, Controller.register);

//TRIP section
router.get("/trip", authentication, Controller.getTrip);
router.post("/trip", authentication, Controller.createTrip);
router.get("/trip/close", authentication, Controller.getCloseTrip);
router.get("/trip/:id", authentication, Controller.getTripById);
router.put("/trip/:id", authentication, Controller.editTrip);
router.delete("/trip/:id", authentication, Controller.deleteTrip);
router.patch("/trip/:id", authentication, Controller.updateStatus);
router.get(
  "/destination/:tripId",
  authentication,
  Controller.getDestinationByTripId
);
router.get("/chat/:chatId", authentication, Controller.getTripByChatId);

// CATEGORY section
router.get("/category", authentication, Controller.getCategory);
router.post("/category", authentication, Controller.createCategory);
router.put("/category/:id", authentication, Controller.editCategory);
router.delete("/category/:id", authentication, Controller.deleteCategory);

router.get("/user", authentication, Controller.getLoggedInUser);

module.exports = router;

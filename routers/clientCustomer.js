const router = require("express").Router();
const Controller = require("../controllers/customerController");
const authentication = require("../middlewares/authentication");

router.post("/register", Controller.register);
router.post("/login", Controller.login);
router.post("/google-sign-in", Controller.googleSignIn);
router.get("/trip", Controller.getTrips);
router.get("/trip-by-category/:category", Controller.getTripsByCategory);
router.get("/trip-by-id/:id", Controller.getTripsById);
router.get("/my-trip", authentication, Controller.getMyTrip);
router.get("/user/:tripId", Controller.getUserBytripId);
router.post("/buy-trip/:tripId", authentication, Controller.createTripGroup);
router.patch("/payment/:tripId", authentication, Controller.payment);
router.post("/midtrans/:tripId", authentication, Controller.midtrans);
router.put("/review/:id", authentication, Controller.review);
router.get("/review", Controller.getAllTripGroups);
router.get("/category", Controller.getAllCategories);

module.exports = router;

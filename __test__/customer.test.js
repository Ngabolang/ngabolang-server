const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { signToken } = require("../helpers/jwt");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");

beforeAll(async () => {
  await sequelize.queryInterface.bulkInsert(
    "Users",
    require("../data/user.json").map((el) => {
      el.createdAt = el.updatedAt = new Date();
      el.password = hashPassword(el.password);
      return el;
    })
  );

  await sequelize.queryInterface.bulkInsert(
    "Categories",
    require("../data/category.json").map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    })
  );

  await sequelize.queryInterface.bulkInsert(
    "Trips",
    require("../data/trip.json").map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    })
  );

  await sequelize.queryInterface.bulkInsert(
    "Destinations",
    require("../data/destination.json").map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    })
  );

  await sequelize.queryInterface.bulkInsert(
    "TripGroups",
    require("../data/tripgroup.json").map((el) => {
      el.createdAt = el.updatedAt = new Date();
      return el;
    })
  );
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await sequelize.queryInterface.bulkDelete("Categories", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await sequelize.queryInterface.bulkDelete("Trips", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await sequelize.queryInterface.bulkDelete("Destinations", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await sequelize.queryInterface.bulkDelete("Trips", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });

  await sequelize.queryInterface.bulkDelete("TripGroups", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("Register POST /customer/register", () => {
  test("Successfully registered", async () => {
    const response = await request(app).post("/customer/register").send({
      username: "blestrohuta",
      email: "blestro@example.com",
      password: "blestro",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("email", expect.any(String));
    expect(response.body).toHaveProperty("message", expect.any(String));
    expect(response.body.message).toEqual("Succesfully registered");
  });
  test("Email not provided / not entered", async () => {
    const response = await request(app).post("/customer/register").send({
      username: "blestrohuta",
      password: "blestro",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email is required");
  });
  test("Password not provided / not entered", async () => {
    const response = await request(app).post("/customer/register").send({
      username: "blestrohuta",
      email: "blestro@example.com",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Password is required");
  });
  test("Username not provided / not entered", async () => {
    const response = await request(app).post("/customer/register").send({
      email: "blestro@example.com",
      password: "blestro",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Username is required");
  });
  test("Empty string provided for email", async () => {
    const response = await request(app).post("/customer/register").send({
      username: "blestrohuta",
      email: "",
      password: "blestro",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email is required");
  });
  test("Empty string provided for password", async () => {
    const response = await request(app).post("/customer/register").send({
      username: "blestrohuta",
      email: "blestro@example.com",
      password: "",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Password is required");
  });
  test("Empty string provided for username", async () => {
    const response = await request(app).post("/customer/register").send({
      username: "",
      email: "blestro@example.com",
      password: "blestro",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Username is required");
  });
  test("Email already registered", async () => {
    const response = await request(app).post("/customer/register").send({
      username: "john_doe",
      email: "johndoe@example.com",
      password: "password123",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("This email is already registered");
  });
  test("Invalid email format", async () => {
    const response = await request(app).post("/customer/register").send({
      username: "blestrohuta",
      email: "blestro@example",
      password: "blestro",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email must be email format");
  });
  test("Password length below 5", async () => {
    const response = await request(app).post("/customer/register").send({
      username: "blestrohuta",
      email: "blestro@example",
      password: "bles",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "The minimum password length is 5 characters"
    );
  });
});

describe("POST /login", () => {
  test("Successfully logged in", async () => {
    const response = await request(app).post("/customer/login").send({
      email: "johndoe@example.com",
      password: "password123",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    let access_token = response.body.access_token;
  });
  test("Incorrect password provided", async () => {
    const response = await request(app).post("/customer/login").send({
      email: "johndoe@example.com",
      password: "password12",
    });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "email or password is invalid",
    });
  });
  test("Email entered is not registered in the database", async () => {
    const response = await request(app).post("/customer/login").send({
      email: "johndoe@example.co",
      password: "password12",
    });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "email or password is invalid",
    });
  });
});

describe("GET Trips customer/trip", () => {
  test("Successfully fetch the Main Entity Trips", async () => {
    const response = await request(app).get("/customer/trip");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body[0]).toHaveProperty("Category");
    expect(response.body[0].Category).toHaveProperty("id", expect.any(Number));
    expect(response.body[0].Category).toHaveProperty(
      "name",
      expect.any(String)
    );
    expect(response.body[0].Category).toHaveProperty(
      "imgUrl",
      expect.any(String)
    );
    expect(response.body[0].Category).toHaveProperty(
      "createdAt",
      expect.any(String)
    );
    expect(response.body[0].Category).toHaveProperty(
      "updatedAt",
      expect.any(String)
    );
    expect(response.body[0]).toHaveProperty("Destinations");
    response.body[0].Destinations.forEach((el) => {
      expect(el).toHaveProperty("id", expect.any(Number));
      expect(el).toHaveProperty("tripId", expect.any(Number));
      expect(el).toHaveProperty("name", expect.any(String));
      expect(el).toHaveProperty("imgUrl", expect.any(String));
      expect(el).toHaveProperty("labelDay", expect.any(Number));
      expect(el).toHaveProperty("startHour", expect.any(String));
      expect(el).toHaveProperty("longitude", expect.any(String));
      expect(el).toHaveProperty("latitude", expect.any(String));
      expect(el).toHaveProperty("activity", expect.any(String));
      expect(el).toHaveProperty("placeId", expect.any(String));
      expect(el).toHaveProperty("createdAt", expect.any(String));
      expect(el).toHaveProperty("updatedAt", expect.any(String));
    });
  });
});

describe("GET trip by category /trip-by-category/:category", () => {
  test("Successfully fetch trips by category", async () => {
    const category = "Beaches";

    const response = await request(app).get(
      `/customer/trip-by-category/${category}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);

    const trip = response.body[0];
    expect(trip).toHaveProperty("id");
    expect(trip).toHaveProperty("name", expect.any(String));
    expect(trip).toHaveProperty("categoryId", expect.any(Number));
    expect(trip).toHaveProperty("adminId", expect.any(Number));
    expect(trip).toHaveProperty("date", expect.any(String));
    expect(trip).toHaveProperty("price", expect.any(Number));
    expect(trip).toHaveProperty("status", expect.any(Boolean));
    expect(trip).toHaveProperty("imgUrl", expect.any(String));
    expect(trip).toHaveProperty("videoUrl", expect.any(String));
    expect(trip).toHaveProperty("duration", expect.any(Number));
    expect(trip).toHaveProperty("meetingPoint", expect.any(String));
    expect(trip).toHaveProperty("location", expect.any(String));
    expect(trip).toHaveProperty("limit", expect.any(Number));
    expect(trip).toHaveProperty("description", expect.any(String));
    expect(trip).toHaveProperty("chatId", expect.any(String));
    expect(trip).toHaveProperty("createdAt", expect.any(String));
    expect(trip).toHaveProperty("updatedAt", expect.any(String));
    expect(trip).toHaveProperty("Category");
    expect(trip.Category).toHaveProperty("id", expect.any(Number));
    expect(trip.Category).toHaveProperty("name", expect.any(String));
    expect(trip.Category).toHaveProperty("imgUrl", expect.any(String));
    expect(trip.Category).toHaveProperty("createdAt", expect.any(String));
    expect(trip.Category).toHaveProperty("updatedAt", expect.any(String));
  });

  test("Should return an empty array if category not found", async () => {
    const category = "Non-existent Category"; // replace with a non-existent category

    const response = await request(app).get(
      `/customer/trip-by-category/${category}`
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "data not found",
    });
  });
});

describe("GET /trip-by-id/:id", () => {
  test("Successfully fetch trip by id", async () => {
    const id = 1; // replace with the desired id

    const response = await request(app).get(`/customer/trip-by-id/${id}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);

    const trip = response.body[0];
    expect(trip).toHaveProperty("id", id);
    expect(trip).toHaveProperty("name", expect.any(String));
    expect(trip).toHaveProperty("categoryId", expect.any(Number));
    expect(trip).toHaveProperty("adminId", expect.any(Number));
    expect(trip).toHaveProperty("date", expect.any(String));
    expect(trip).toHaveProperty("price", expect.any(Number));
    expect(trip).toHaveProperty("status", expect.any(Boolean));
    expect(trip).toHaveProperty("imgUrl", expect.any(String));
    expect(trip).toHaveProperty("videoUrl", expect.any(String));
    expect(trip).toHaveProperty("duration", expect.any(Number));
    expect(trip).toHaveProperty("meetingPoint", expect.any(String));
    expect(trip).toHaveProperty("location", expect.any(String));
    expect(trip).toHaveProperty("limit", expect.any(Number));
    expect(trip).toHaveProperty("description", expect.any(String));
    expect(trip).toHaveProperty("chatId", expect.any(String));
    expect(trip).toHaveProperty("createdAt", expect.any(String));
    expect(trip).toHaveProperty("updatedAt", expect.any(String));
    expect(trip).toHaveProperty("Category");
    expect(trip.Category).toHaveProperty("id", expect.any(Number));
    expect(trip.Category).toHaveProperty("name", expect.any(String));
    expect(trip.Category).toHaveProperty("imgUrl", expect.any(String));
    expect(trip.Category).toHaveProperty("createdAt", expect.any(String));
    expect(trip.Category).toHaveProperty("updatedAt", expect.any(String));
    expect(trip).toHaveProperty("Destinations");
    expect(trip.Destinations).toBeInstanceOf(Array);
    trip.Destinations.forEach((el) => {
      expect(el).toHaveProperty("id", expect.any(Number));
      expect(el).toHaveProperty("tripId", id);
      expect(el).toHaveProperty("name", expect.any(String));
      expect(el).toHaveProperty("imgUrl", expect.any(String));
      expect(el).toHaveProperty("labelDay", expect.any(Number));
      expect(el).toHaveProperty("startHour", expect.any(String));
      expect(el).toHaveProperty("longitude", expect.any(String));
      expect(el).toHaveProperty("latitude", expect.any(String));
      expect(el).toHaveProperty("activity", expect.any(String));
      expect(el).toHaveProperty("placeId", expect.any(String));
      expect(el).toHaveProperty("createdAt", expect.any(String));
      expect(el).toHaveProperty("updatedAt", expect.any(String));
    });
    expect(trip).toHaveProperty("TripGroups");
    expect(trip.TripGroups).toBeInstanceOf(Array);
    trip.TripGroups.forEach((el) => {
      expect(el).toHaveProperty("id", expect.any(Number));
      expect(el).toHaveProperty("tripId", id);
      expect(el).toHaveProperty("customerId", expect.any(Number));
      expect(el).toHaveProperty("review", expect.any(String));
      expect(el).toHaveProperty("rating", expect.any(Number));
      expect(el).toHaveProperty("paymentStatus", expect.any(Boolean));
      expect(el).toHaveProperty("createdAt", expect.any(String));
      expect(el).toHaveProperty("updatedAt", expect.any(String));
    });
  });

  test("Should return an error if trip not found", async () => {
    const id = 999; // replace with a non-existent id

    const response = await request(app).get(`/customer/trip-by-id/${id}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "data not found",
    });
  });
});

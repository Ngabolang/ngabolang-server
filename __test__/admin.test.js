const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { User, Destination, Trip, Category } = require("../models");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

// let validToken;
let access_token;
// let chatId = "wisata-labuan-bajo-sailing-komodo";
const newTrip = {
  name: "Trip to Lembang",
  categoryId: 1,
  date: "2023-08-17",
  price: 3500000,
  imgUrl:
    "https://res.klook.com/image/upload/Mobile/City/rv76yqukp2hey0fckh99.jpg",
  videoUrl: "https://www.youtube.com/watch?v=kQIri35Yjds",
  duration: 3,
  meetingPoint: "Jakarta",
  location: "Bandung",
  limit: 3,
  description: "Trip seru banget di lembang guys",
  destinations: [
    {
      name: "Gunung Tangkuban Perahu",
      imgUrl:
        "https://lh5.googleusercontent.com/p/AF1QipPaE5Bmj1nDSYGuDWEZRrhUx9NFEnQ1AOL-Chrs=w408-h306-k-no",
      labelDay: 1,
      startHour: "09:00",
      longitude: "-8.54673581674982",
      latitude: "119.81622416875352",
      activity: "manjat gunung",
    },
    {
      name: "Gunung Tangkuban Perahu",
      imgUrl:
        "https://lh5.googleusercontent.com/p/AF1QipPaE5Bmj1nDSYGuDWEZRrhUx9NFEnQ1AOL-Chrs=w408-h306-k-no",
      labelDay: 1,
      startHour: "09:00",
      longitude: "-8.54673581674982",
      latitude: "119.81622416875352",
      activity: "manjat gunung",
    },
    {
      name: "Gunung Tangkuban Perahu",
      imgUrl:
        "https://lh5.googleusercontent.com/p/AF1QipPaE5Bmj1nDSYGuDWEZRrhUx9NFEnQ1AOL-Chrs=w408-h306-k-no",
      labelDay: 1,
      startHour: "09:00",
      longitude: "-8.54673581674982",
      latitude: "119.81622416875352",
      activity: "manjat gunung",
    },
  ],
};

const newCategory = {
  name: "new Category",
  imgUrl:
    "https://img.freepik.com/premium-photo/bonfire-near-camping-tents-outdoors-night_495423-58159.jpg?size=626&ext=jpg&uid=R41671461&ga=GA1.2.468604856.1683977961&semt=sph",
};
const user1 = {
  username: "newAdmin",
  email: "newAdmin@email.com",
  password: "newAdmin",
  photoProfile: "photoAdmin",
  phoneNumber: "08212126",
  address: "Jalan new Admin",
};
// const user2 = {
//   username: "userTest",
//   email: "userTest@email.com",
//   password: "userTest",
//   photoProfile:
//     "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&ga=GA1.1.468604856.1683977961&semt=ais",
//   phoneNumber: "085208520852",
//   address: "123 Main Street",
// };

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

// POST /admin/login
describe("POST /admin/login", () => {
  test("should login with existing data and return 200", async () => {
    const response = await request(app).post("/admin/login").send({
      email: "jacksondavis@example.com",
      password: "password789",
    });

    //matchers
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
    expect(response.body).toHaveProperty("username", expect.any(String));
    expect(response.body).toHaveProperty("email", expect.any(String));
    expect(response.body).toHaveProperty("message", expect.any(String));
    access_token = response.body.access_token;
  });

  test("400 Falied login - should return error if email is null", async () => {
    const response = await request(app).post("/admin/login").send({
      password: "password123",
    });

    //matchers
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  test("400 Falied login - should return error if password is null", async () => {
    const response = await request(app).post("/admin/login").send({
      email: "johndoe@example.com",
    });

    //matchers
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  test("401 Falied login - should return error if wrong email format", async () => {
    const response = await request(app).post("/admin/login").send({
      email: "random",
      password: "password123",
    });

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "email or password is invalid"
    );
  });

  test("401 Falied login - should return error if email is not registered", async () => {
    const response = await request(app).post("/admin/login").send({
      email: "test@email.com",
      password: "password123",
    });

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "email or password is invalid"
    );
  });

  test("401 Falied login - should return error if password is wrong", async () => {
    const response = await request(app).post("/admin/login").send({
      email: "johndoe@example.com",
      password: "passwordsalah",
    });

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "email or password is invalid"
    );
  });
});

// POST /admin/register
describe("POST /admin/register", () => {
  test("201 Success register - should create new Admin", async () => {
    const response = await request(app)
      .post("/admin/register")
      .set("access_token", access_token)
      .send(user1);
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("email", user1.email);
    expect(response.body).toHaveProperty("message", "Succesfully registered");
  });
  test("401 Failed register - should return error if not authenticated", async () => {
    const response = await request(app)
      .post("/admin/register")
      .set("access_token", null)
      .send(user1);
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "unauthenticated");
  });
  test("400 Failed register - should return error if email is null", async () => {
    const response = await request(app)
      .post("/admin/register")
      .set("access_token", access_token)
      .send({
        username: "newAdmin",
        password: "newAdmin",
        photoProfile: "photoAdmin",
        phoneNumber: "08212126",
        address: "Jalan new Admin",
      });

    //matchers
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });
  test("400 Failed register - should return error if username is null", async () => {
    const response = await request(app)
      .post("/admin/register")
      .set("access_token", access_token)
      .send({
        email: "newAdmin@email.com",
        password: "newAdmin",
        photoProfile: "photoAdmin",
        phoneNumber: "08212126",
        address: "Jalan new Admin",
      });

    //matchers
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Username is required");
  });
  test("400 Failed register - should return error if password is null", async () => {
    const response = await request(app)
      .post("/admin/register")
      .set("access_token", access_token)
      .send({
        username: "newAdmin",
        email: "newAdmin@email.com",
        photoProfile: "photoAdmin",
        phoneNumber: "08212126",
        address: "Jalan new Admin",
      });

    //matchers
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });
  test("400 Failed register - should return error if password is not 5 chars", async () => {
    const response = await request(app)
      .post("/admin/register")
      .set("access_token", access_token)
      .send({
        username: "newAdmin",
        email: "newAdmin@email.com",
        password: "1",
        photoProfile: "photoAdmin",
        phoneNumber: "08212126",
        address: "Jalan new Admin",
      });

    //matchers
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "The minimum password length is 5 characters"
    );
  });
  test("400 Failed register - should return error if wrong email format", async () => {
    const response = await request(app)
      .post("/admin/register")
      .set("access_token", access_token)
      .send({
        username: "newAdmin",
        email: "newAdmin",
        password: "newAdmin",
        photoProfile: "photoAdmin",
        phoneNumber: "08212126",
        address: "Jalan new Admin",
      });

    //matchers
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Email must be email format"
    );
  });
  test("400 Failed register - should return error is already exists", async () => {
    const response = await request(app)
      .post("/admin/register")
      .set("access_token", access_token)
      .send({
        username: "newAdmin",
        email: "janesmith@example.com",
        password: "newAdmin",
        photoProfile: "photoAdmin",
        phoneNumber: "08212126",
        address: "Jalan new Admin",
      });

    //matchers
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "This email is already registered"
    );
  });
  test("400 Failed register - should return error if email is emtry string", async () => {
    const response = await request(app)
      .post("/admin/register")
      .set("access_token", access_token)
      .send({
        username: "newAdmin",
        email: "",
        password: "newAdmin",
        photoProfile: "photoAdmin",
        phoneNumber: "08212126",
        address: "Jalan new Admin",
      });

    //matchers
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });
  test("400 Failed register - should return error if password is empty string", async () => {
    const response = await request(app)
      .post("/admin/register")
      .set("access_token", access_token)
      .send({
        username: "newAdmin",
        email: "newAdmin@email.com",
        password: "",
        photoProfile: "photoAdmin",
        phoneNumber: "08212126",
        address: "Jalan new Admin",
      });

    //matchers
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });
  test("400 Failed register - should return error if username is empty string", async () => {
    const response = await request(app)
      .post("/admin/register")
      .set("access_token", access_token)
      .send({
        username: "",
        email: "newAdmin@email.com",
        password: "newAdmin",
        photoProfile: "photoAdmin",
        phoneNumber: "08212126",
        address: "Jalan new Admin",
      });

    //matchers
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Username is required");
  });
});

// GET /admin/trip
describe("GET Trips /admin/trip", () => {
  test("200 success get trips - should return all trips", async () => {
    const response = await request(app)
      .get("/admin/trip")
      .set("access_token", access_token);
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("name", expect.any(String));
    expect(response.body[0]).toHaveProperty("categoryId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("date", expect.any(String));
    expect(response.body[0]).toHaveProperty("price", expect.any(Number));
    expect(response.body[0]).toHaveProperty("status", expect.any(Boolean));
    expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("videoUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("duration", expect.any(Number));
    expect(response.body[0]).toHaveProperty("meetingPoint", expect.any(String));
    expect(response.body[0]).toHaveProperty("location", expect.any(String));
    expect(response.body[0]).toHaveProperty("limit", expect.any(Number));
    expect(response.body[0]).toHaveProperty("description", expect.any(String));
    expect(response.body[0]).toHaveProperty("chatId", expect.any(String));
    expect(response.body[0]).toHaveProperty("createdAt", expect.any(String));
    expect(response.body[0]).toHaveProperty("updatedAt", expect.any(String));

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
    expect(response.body[0]).toHaveProperty("User");
    expect(response.body[0].User).toHaveProperty("id", expect.any(Number));
    expect(response.body[0].User).toHaveProperty(
      "username",
      expect.any(String)
    );
    expect(response.body[0].User).toHaveProperty("role", expect.any(String));
    expect(response.body[0].User).toHaveProperty(
      "photoProfile",
      expect.any(String)
    );
    expect(response.body[0].User).toHaveProperty(
      "phoneNumber",
      expect.any(String)
    );
    expect(response.body[0].User).toHaveProperty("address", expect.any(String));

    expect(response.body[0]).toHaveProperty("Destinations");
    expect(response.body[0].Destinations[0]).toHaveProperty(
      "id",
      expect.any(Number)
    );
    expect(response.body[0].Destinations[0]).toHaveProperty(
      "tripId",
      expect.any(Number)
    );
    expect(response.body[0].Destinations[0]).toHaveProperty(
      "imgUrl",
      expect.any(String)
    );
    expect(response.body[0].Destinations[0]).toHaveProperty(
      "labelDay",
      expect.any(Number)
    );
    expect(response.body[0].Destinations[0]).toHaveProperty(
      "startHour",
      expect.any(String)
    );
    expect(response.body[0].Destinations[0]).toHaveProperty(
      "longitude",
      expect.any(String)
    );
    expect(response.body[0].Destinations[0]).toHaveProperty(
      "latitude",
      expect.any(String)
    );
    expect(response.body[0].Destinations[0]).toHaveProperty(
      "activity",
      expect.any(String)
    );
    expect(response.body[0].Destinations[0]).toHaveProperty(
      "placeId",
      expect.any(String)
    );
    expect(response.body[0]).toHaveProperty("TripGroups");
    expect(response.body[0].TripGroups[0]).toHaveProperty(
      "id",
      expect.any(Number)
    );
    expect(response.body[0].TripGroups[0]).toHaveProperty(
      "tripId",
      expect.any(Number)
    );
    expect(response.body[0].TripGroups[0]).toHaveProperty(
      "customerId",
      expect.any(Number)
    );
    expect(response.body[0].TripGroups[0]).toHaveProperty(
      "review",
      expect.any(String)
    );
    expect(response.body[0].TripGroups[0]).toHaveProperty(
      "paymentStatus",
      expect.any(Boolean)
    );
  });
  test("401 Failed get all trips - should return error if not authenticated", async () => {
    const response = await request(app)
      .get("/admin/trip")
      .set("access_token", null);
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "unauthenticated");
  });
});

// GET /admin/trip/:id
describe("GET /admin/trip/:id", () => {
  test("200 success get trips - should return all trips", async () => {
    const response = await request(app)
      .get("/admin/trip/1")
      .set("access_token", access_token);
    //   .set(access_token)
    //matchers
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("name", expect.any(String));
    expect(response.body).toHaveProperty("categoryId", expect.any(Number));
    expect(response.body).toHaveProperty("adminId", expect.any(Number));
    expect(response.body).toHaveProperty("date", expect.any(String));
    expect(response.body).toHaveProperty("price", expect.any(Number));
    expect(response.body).toHaveProperty("status", expect.any(Boolean));
    expect(response.body).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body).toHaveProperty("videoUrl", expect.any(String));
    expect(response.body).toHaveProperty("duration", expect.any(Number));
    expect(response.body).toHaveProperty("meetingPoint", expect.any(String));
    expect(response.body).toHaveProperty("location", expect.any(String));
    expect(response.body).toHaveProperty("limit", expect.any(Number));
    expect(response.body).toHaveProperty("description", expect.any(String));
    expect(response.body).toHaveProperty("chatId", expect.any(String));
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
    expect(response.body).toHaveProperty("updatedAt", expect.any(String));
    expect(response.body).toHaveProperty("Category");
    expect(response.body.Category).toHaveProperty("id", expect.any(Number));
    expect(response.body.Category).toHaveProperty("name", expect.any(String));
    expect(response.body.Category).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body).toHaveProperty("User");
    expect(response.body.User).toHaveProperty("id", expect.any(Number));
    expect(response.body.User).toHaveProperty("username", expect.any(String));
    expect(response.body.User).toHaveProperty("email", expect.any(String));
    expect(response.body.User).toHaveProperty("role", expect.any(String));
    expect(response.body.User).toHaveProperty(
      "photoProfile",
      expect.any(String)
    );
    expect(response.body.User).toHaveProperty(
      "phoneNumber",
      expect.any(String)
    );
    expect(response.body.User).toHaveProperty("address", expect.any(String));
    expect(response.body).toHaveProperty("Destinations");
    expect(response.body.Destinations[0]).toHaveProperty(
      "id",
      expect.any(Number)
    );
    expect(response.body.Destinations[0]).toHaveProperty(
      "tripId",
      expect.any(Number)
    );
    expect(response.body.Destinations[0]).toHaveProperty(
      "name",
      expect.any(String)
    );
    expect(response.body.Destinations[0]).toHaveProperty(
      "imgUrl",
      expect.any(String)
    );
    expect(response.body.Destinations[0]).toHaveProperty(
      "labelDay",
      expect.any(Number)
    );
    expect(response.body.Destinations[0]).toHaveProperty(
      "startHour",
      expect.any(String)
    );
    expect(response.body.Destinations[0]).toHaveProperty(
      "longitude",
      expect.any(String)
    );
    expect(response.body.Destinations[0]).toHaveProperty(
      "latitude",
      expect.any(String)
    );
    expect(response.body.Destinations[0]).toHaveProperty(
      "activity",
      expect.any(String)
    );
    expect(response.body.Destinations[0]).toHaveProperty(
      "placeId",
      expect.any(String)
    );
    expect(response.body).toHaveProperty("TripGroups");
    expect(response.body.TripGroups[0]).toHaveProperty(
      "id",
      expect.any(Number)
    );
    expect(response.body.TripGroups[0]).toHaveProperty(
      "tripId",
      expect.any(Number)
    );
    expect(response.body.TripGroups[0]).toHaveProperty(
      "customerId",
      expect.any(Number)
    );
    expect(response.body.TripGroups[0]).toHaveProperty(
      "review",
      expect.any(String)
    );
    expect(response.body.TripGroups[0]).toHaveProperty(
      "paymentStatus",
      expect.any(Boolean)
    );
    chatId = response.body.chatId;
  });
  test("401 Failed get all trips - should return error if not authenticated", async () => {
    const response = await request(app)
      .get("/admin/trip/1")
      .set("access_token", null);
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "unauthenticated");
  });
});

// POST /admin/trip
describe("POST new Trip /admin/trip", () => {
  test("201 success post trip - should create new trip", async () => {
    const response = await request(app)
      .post("/admin/trip")
      .set("access_token", access_token)
      .send(newTrip);
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "success add trips");
  });
  test("401 Failed get all trips - should return error if not authenticated", async () => {
    const response = await request(app)
      .post("/admin/trip")
      .set("access_token", null)
      .send(newTrip);
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "unauthenticated");
  });
});

// PUT /admin/trip/:id
describe("PUT /admin/trip/:id", () => {
  const id = 1;
  test("201 success post trip - should create new trip", async () => {
    const response = await request(app)
      .put(`/admin/trip/${id}`)
      .set("access_token", access_token)
      .send({
        name: "Trip to Lembang",
        categoryId: 1,
        date: "2023-08-17",
        price: 3500000,
        imgUrl:
          "https://res.klook.com/image/upload/Mobile/City/rv76yqukp2hey0fckh99.jpg",
        videoUrl: "https://www.youtube.com/watch?v=kQIri35Yjds",
        duration: 3,
        meetingPoint: "Jakarta",
        location: "Bandung",
        limit: 3,
        description: "Trip seru banget di lembang guys",
      });
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      `success edit trips with id ${id}`
    );
  });
  test("404 failed to edit trip - should return error if data not found", async () => {
    const response = await request(app)
      .put(`/admin/trip/50000`)
      .set("access_token", access_token)
      .send({
        name: "Trip to Lembang",
        categoryId: 1,
        date: "2023-08-17",
        price: 3500000,
        imgUrl:
          "https://res.klook.com/image/upload/Mobile/City/rv76yqukp2hey0fckh99.jpg",
        videoUrl: "https://www.youtube.com/watch?v=kQIri35Yjds",
        duration: 3,
        meetingPoint: "Jakarta",
        location: "Bandung",
        limit: 3,
        description: "Trip seru banget di lembang guys",
      });
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", `data not found`);
  });
  test("401 Failed edit trip - should return error if not authenticated", async () => {
    const response = await request(app)
      .put(`/admin/trip/${id}`)
      .set("access_token", null)
      .send({
        name: "Trip to Lembang",
        categoryId: 1,
        date: "2023-08-17",
        price: 3500000,
        imgUrl:
          "https://res.klook.com/image/upload/Mobile/City/rv76yqukp2hey0fckh99.jpg",
        videoUrl: "https://www.youtube.com/watch?v=kQIri35Yjds",
        duration: 3,
        meetingPoint: "Jakarta",
        location: "Bandung",
        limit: 3,
        description: "Trip seru banget di lembang guys",
      });
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "unauthenticated");
  });
});

// DELETE /admin/trip/:id
describe("DELETE /admin/trip/:id", () => {
  const id = 1;
  test("200 success delete trip - should delete trip", async () => {
    const response = await request(app)
      .delete(`/admin/trip/${id}`)
      .set("access_token", access_token);
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      `success delete trip with id ${id}`
    );
  });
  test("401 Failed delete trip - should return error if not authenticated", async () => {
    const response = await request(app)
      .delete(`/admin/trip/${id}`)
      .set("access_token", null);
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "unauthenticated");
  });
});

// DELETE /admin/category/:id
describe("DELETE /admin/category/:id", () => {
  const id = 1;
  test("200 success delete category - should delete category", async () => {
    const response = await request(app)
      .delete(`/admin/category/${id}`)
      .set("access_token", access_token);
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      `success delete category with id ${id}`
    );
  });
  test("401 Failed delete category - should return error if not authenticated", async () => {
    const response = await request(app)
      .delete(`/admin/category/${id}`)
      .set("access_token", null);
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "unauthenticated");
  });
});

// GET /admin/category
describe("GET all categories /admin/category", () => {
  test("200 success get trips - should return all categories", async () => {
    const response = await request(app)
      .get("/admin/category")
      .set("access_token", access_token);
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("name", expect.any(String));
    expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("createdAt", expect.any(String));
    expect(response.body[0]).toHaveProperty("updatedAt", expect.any(String));
  });

  test("401 Failed get all category - should return error if not authenticated", async () => {
    const response = await request(app)
      .get("/admin/category")
      .set("access_token", null);
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "unauthenticated");
  });
});

// POST /admin/category
describe("POST new Category /admin/category", () => {
  test("201 success post trip - should create new trip", async () => {
    const response = await request(app)
      .post("/admin/category")
      .set("access_token", access_token)
      .send(newTrip);
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("name", expect.any(String));
    expect(response.body).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body).toHaveProperty("updatedAt", expect.any(String));
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
  });
  test("401 Failed create new category - should return error if not authenticated", async () => {
    const response = await request(app)
      .post("/admin/category")
      .set("access_token", null)
      .send(newTrip);
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "unauthenticated");
  });
});

// PATCH trip status /admin/trip/:id
describe("PATCH update status trip /admin/trip/:id", () => {
  test("200 success update trip status - should update trip", async () => {
    const response = await request(app)
      .patch("/admin/trip/2")
      .set("access_token", access_token)
      .send({ status: false });

    //matchers
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Success update trip status"
    );
  });
  test("404 failed to update trip status - should return error data not found", async () => {
    const response = await request(app)
      .patch("/admin/trip/5000")
      .set("access_token", access_token)
      .send({ status: false });

    //matchers
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "data not found");
  });
  test("401 Failed update trip status - should return error if not authenticated", async () => {
    const response = await request(app)
      .patch("/admin/trip/:id")
      .set("access_token", null)
      .send({ status: false });

    //   .set(access_token)

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "unauthenticated");
  });
});

// PUT update category /admin/trip/:id
describe("PUT update trip category /admin/category/:id", () => {
  const id = 2;
  test("201 success update trip category - should update category", async () => {
    const response = await request(app)
      .put(`/admin/category/${id}`)
      .set("access_token", access_token)
      .send({
        name: "new category",
        imgUrl: "photo new category",
      });

    //matchers
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      `success edit category with id ${id}`
    );
  });
  test("404 failed to update category - should return error data not found", async () => {
    const response = await request(app)
      .put(`/admin/category/50000`)
      .set("access_token", access_token)
      .send({
        name: "new category",
        imgUrl: "photo new category",
      });

    //matchers
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "data not found");
  });
  test("401 Failed update trip status - should return error if not authenticated", async () => {
    const response = await request(app)
      .put(`/admin/category/${id}`)
      .set("access_token", null)
      .send({
        name: "new category",
        imgUrl: "photo new category",
      });

    //   .set(access_token)

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "unauthenticated");
  });
});

// GET user log in /admin/user
describe("GET logged in user /admin/user", () => {
  test("200 success get user logged in - should fetch user", async () => {
    const response = await request(app)
      .get(`/admin/user`)
      .set("access_token", access_token);

    //matchers
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", expect.any(Number));
    expect(response.body).toHaveProperty("username", expect.any(String));
    expect(response.body).toHaveProperty("email", expect.any(String));
    expect(response.body).toHaveProperty("role", expect.any(String));
    expect(response.body).toHaveProperty("photoProfile", expect.any(String));
    expect(response.body).toHaveProperty("phoneNumber", expect.any(String));
    expect(response.body).toHaveProperty("address", expect.any(String));
  });
  test("401 Failed get logged in user - should return error if not authenticated", async () => {
    const response = await request(app)
      .get(`/admin/user`)
      .set("access_token", null);

    //   .set(access_token)

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "unauthenticated");
  });
});

// GET all destination by trip id /admin/destination/:tripId
describe("GET logged in user /admin/destination/:tripId", () => {
  const tripId = 2;
  test("200 success get all destinations by tripId - should fetch destinations", async () => {
    const response = await request(app)
      .get(`/admin/destination/${tripId}`)
      .set("access_token", access_token);

    //matchers
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body[0]).toHaveProperty("id", expect.any(Number));
    expect(response.body[0]).toHaveProperty("tripId", expect.any(Number));
    expect(response.body[0]).toHaveProperty("name", expect.any(String));
    expect(response.body[0]).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body[0]).toHaveProperty("labelDay", expect.any(Number));
    expect(response.body[0]).toHaveProperty("startHour", expect.any(String));
    expect(response.body[0]).toHaveProperty("longitude", expect.any(String));
    expect(response.body[0]).toHaveProperty("latitude", expect.any(String));
    expect(response.body[0]).toHaveProperty("activity", expect.any(String));
    expect(response.body[0]).toHaveProperty("placeId", expect.any(String));
    expect(response.body[0]).toHaveProperty("createdAt", expect.any(String));
    expect(response.body[0]).toHaveProperty("updatedAt", expect.any(String));
  });
  test("401 Failed get logged in user - should return error if not authenticated", async () => {
    const response = await request(app)
      .get(`/admin/destination/${tripId}`)
      .set("access_token", null);
    //   .set(access_token)

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "unauthenticated");
  });
});

describe("GET trip by chatId /admin/chat/:chatId", () => {
  const chatId = "wisata-labuan-bajo-sailing-komodo";

  test("200 success trip by chatId - should fetch user", async () => {
    const response = await request(app)
      .get(`/admin/chat/${chatId}`)
      .set("access_token", access_token);

    //matchers
    expect(response.status).toBe(200);
  });
  test("401 Failed get trip by chatId - should return error if not authenticated", async () => {
    const response = await request(app)
      .get(`/admin/chat/${chatId}`)
      .set("access_token", null);

    //matchers
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "unauthenticated");
  });
});

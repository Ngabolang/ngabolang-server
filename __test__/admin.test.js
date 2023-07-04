// const request = require("supertest");
// const app = require("../app");
// const { sequelize } = require("../models");
// const { User, Destination, Trip, Category } = require("../models");
// const { hashPassword, comparePassword } = require("../helpers/bcrypt");
// const { signToken } = require("../helpers/jwt");

// // let validToken;
// let access_token;
// const newTrip = {
//   name: "Trip to Lembang",
//   categoryId: 1,
//   date: "2023-08-17",
//   price: 3500000,
//   imgUrl:
//     "https://res.klook.com/image/upload/Mobile/City/rv76yqukp2hey0fckh99.jpg",
//   videoUrl: "https://www.youtube.com/watch?v=kQIri35Yjds",
//   duration: 3,
//   meetingPoint: "Jakarta",
//   location: "Bandung",
//   limit: 3,
//   description: "Trip seru banget di lembang guys",
//   destinations: [
//     {
//       name: "Gunung Tangkuban Perahu",
//       imgUrl:
//         "https://lh5.googleusercontent.com/p/AF1QipPaE5Bmj1nDSYGuDWEZRrhUx9NFEnQ1AOL-Chrs=w408-h306-k-no",
//       labelDay: 1,
//       startHour: "09:00",
//       longitude: "-8.54673581674982",
//       latitude: "119.81622416875352",
//       activity: "manjat gunung",
//     },
//     {
//       name: "Gunung Tangkuban Perahu",
//       imgUrl:
//         "https://lh5.googleusercontent.com/p/AF1QipPaE5Bmj1nDSYGuDWEZRrhUx9NFEnQ1AOL-Chrs=w408-h306-k-no",
//       labelDay: 1,
//       startHour: "09:00",
//       longitude: "-8.54673581674982",
//       latitude: "119.81622416875352",
//       activity: "manjat gunung",
//     },
//     {
//       name: "Gunung Tangkuban Perahu",
//       imgUrl:
//         "https://lh5.googleusercontent.com/p/AF1QipPaE5Bmj1nDSYGuDWEZRrhUx9NFEnQ1AOL-Chrs=w408-h306-k-no",
//       labelDay: 1,
//       startHour: "09:00",
//       longitude: "-8.54673581674982",
//       latitude: "119.81622416875352",
//       activity: "manjat gunung",
//     },
//   ],
// };
// const user1 = {
//   username: "newAdmin",
//   email: "newAdmin@email.com",
//   password: "newAdmin",
//   photoProfile: "photoAdmin",
//   phoneNumber: "08212126",
//   address: "Jalan new Admin",
// };
// // const user2 = {
// //   username: "userTest",
// //   email: "userTest@email.com",
// //   password: "userTest",
// //   photoProfile:
// //     "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&ga=GA1.1.468604856.1683977961&semt=ais",
// //   phoneNumber: "085208520852",
// //   address: "123 Main Street",
// // };

// beforeAll(async () => {
//   await sequelize.queryInterface.bulkInsert(
//     "Users",
//     require("../data/user.json").map((el) => {
//       el.createdAt = el.updatedAt = new Date();
//       el.password = hashPassword(el.password);
//       return el;
//     })
//   );

//   await sequelize.queryInterface.bulkInsert(
//     "Categories",
//     require("../data/category.json").map((el) => {
//       el.createdAt = el.updatedAt = new Date();
//       return el;
//     })
//   );

//   await sequelize.queryInterface.bulkInsert(
//     "Trips",
//     require("../data/trip.json").map((el) => {
//       el.createdAt = el.updatedAt = new Date();
//       return el;
//     })
//   );

//   await sequelize.queryInterface.bulkInsert(
//     "Destinations",
//     require("../data/destination.json").map((el) => {
//       el.createdAt = el.updatedAt = new Date();
//       return el;
//     })
//   );

//   await sequelize.queryInterface.bulkInsert(
//     "TripGroups",
//     require("../data/tripgroup.json").map((el) => {
//       el.createdAt = el.updatedAt = new Date();
//       return el;
//     })
//   );
// });

// afterAll(async () => {
//   await sequelize.queryInterface.bulkDelete("Users", null, {
//     truncate: true,
//     cascade: true,
//     restartIdentity: true,
//   });

//   await sequelize.queryInterface.bulkDelete("Categories", null, {
//     truncate: true,
//     cascade: true,
//     restartIdentity: true,
//   });

//   await sequelize.queryInterface.bulkDelete("Trips", null, {
//     truncate: true,
//     cascade: true,
//     restartIdentity: true,
//   });

//   await sequelize.queryInterface.bulkDelete("Destinations", null, {
//     truncate: true,
//     cascade: true,
//     restartIdentity: true,
//   });

//   await sequelize.queryInterface.bulkDelete("Trips", null, {
//     truncate: true,
//     cascade: true,
//     restartIdentity: true,
//   });

//   await sequelize.queryInterface.bulkDelete("TripGroups", null, {
//     truncate: true,
//     cascade: true,
//     restartIdentity: true,
//   });
// });

// // POST /admin/login
// describe("POST /admin/login", () => {
//   test("should login with existing data and return 200", async () => {
//     const response = await request(app).post("/admin/login").send({
//       email: "jacksondavis@example.com",
//       password: "password789",
//     });

//     //matchers
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("access_token", expect.any(String));
//     expect(response.body).toHaveProperty("username", expect.any(String));
//     expect(response.body).toHaveProperty("email", expect.any(String));
//     expect(response.body).toHaveProperty("message", expect.any(String));
//     access_token = response.body.access_token;
//     console.log(access_token, "<<");
//   });

//   test("400 Falied login - should return error if email is null", async () => {
//     const response = await request(app).post("/admin/login").send({
//       password: "password123",
//     });

//     //matchers
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty("message", "Email is required");
//   });

//   test("400 Falied login - should return error if password is null", async () => {
//     const response = await request(app).post("/admin/login").send({
//       email: "johndoe@example.com",
//     });

//     //matchers
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty("message", "Password is required");
//   });

//   test("401 Falied login - should return error if wrong email format", async () => {
//     const response = await request(app).post("/admin/login").send({
//       email: "random",
//       password: "password123",
//     });

//     //matchers
//     expect(response.status).toBe(401);
//     expect(response.body).toHaveProperty(
//       "message",
//       "email or password is invalid"
//     );
//   });

//   test("401 Falied login - should return error if email is not registered", async () => {
//     const response = await request(app).post("/admin/login").send({
//       email: "test@email.com",
//       password: "password123",
//     });

//     //matchers
//     expect(response.status).toBe(401);
//     expect(response.body).toHaveProperty(
//       "message",
//       "email or password is invalid"
//     );
//   });

//   test("401 Falied login - should return error if password is wrong", async () => {
//     const response = await request(app).post("/admin/login").send({
//       email: "johndoe@example.com",
//       password: "passwordsalah",
//     });

//     //matchers
//     expect(response.status).toBe(401);
//     expect(response.body).toHaveProperty(
//       "message",
//       "email or password is invalid"
//     );
//   });
// });

// // POST /admin/register
// describe("POST /admin/register", () => {
//   test("201 Success register - should create new Admin", async () => {
//     const response = await request(app)
//       .post("/admin/register")
//       .set("access_token", access_token)
//       .send(user1);
//     //   .set(access_token)

//     //matchers
//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("id", expect.any(Number));
//     expect(response.body).toHaveProperty("email", user1.email);
//     expect(response.body).toHaveProperty("message", "Succesfully registered");
//   });
//   test("401 Failed register - should return error if not authenticated", async () => {
//     const response = await request(app)
//       .post("/admin/register")
//       .set("access_token", null)
//       .send(user1);
//     //   .set(access_token)

//     //matchers
//     expect(response.status).toBe(401);
//     expect(response.body).toHaveProperty("message", "unauthenticated");
//   });
//   test("400 Failed register - should return error if email is null", async () => {
//     const response = await request(app)
//       .post("/admin/register")
//       .set("access_token", access_token)
//       .send({
//         username: "newAdmin",
//         password: "newAdmin",
//         photoProfile: "photoAdmin",
//         phoneNumber: "08212126",
//         address: "Jalan new Admin",
//       });

//     //matchers
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty("message", "Email is required");
//   });
//   test("400 Failed register - should return error if username is null", async () => {
//     const response = await request(app)
//       .post("/admin/register")
//       .set("access_token", access_token)
//       .send({
//         email: "newAdmin@email.com",
//         password: "newAdmin",
//         photoProfile: "photoAdmin",
//         phoneNumber: "08212126",
//         address: "Jalan new Admin",
//       });

//     //matchers
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty("message", "Username is required");
//   });
//   test("400 Failed register - should return error if password is null", async () => {
//     const response = await request(app)
//       .post("/admin/register")
//       .set("access_token", access_token)
//       .send({
//         username: "newAdmin",
//         email: "newAdmin@email.com",
//         photoProfile: "photoAdmin",
//         phoneNumber: "08212126",
//         address: "Jalan new Admin",
//       });

//     //matchers
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty("message", "Password is required");
//   });
//   test("400 Failed register - should return error if password is not 5 chars", async () => {
//     const response = await request(app)
//       .post("/admin/register")
//       .set("access_token", access_token)
//       .send({
//         username: "newAdmin",
//         email: "newAdmin@email.com",
//         password: "1",
//         photoProfile: "photoAdmin",
//         phoneNumber: "08212126",
//         address: "Jalan new Admin",
//       });

//     //matchers
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty(
//       "message",
//       "The minimum password length is 5 characters"
//     );
//   });
//   test("400 Failed register - should return error if wrong email format", async () => {
//     const response = await request(app)
//       .post("/admin/register")
//       .set("access_token", access_token)
//       .send({
//         username: "newAdmin",
//         email: "newAdmin",
//         password: "newAdmin",
//         photoProfile: "photoAdmin",
//         phoneNumber: "08212126",
//         address: "Jalan new Admin",
//       });

//     //matchers
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty(
//       "message",
//       "Email must be email format"
//     );
//   });
//   test("400 Failed register - should return error is already exists", async () => {
//     const response = await request(app)
//       .post("/admin/register")
//       .set("access_token", access_token)
//       .send({
//         username: "newAdmin",
//         email: "janesmith@example.com",
//         password: "newAdmin",
//         photoProfile: "photoAdmin",
//         phoneNumber: "08212126",
//         address: "Jalan new Admin",
//       });

//     //matchers
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty(
//       "message",
//       "This email is already registered"
//     );
//   });
//   test("400 Failed register - should return error if email is emtry string", async () => {
//     const response = await request(app)
//       .post("/admin/register")
//       .set("access_token", access_token)
//       .send({
//         username: "newAdmin",
//         email: "",
//         password: "newAdmin",
//         photoProfile: "photoAdmin",
//         phoneNumber: "08212126",
//         address: "Jalan new Admin",
//       });

//     //matchers
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty("message", "Email is required");
//   });
//   test("400 Failed register - should return error if password is empty string", async () => {
//     const response = await request(app)
//       .post("/admin/register")
//       .set("access_token", access_token)
//       .send({
//         username: "newAdmin",
//         email: "newAdmin@email.com",
//         password: "",
//         photoProfile: "photoAdmin",
//         phoneNumber: "08212126",
//         address: "Jalan new Admin",
//       });

//     //matchers
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty("message", "Password is required");
//   });
//   test("400 Failed register - should return error if username is empty string", async () => {
//     const response = await request(app)
//       .post("/admin/register")
//       .set("access_token", access_token)
//       .send({
//         username: "",
//         email: "newAdmin@email.com",
//         password: "newAdmin",
//         photoProfile: "photoAdmin",
//         phoneNumber: "08212126",
//         address: "Jalan new Admin",
//       });

//     //matchers
//     expect(response.status).toBe(400);
//     expect(response.body).toHaveProperty("message", "Username is required");
//   });
// });

// // GET /admin/trip
// describe("GET /admin/trip", () => {
//   test("200 success get trips - should return all trips", async () => {
//     const response = await request(app)
//       .get("/admin/trip")
//       .set("access_token", access_token);
//     //   .set(access_token)

//     //matchers
//     expect(response.status).toBe(200);
//     expect(response.body.length).toBeGreaterThan(0);
//   });
// });

// // GET /admin/trip/:id
// describe("GET /admin/trip/:id", () => {
//   test("200 success get trips - should return all trips", async () => {
//     const response = await request(app)
//       .get("/admin/trip/1")
//       .set("access_token", access_token);
//     //   .set(access_token)

//     //matchers
//     expect(response.status).toBe(200);
//     expect(response.body).toBeInstanceOf(Object);
//   });
// });

// // POST /admin/trip
// describe("POST /admin/trip/:id", () => {
//   test("201 success post trip - should create new trip", async () => {
//     const response = await request(app)
//       .post("/admin/trip")
//       .set("access_token", access_token)
//       .send(newTrip);
//     //   .set(access_token)

//     //matchers
//     expect(response.status).toBe(201);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body).toHaveProperty("message", "success add trips");
//   });
// });

// // PUT /admin/trip/:id
// describe("PUT /admin/trip/:id", () => {
//   const id = 1;
//   test("201 success post trip - should create new trip", async () => {
//     const response = await request(app)
//       .put(`/admin/trip/${id}`)
//       .set("access_token", access_token)
//       .send({
//         name: "Trip to Lembang",
//         categoryId: 1,
//         date: "2023-08-17",
//         price: 3500000,
//         imgUrl:
//           "https://res.klook.com/image/upload/Mobile/City/rv76yqukp2hey0fckh99.jpg",
//         videoUrl: "https://www.youtube.com/watch?v=kQIri35Yjds",
//         duration: 3,
//         meetingPoint: "Jakarta",
//         location: "Bandung",
//         limit: 3,
//         description: "Trip seru banget di lembang guys",
//       });
//     //   .set(access_token)

//     //matchers
//     expect(response.status).toBe(201);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body).toHaveProperty(
//       "message",
//       `success edit trips with id ${id}`
//     );
//   });
// });

// // DELETE /admin/trip/:id
// describe("DELETE /admin/trip/:id", () => {
//   const id = 1;
//   test("200 success delete trip - should delete trip", async () => {
//     const response = await request(app)
//       .delete(`/admin/trip/${id}`)
//       .set("access_token", access_token);
//     //   .set(access_token)

//     //matchers
//     expect(response.status).toBe(200);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body).toHaveProperty(
//       "message",
//       `success delete trip with id ${id}`
//     );
//   });
// });

// // DELETE /admin/category/:id
// describe("DELETE /admin/category/:id", () => {
//   const id = 1;
//   test("200 success delete category - should delete category", async () => {
//     const response = await request(app)
//       .delete(`/admin/category/${id}`)
//       .set("access_token", access_token);
//     //   .set(access_token)

//     //matchers
//     expect(response.status).toBe(200);
//     expect(response.body).toBeInstanceOf(Object);
//     expect(response.body).toHaveProperty(
//       "message",
//       `success delete category with id ${id}`
//     );
//   });
// });

// // GET /admin/category
// describe("GET /admin/category", () => {
//   test("200 success get trips - should return all trips", async () => {
//     const response = await request(app)
//       .get("/admin/category")
//       .set("access_token", access_token);
//     //   .set(access_token)

//     //matchers
//     expect(response.status).toBe(200);
//     expect(response.body.length).toBeGreaterThan(0);
//   });
// });

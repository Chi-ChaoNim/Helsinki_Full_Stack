const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test helper");
const Blog = require("../models/blog");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const api = supertest(app);
let initialUser;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekmet", 10);
  const makeUsers = helper.initialUsers.map((user) => ({
    ...user,
    passwordHash,
  }));

  await User.insertMany(makeUsers);
  await Blog.insertMany(helper.initialBlogs);
});

describe("tests to check blog object properties", () => {
  test("all blogs are returned and in a JSON format", async () => {
    const response = await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("blogs unique identifier property is named id", async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogToCheck = blogsAtStart[0];
    const blogKeys = Object.keys(blogToCheck);

    assert(blogKeys.includes("id"));
    assert(!blogKeys.includes("_id"));
  });

  test("a blog with valid details can be added", async () => {
    const usersAtStart = await helper.usersInDb();
    const userOne = usersAtStart[0];

    const loginResponse = await api
      .post("/api/login")
      .send({ username: userOne.username, password: "sekmet" })
      .expect(200);

    const loginToken = loginResponse.body.token;

    const newBlog = {
      title: "Why Everyone's Car Prices Are Different",
      author: "Cy Radha",
      url: "https://api.mywebsite.io/home/welcome",
      likes: 3,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${loginToken}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();
    const titles = blogsAtEnd.map((b) => b.title);

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
    assert(titles.includes("Why Everyone's Car Prices Are Different"));
  });

  test("attempting to create a blog without a token fails", async () => {
    const newBlog = {
      title: "Why Everyone's Car Prices Are Different",
      author: "Cy Radha",
      url: "https://api.mywebsite.io/home/welcome",
      likes: 3,
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", "Bearer 533")
      .expect(401)
      .expect("Content-Type", /application\/json/);

    assert(response.body.error.includes("token invalid"));
  });

  // test.only("blog creation fails when userId is missing", async () => {
  //   const usersAtStart = await helper.usersInDb();
  //   const userOne = usersAtStart[0];

  //   const loginResponse = await api
  //     .post("/api/login")
  //     .send({ username: userOne.username, password: "sekmet" })
  //     .expect(200);

  //   const loginToken = loginResponse.body.token;

  //   const newBlog = {
  //     title: "Why Everyone's Car Prices Are Different",
  //     author: "Cy Radha",
  //     url: "https://api.mywebsite.io/home/welcome",
  //     likes: 3,
  //   };

  //   await api
  //     .post("/api/blogs")
  //     .send(newBlog)
  //     .set("Authorization", `Bearer ${loginToken}`)
  //     .expect(400);
  // });

  test("missing likes property defaults to 0", async () => {
    const usersAtStart = await helper.usersInDb();
    const userOne = usersAtStart[0];

    const loginResponse = await api
      .post("/api/login")
      .send({ username: userOne.username, password: "sekmet" })
      .expect(200);

    const loginToken = loginResponse.body.token;
    const newBlog = {
      title: "Why Everyone's Car Prices Are Different",
      author: "Cy Radha",
      url: "https://api.mywebsite.io/home/welcome",
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${loginToken}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();
    const lastBlog = blogsAtEnd[blogsAtEnd.length - 1];

    assert.strictEqual(lastBlog.likes, 0);
  });

  test("missing title property returns 400 bad request", async () => {
    const usersAtStart = await helper.usersInDb();
    const userOne = usersAtStart[0];

    const loginResponse = await api
      .post("/api/login")
      .send({ username: userOne.username, password: "sekmet" })
      .expect(200);

    const loginToken = loginResponse.body.token;
    const newBlog = {
      author: "Cy Radha",
      url: "https://api.mywebsite.io/home/welcome",
      likes: 3,
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${loginToken}`)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(response.body.error.includes("Blog validation failed: title"));
  });

  test("missing url property returns 400 bad request", async () => {
    const usersAtStart = await helper.usersInDb();
    const userOne = usersAtStart[0];

    const loginResponse = await api
      .post("/api/login")
      .send({ username: userOne.username, password: "sekmet" })
      .expect(200);

    const loginToken = loginResponse.body.token;
    const newBlog = {
      title: "Some random title that baits people into clicking",
      author: "Cy Radha",
      likes: 3,
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${loginToken}`)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(response.body.error.includes("Blog validation failed: url"));
  });
});

describe("tests to check deletion of blogs", () => {
  test("deletion of a blog", async () => {
    const usersAtStart = await helper.usersInDb();
    const userOne = usersAtStart[0];

    const loginResponse = await api
      .post("/api/login")
      .send({ username: userOne.username, password: "sekmet" })
      .expect(200);

    const loginToken = loginResponse.body.token;

    const newBlog = {
      title: "Why Everyone's Car Prices Are Different",
      author: "Cy Radha",
      url: "https://api.mywebsite.io/home/welcome",
      likes: 3,
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${loginToken}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogId = response.body.id;

    await api
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${loginToken}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDB();
    const titles = blogsAtEnd.map((blog) => blog.title);

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    assert(!titles.includes(newBlog.title));
  });

  test("attempt to delete blog with nonexistant id", async () => {
    const invalidId = "34hi9wuhvnn2085";

    const response = await api.delete(`/api/blogs/${invalidId}`).expect(401);

    const blogsAtEnd = await helper.blogsInDB();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  test("attempt to delete a blog linked to another user", async () => {
    const usersAtStart = await helper.usersInDb();
    const userOne = usersAtStart[0];
    const userTwo = usersAtStart[1];

    const loginResponseOne = await api
      .post("/api/login")
      .send({ username: userOne.username, password: "sekmet" })
      .expect(200);

    const loginTokenOne = loginResponseOne.body.token;

    const loginResponseTwo = await api
      .post("/api/login")
      .send({ username: userTwo.username, password: "sekmet" })
      .expect(200);

    const loginTokenTwo = loginResponseTwo.body.token;

    const newBlog = {
      title: "Why Everyone's Car Prices Are Different",
      author: "Cy Radha",
      url: "https://api.mywebsite.io/home/welcome",
      likes: 3,
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${loginTokenOne}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogId = response.body.id;

    const returningResponse = await api
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${loginTokenTwo}`)
      .expect(401);

    const blogsAtEnd = await helper.blogsInDB();
    const titles = blogsAtEnd.map((b) => b.title);

    assert.strictEqual(returningResponse.status, 401);
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
    assert(titles.includes("Why Everyone's Car Prices Are Different"));
  });
});

describe("tests to check the update method of blogs", () => {
  test("updating of a blog", async () => {
    const usersAtStart = await helper.usersInDb();
    const userOne = usersAtStart[0];

    const loginResponse = await api
      .post("/api/login")
      .send({ username: userOne.username, password: "sekmet" })
      .expect(200);

    const loginToken = loginResponse.body.token;

    const newBlog = {
      title: "Why Everyone's Car Prices Are Different",
      author: "Cy Radha",
      url: "https://api.mywebsite.io/home/welcome",
      likes: 3,
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${loginToken}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogId = response.body.id;

    const updatedBlog = {
      ...newBlog,
      likes: 100,
    };

    const returnedResponse = await api
      .put(`/api/blogs/${blogId}`)
      .send(updatedBlog)
      .set("Authorization", `Bearer ${loginToken}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(returnedResponse.body.likes, 100);
  });

  test("updating of a blog with invalid id", async () => {
    const usersAtStart = await helper.usersInDb();
    const userOne = usersAtStart[0];

    const loginResponse = await api
      .post("/api/login")
      .send({ username: userOne.username, password: "sekmet" })
      .expect(200);

    const loginToken = loginResponse.body.token;

    const newBlog = {
      title: "Why Everyone's Car Prices Are Different",
      author: "Cy Radha",
      url: "https://api.mywebsite.io/home/welcome",
      likes: 3,
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${loginToken}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogId = response.body.id;

    const updatedBlog = {
      ...newBlog,
      likes: 100,
    };

    await api
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${loginToken}`)
      .expect(204);

    const returnedResponse = await api
      .put(`/api/blogs/${blogId}`)
      .send(updatedBlog)
      .set("Authorization", `Bearer ${loginToken}`)
      .expect(404);

    assert.strictEqual(returnedResponse.status, 404);
  });

  test("updating of a blog with missing data", async () => {
    const usersAtStart = await helper.usersInDb();
    const userOne = usersAtStart[0];

    const loginResponse = await api
      .post("/api/login")
      .send({ username: userOne.username, password: "sekmet" })
      .expect(200);

    const loginToken = loginResponse.body.token;

    const newBlog = {
      title: "Why Everyone's Car Prices Are Different",
      author: "Cy Radha",
      url: "https://api.mywebsite.io/home/welcome",
      likes: 3,
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${loginToken}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogId = response.body.id;

    const updatedBlog = {};

    const returnedResponse = await api
      .put(`/api/blogs/${blogId}`)
      .send(updatedBlog)
      .set("Authorization", `Bearer ${loginToken}`)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(returnedResponse.status, 400);
  });

  test("attempt to update a blog linked to another user", async () => {
    const usersAtStart = await helper.usersInDb();
    const userOne = usersAtStart[0];
    const userTwo = usersAtStart[1];

    const loginResponseOne = await api
      .post("/api/login")
      .send({ username: userOne.username, password: "sekmet" })
      .expect(200);

    const loginTokenOne = loginResponseOne.body.token;

    const loginResponseTwo = await api
      .post("/api/login")
      .send({ username: userTwo.username, password: "sekmet" })
      .expect(200);

    const loginTokenTwo = loginResponseTwo.body.token;

    const newBlog = {
      title: "Why Everyone's Car Prices Are Different",
      author: "Cy Radha",
      url: "https://api.mywebsite.io/home/welcome",
      likes: 3,
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${loginTokenOne}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogId = response.body.id;

    const updatedBlog = {
      ...newBlog,
      title: "13 Reasons Why Dogs Find You Unattractive",
    };

    const returningResponse = await api
      .put(`/api/blogs/${blogId}`)
      .send(updatedBlog)
      .set("Authorization", `Bearer ${loginTokenTwo}`)
      .expect(401);

    const blogsAtEnd = await helper.blogsInDB();
    const titles = blogsAtEnd.map((b) => b.title);

    assert.strictEqual(returningResponse.status, 401);
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
    assert(titles.includes("Why Everyone's Car Prices Are Different"));
  });
});

describe("tests to check the create method of users", () => {
  test("creation succeeds with all valid details", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "Magicaw",
      name: "Ren",
      password: "chaosvhilla",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);

    assert(usernames.includes(newUser.username));
  });

  test(" username not unique", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "Windflint",
      name: "Chi",
      password: "applebottomjeans",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert(response.body.error.includes("expected 'username' to be unique"));
    assert(usersAtStart.length, usersAtEnd.length);
  });

  test("creation fails when username is not given", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      name: "Chi",
      password: "applebottomjeans",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert(response.body.error.includes("User validation failed: username"));
    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
  });

  test("creation fails when password is not given", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "Windflint",
      name: "Ren",
    };

    const response = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert(response.body.error.includes("Password missing or not valid"));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});

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
// refactor these damn test suites

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekmet", 10);
  const user = new User({
    username: "CupChunGae",
    name: "Chi",
    passwordHash,
  });

  initialUser = await user.save();

  const blogsWithUser = helper.initialBlogs.map((blog) => ({
    ...blog,
    user: initialUser._id,
  }));

  await Blog.insertMany(blogsWithUser);
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
    const newBlog = {
      title: "Why Everyone's Car Prices Are Different",
      author: "Cy Radha",
      url: "https://api.mywebsite.io/home/welcome",
      likes: 3,
      userId: initialUser._id.toString(),
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();
    const titles = blogsAtEnd.map((b) => b.title);

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
    assert(titles.includes("Why Everyone's Car Prices Are Different"));
  });

  test("blog creation fails when userId is missing", async () => {
    const newBlog = {
      title: "Why Everyone's Car Prices Are Different",
      author: "Cy Radha",
      url: "https://api.mywebsite.io/home/welcome",
      likes: 3,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });

  test("missing likes property defaults to 0", async () => {
    const newBlog = {
      title: "Why Everyone's Car Prices Are Different",
      author: "Cy Radha",
      url: "https://api.mywebsite.io/home/welcome",
      userId: initialUser._id.toString(),
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDB();
    const lastBlog = blogsAtEnd[blogsAtEnd.length - 1];

    assert.strictEqual(lastBlog.likes, 0);
  });

  test("missing title property returns 400 bad request", async () => {
    const newBlog = {
      author: "Cy Radha",
      url: "https://api.mywebsite.io/home/welcome",
      likes: 3,
      userId: initialUser._id.toString(),
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("missing url property returns 400 bad request", async () => {
    const newBlog = {
      title: "Some random title that baits people into clicking",
      author: "Cy Radha",
      likes: 3,
      userId: initialUser._id.toString(),
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
});

describe("tests to check deletion of blogs", () => {
  test("deletion of a blog", async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDB();
    const ids = blogsAtEnd.map((b) => b.id);

    assert(!ids.includes(blogToDelete.id));
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
  });

  test("attempt to delete blog with nonexistant id", async () => {
    const invalidId = "34hi9wuhvnn2085";

    await api.delete(`/api/blogs/${invalidId}`).expect(400);

    const blogsAtEnd = await helper.blogsInDB();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });
});

describe("tests to check the update method of blogs", () => {
  test("updating of a blog", async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogToUpdate = blogsAtStart[0];

    blogToUpdate.likes = 100;

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.likes, 100);
  });

  test("updating of a blog with invalid id", async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogToUpdate = blogsAtStart[0];

    blogToUpdate.likes = 100;
    blogToUpdate.id = "navho2299mmss0";

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(400);
  });

  test("updating of a blog with missing data", async () => {
    const blogsAtStart = await helper.blogsInDB();
    const blogToUpdate = blogsAtStart[0];

    blogToUpdate.likes = 100;
    blogToUpdate.title = "";
    blogToUpdate.url = "";

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(400);
  });
});

describe("tests to check the create method of users", () => {
  test("creation succeed with all valid details", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "Windflint",
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

  test("creation fails when username not unique", async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: "CupChunGae",
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
    console.log("🚀 ~ response:", response.body);

    const usersAtEnd = await helper.usersInDb();

    assert(response.body.error.includes("Password missing or not valid"));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});

const assert = require("node:assert");
const { test, after, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test helper");
const Blog = require("../models/blog");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

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

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Why Everyone's Car Prices Are Different",
    author: "Cy Radha",
    url: "https://api.mywebsite.io/home/welcome",
    likes: 3,
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

test("missing likes property defaults to 0", async () => {
  const newBlog = {
    title: "Why Everyone's Car Prices Are Different",
    author: "Cy Radha",
    url: "https://api.mywebsite.io/home/welcome",
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
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

after(async () => {
  await mongoose.connection.close();
});

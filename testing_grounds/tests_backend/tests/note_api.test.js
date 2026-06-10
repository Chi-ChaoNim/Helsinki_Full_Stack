const assert = require("node:assert");
const { test, after, beforeEach, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper.js");
const Note = require("../models/note");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

const api = supertest(app);

describe("when there is initially some notes saved", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Note.deleteMany({});
    //resets user database and note database

    const passwordHash = await bcrypt.hash("sekmet", 10);
    const user = new User({
      username: "noteUser",
      passwordHash,
    });
    await user.save();
    //creates and saves a new user to the user database

    const notesWithUser = helper.initialNotes.map((note) => ({
      ...note,
      user: user._id,
    }));
    await Note.insertMany(notesWithUser);
    // creates and inserts the notes database using the inital notes with the
    // newly created user's user._id
  });

  test("notes are returned as json", async () => {
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all notes are returned", async () => {
    const response = await api.get("/api/notes");

    assert.strictEqual(response.body.length, helper.initialNotes.length);
  });

  test("a specific note is within the returned notes", async () => {
    const response = await api.get("/api/notes");
    const contents = response.body.map((note) => note.content);

    assert.strictEqual(contents.includes("HTML is easy"), true);
  });

  describe("viewing a specific note", () => {
    test("succeeds with a valid id", async () => {
      const notesAtStart = await helper.notesInDB();
      const noteToView = notesAtStart[0];

      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(resultNote.body.content, noteToView.content);
      assert.strictEqual(resultNote.body.important, noteToView.important);
      assert.strictEqual(resultNote.body.id, noteToView.id);
    });

    test("fails with status code 400, note is nonexistant", async () => {
      const validNonexistingId = await helper.nonExistingId();

      await api.get(`/api/notes/${validNonexistingId}`).expect(404);
    });

    test("fails with status code 400, id is invalid", async () => {
      const invalidId = `33nnfu11hfjhhhq881o`;

      await api.get(`/api/notes/${invalidId}`).expect(400);
    });
  });

  describe("addition of a new note", () => {
    test("succeeds with valid data", async () => {
      const users = await helper.usersInDb();
      const userId = users[0].id;

      const newNote = {
        content: "async/await simplifies making async calls",
        important: true,
        userId: userId,
      };

      await api
        .post("/api/notes")
        .send(newNote)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const notesAtEnd = await helper.notesInDB();
      const contents = notesAtEnd.map((n) => n.content);

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1);
      assert(contents.includes("async/await simplifies making async calls"));
    });

    test("fails with status code 400, data is invalid", async () => {
      const users = await helper.usersInDb();
      const userId = users[0].id;

      const newNote = {
        important: true,
        userId: userId,
      };

      await api.post("/api/notes").send(newNote).expect(400);

      const notesAtEnd = await helper.notesInDB();

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length);
    });
  });

  describe("deletion of a note", () => {
    test("succeeds with status code 204, id is valid", async () => {
      const notesAtStart = await helper.notesInDB();
      const noteToDelete = notesAtStart[0];

      await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

      const notesAtEnd = await helper.notesInDB();
      const ids = notesAtEnd.map((n) => n.id);
      assert(!ids.includes(noteToDelete.id));
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1);
    });
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekmet", 10);
    const user = new User({
      username: "root",
      passwordHash,
    });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
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

  test("user creation fails with proper status code and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected 'username' to be unique"));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});

const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://chichaonim_fullstack:${password}@cluster0.c0oadiv.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url, { family: 4 }); //command to connect to the database, family: 4 means connect via IPv4

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
}); //making the blueprint of the object we want to create and store

const Note = mongoose.model("Note", noteSchema); //making a model with the name "Note" using the note Schema
const note = new Note({
  content: "GET and POST are the most important methods of HTTP protocol",
  important: true,
}); //making a new note object

Note.find({ important: true }).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});

note.save().then(() => {
  console.log("note saved!");
  mongoose.connection.close();
}); //saves the newly made node into the database and then closes the connection to the database

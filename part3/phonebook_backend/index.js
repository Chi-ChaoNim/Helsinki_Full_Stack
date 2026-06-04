require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

app.use(express.json());
/*Json parser takes the JSON from the request and turns it into a JS object
and attaches the data into a body property */

app.use(
  morgan(":method :url :res[content-length] - :response-time ms :JSONContent"),
);
app.use(cors());
app.use(express.static("dist"));

morgan.token("JSONContent", function (req, res) {
  return JSON.stringify(req.body);
});

let people = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Phonebook Home</h1>");
});

app.get("/info", (request, response) => {
  Person.countDocuments().then((phoneBookLength) => {
    response.send(
      `<div>
        <p>
            Phonebook has info for ${phoneBookLength} people
        </p>
        <p>
            ${new Date()}
        </p>
    </div>`,
    );
  });
});

app.get("/api/people", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/api/people/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.put("/api/people/:id", (request, response) => {
  const body = request.body;
  console.log("🚀 ~ body:", body);
  const id = request.params.id;
  console.log("🚀 ~ id:", id);
  Person.findByIdAndUpdate(id, body).then(() => {
    response.json(body);
  });
});

app.delete("/api/people/:id", (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id).then((removedPerson) => {
    response.json(removedPerson);
  });
});

app.post("/api/people", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: "number is missing",
    });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

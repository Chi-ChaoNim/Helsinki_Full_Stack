require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

app.use(express.static("dist"));
app.use(express.json());
/*Json parser takes the JSON from the request and turns it into a JS object
and attaches the data into a body property */

app.use(
  morgan(":method :url :res[content-length] - :response-time ms :JSONContent"),
);
app.use(cors());
morgan.token("JSONContent", function (req) {
  return JSON.stringify(req.body);
});

app.get("/", (request, response) => {
  response.send("<h1>Phonebook Home</h1>");
});

app.get("/info", (request, response, next) => {
  Person.countDocuments()
    .then((phoneBookLength) => {
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
    })
    .catch((error) => next(error));
});

app.get("/api/people", (request, response, next) => {
  Person.find({})
    .then((people) => {
      response.json(people);
    })
    .catch((error) => next(error));
});

app.get("/api/people/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/people/:id", (request, response, next) => {
  const body = request.body;
  const id = request.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        Person.findByIdAndUpdate(id, body).then(() => {
          response.json(body);
        });
      } else {
        response.status(400).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/people/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((removedPerson) => {
      response.json(removedPerson);
    })
    .catch((error) => next(error));
});

app.post("/api/people", (request, response, next) => {
  const body = request.body;
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

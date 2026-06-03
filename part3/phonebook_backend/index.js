const express = require("express");
const app = express();

app.use(express.json());
/*Json parser takes the JSON from the request and turns it into a JS object
and attaches the data into a body property */

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
  response.send(
    `<div>
        <p>
            Phonebook has info for ${people.length} people
        </p>
        <p>
            ${new Date()}
        </p>
    </div>`,
  );
});

app.get("/api/people", (request, response) => {
  response.json(people);
});

app.get("/api/people/:id", (request, response) => {
  const id = request.params.id;
  const person = people.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/people/:id", (request, response) => {
  const id = request.params.id;
  people = people.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const randomId = Math.floor(Math.random() * 20000);
  return String(randomId);
};

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
  } else if (people.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "names but be unique",
    });
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  people = people.concat(person);

  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

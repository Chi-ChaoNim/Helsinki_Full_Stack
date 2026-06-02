const express = require("express");
const app = express();

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

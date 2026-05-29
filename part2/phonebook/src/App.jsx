import { useState, useEffect } from "react";
import axios from "axios";
import Form from "./components/Form";
import Searchbar from "./components/Searchbar";
import RenderAllPersons from "./components/RenderAll";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("Add a name here");
  const [newNumber, setNewNumber] = useState("Add a number here");
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1),
    };
    const found = persons.some((person) => person.name === newName);
    if (found) {
      alert(`Warning: ${newName} has already been added to phonebook`);
      return;
    } else {
      setPersons(persons.concat(personObject));
      setNewName("");
      setNewNumber("");
    }
  };

  const handleNameChange = () => {
    setNewName(event.target.value);
  };
  const handleNumberChange = () => {
    setNewNumber(event.target.value);
  };
  const handleFilterChange = () => {
    setFilterName(event.target.value);
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterName.toLocaleLowerCase()),
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Searchbar
        filterName={filterName}
        handleFilterChange={handleFilterChange}
      />
      <h3>Add a new</h3>
      <Form
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <RenderAllPersons filteredPersons={filteredPersons} />
    </div>
  );
};

export default App;

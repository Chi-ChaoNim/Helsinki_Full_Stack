import { useState, useEffect } from "react";
import personServices from "./services/numbers";

import Form from "./components/Form";
import Searchbar from "./components/Searchbar";
import RenderAllPersons from "./components/RenderAll";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("Add a name here");
  const [newNumber, setNewNumber] = useState("Add a number here");
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    personServices.getAll().then((response) => {
      setPersons(response);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    const found = persons.some((person) => person.name === newName);
    if (found) {
      if (
        window.confirm(
          `${newName} is already in the phonebook, replace the old number with a new one?`,
        )
      ) {
        const foundPerson = persons.find((person) => person.name === newName);
        personServices.update(foundPerson.id, personObject).then((response) => {
          setPersons(
            persons.map((person) =>
              person.id === foundPerson.id ? response : person,
            ),
          );
        });
      } else {
        return;
      }
    } else {
      personServices.create(personObject).then((response) => {
        setPersons(persons.concat(response));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const deletePerson = (event, person) => {
    event.preventDefault();
    console.log(person);
    if (window.confirm(`Delete this record? ${person.name}`)) {
      personServices.deleteRecord(person.id).then(() => {
        setPersons(persons.filter((p) => p.id !== person.id));
      });
    } else {
      return;
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const handleFilterChange = (event) => {
    setFilterName(event.target.value);
  };

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filterName.toLowerCase()),
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
      <RenderAllPersons
        filteredPersons={filteredPersons}
        deletePerson={deletePerson}
      />
    </div>
  );
};
export default App;

import { useState, useEffect } from "react";
import personServices from "./services/numbers";

import Form from "./components/Form";
import Searchbar from "./components/Searchbar";
import RenderAllPersons from "./components/RenderAll";
import Notification from "./components/Notification";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("Add a name here");
  const [newNumber, setNewNumber] = useState("Add a number here");
  const [filterName, setFilterName] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationSuccess, setNotificationSuccess] = useState(true);

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
    const foundName = persons.find((person) => person.name === newName);
    if (foundName) {
      if (
        window.confirm(
          `${newName} is already in the phonebook, replace the old number with a new one?`,
        )
      ) {
        personServices
          .update(foundName.id, personObject)
          .then((response) => {
            setPersons(
              persons.map((person) =>
                person.id === response.id ? response : person,
              ),
            );
          })
          .catch((error) => {
            setNotificationSuccess(false);
            setNotificationMessage(
              `Error: ${error}. This record might have been removed from the server.`,
            );
          });
        setNotificationSuccess(true);
        setNotificationMessage(
          `Edited a contact: ${personObject.name} ${personObject.number}`,
        );
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      } else {
        return;
      }
    } else {
      personServices
        .create(personObject)
        .then((response) => {
          setPersons(persons.concat(response));
          setNotificationSuccess(true);
          setNotificationMessage(`Added a new contact: ${personObject.name}`);
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          setNotificationSuccess(false);
          setNotificationMessage(`${error.response.data.error}`);
          setTimeout(() => {
            setNotificationMessage(null);
          }, 10000);
        });
    }
  };

  const deletePerson = (event, person) => {
    event.preventDefault();
    if (window.confirm(`Delete this record? ${person.name}`)) {
      personServices
        .deleteRecord(person.id)
        .then((response) => {
          setPersons(persons.filter((p) => p.id !== response.id));
          setNotificationSuccess(true);
          setNotificationMessage(`Removed ${response.name} successfully.`);
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
        })
        .catch((error) => {
          setNotificationSuccess(false);
          setNotificationMessage(
            `Error: ${error}. This person has already been deleted.`,
          );
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);
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
      <Notification
        message={notificationMessage}
        notificationSuccess={notificationSuccess}
      />
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

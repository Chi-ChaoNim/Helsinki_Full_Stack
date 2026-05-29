import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('Add a name here')
  const [newNumber, setNewNumber] = useState("Add a number here")
  const [filterName, setFilterName] = useState("")

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1)
    }
    const found = persons.some(person => person.name === newName)
    if (found) {
      alert(`Warning: ${newName} has already been added to phonebook`)
      return 
    } else {
      setPersons(persons.concat(personObject))
      setNewName("")
      setNewNumber("")
    }
    
  }
  
  const handleNameChange = () => {
    setNewName(event.target.value)
  }
  const handleNumberChange = () => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = () => {
    setFilterName(event.target.value)
  }


  const filteredPersons = persons.filter((person) => 
    person.name.toLowerCase().includes(filterName.toLocaleLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input 
          value={newName}
          onChange={handleNameChange}/>
        </div>
        <div>
          number: <input 
          value={newNumber}
          onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      Search: <input
      value = {filterName}
      onChange={handleFilterChange}/>
      {filteredPersons.map(person => 
        <p key={person.name}>
          {person.name} {person.number}
        </p>
      )}
    </div>
  )
}

export default App
import { useState } from 'react'

const Person = ({person}) =>
  <p>{person.name} {person.number}</p>

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [displayPersons, setDisplayPersons] = useState(persons)

  const updateFilter = (event) => {
    setFilter(event.target.value)
    setDisplayPersons(persons.filter(
      (person) => person.name.toLowerCase().indexOf(event.target.value) !== -1
    ))
  }

  const handleAdd = (event) => {
    event.preventDefault()
    if (persons.find((person) => (person.name === newName))) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat({id: persons.length + 1, name: newName, number: newNumber}))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with
        <input value={filter} onChange={updateFilter} />
      </div>
      <h2>add a new</h2>
      <form>
        <div>name: <input value={newName} onChange={(event) => setNewName(event.target.value)} /></div>
        <div>number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)} /></div>
        <div><button type="submit" onClick={handleAdd}>add</button></div>
      </form>
      <h2>Numbers</h2>
      {displayPersons.map((person) => <Person key={person.name} person={person} />)}
    </div>
  )
}

export default App

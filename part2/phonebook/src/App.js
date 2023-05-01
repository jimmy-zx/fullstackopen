import { useState } from 'react'

const Filter = ({filter, setFilter}) =>
  <>
    filter shown with
    <input value={filter} onChange={(event) => setFilter(event.target.value)} />
  </>

const PersonForm = ({persons, setPersons}) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleAdd = (event) => {
    event.preventDefault()
    if (persons.find((person) => (person.name === newName))) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat({id: persons.length + 1, name: newName, number: newNumber}))
    }
  }
  return (
    <form>
      <div>name: <input value={newName} onChange={(event) => setNewName(event.target.value)} /></div>
      <div>number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)} /></div>
      <div><button type="submit" onClick={handleAdd}>add</button></div>
    </form>
  )
}

const Person = ({person}) =>
  <p>{person.name} {person.number}</p>

const Persons = ({persons, filter}) =>
  <>
    {persons.filter((person) => person.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1).map((person) => <Person key={person.id} person={person} />)}
  </>

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ])

  const [filter, setFilter] = useState('')

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} />
    </div>
  )
}

export default App

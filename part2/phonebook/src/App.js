import { useState } from 'react'

const Person = ({person}) =>
  <p>{person.name} {person.number}</p>

const App = () => {
  const [persons, setPersons] = useState([
    {id: 1, name: 'Arto Hellas', number: '040-1234567'},
  ])
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
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>name: <input value={newName} onChange={(event) => setNewName(event.target.value)} /></div>
        <div>number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)} /></div>
        <div><button type="submit" onClick={handleAdd}>add</button></div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => <Person key={person.name} person={person} />)}
    </div>
  )
}

export default App

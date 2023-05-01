import { useState } from 'react'

const Person = ({person}) =>
  <p>{person.name}</p>

const App = () => {
  const [persons, setPersons] = useState([
    { id: 1, name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  const updateNewName = (event) => {
    setNewName(event.target.value)
  }

  const handleAdd = (event) => {
    event.preventDefault()
    if (persons.find((person) => (person.name === newName))) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat({id: persons.length + 1, name: newName}))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input value={newName} onChange={updateNewName} />
        </div>
        <div>
          <button type="submit" onClick={handleAdd}>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => <Person key={person.id} person={person} />)}
    </div>
  )
}

export default App

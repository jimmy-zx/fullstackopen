import { useState, useEffect } from 'react';
import noteService from './services/notes';

const Filter = ({ filter, setFilter }) => (
  <>
    filter shown with
    <input value={filter} onChange={event => setFilter(event.target.value)} />
  </>
);

const PersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  const handleAdd = event => {
    event.preventDefault();
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      noteService
        .create({ name: newName, number: newNumber})
        .then(data => {
          setPersons(persons.concat(data));
        });
    }
  };
  return (
    <form>
      <div>
        name:{' '}
        <input
          value={newName}
          onChange={event => setNewName(event.target.value)}
        />
      </div>
      <div>
        number:{' '}
        <input
          value={newNumber}
          onChange={event => setNewNumber(event.target.value)}
        />
      </div>
      <div>
        <button type='submit' onClick={handleAdd}>
          add
        </button>
      </div>
    </form>
  );
};

const Person = ({ person }) => (
  <p>
    {person.name} {person.number}
  </p>
);

const Persons = ({ persons, filter }) => (
  <>
    {persons
      .filter(
        person => person.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1
      )
      .map(person => (
        <Person key={person.id} person={person} />
      ))}
  </>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    noteService.getAll().then(data => setPersons(data))
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} />
    </div>
  );
};

export default App;

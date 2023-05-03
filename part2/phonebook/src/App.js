import { useState, useEffect } from 'react';
import noteService from './services/notes';

const Notification = ({message}) =>
  message === null ? null : (
    <div className='error'>
      {message}
    </div>
  )

const Filter = ({ filter, setFilter }) => (
  <>
    filter shown with
    <input value={filter} onChange={event => setFilter(event.target.value)} />
  </>
);

const PersonForm = ({ persons, setPersons, setErrorMessage }) => {
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  const handleAdd = event => {
    event.preventDefault();
    const person = persons.find(p => p.name === newName);
    if (person) {
      const newPerson = {
        ...person,
        number: newNumber,
      };
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        noteService
          .update(person.id, newPerson)
          .then(() => {
            setPersons(persons.map((p) => p.name === newName ? newPerson : p));
            setErrorMessage(`Updated ${newName}`);
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          })
          .catch(error => {
            setErrorMessage(`Information of ${newName} has already been removed from the server`);
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });
      }
    } else {
      noteService.create({ name: newName, number: newNumber }).then(data => {
        setPersons(persons.concat(data));
        setErrorMessage(`Added ${newName}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
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

const Person = ({ person, persons, setPersons, setErrorMessage }) => {
  const handleDelete = () => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      noteService
        .del(person.id)
        .then(() => {
          setPersons(persons.filter((p) => (p.id !== person.id)))
        })
        .catch(error => {
          setErrorMessage(`Information of ${person.name} has already been removed from the server`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };
  return (
    <p>
      {person.name} {person.number}
      <button onClick={handleDelete}>delete</button>
    </p>
  );
};

const Persons = ({ persons, filter, setPersons, setErrorMessage }) => (
  <>
    {persons
      .filter(
        person => person.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1
      )
      .map(person => (
        <Person key={person.id} person={person} persons={persons} setPersons={setPersons} setErrorMessage={setErrorMessage} />
      ))}
  </>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    noteService.getAll().then(data => setPersons(data));
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons} setErrorMessage={setErrorMessage} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} setPersons={setPersons} setErrorMessage={setErrorMessage} />
    </div>
  );
};

export default App;

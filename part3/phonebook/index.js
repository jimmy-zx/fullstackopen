const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

const app = express();
app.use(express.static('build'));
app.use(express.json());
app.use(cors());

morgan.token('body', (req, res) => { return req.method === 'POST' ? JSON.stringify(req.body) : ''; });
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const MAX_ID = 2 ** 32;

let data = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
];

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people);
  });
});

app.get('/info', (request, response) => {
  const date = new Date();
  response.send(`
    <p>Phonebook has info for ${data.length} people.</p>
    <p>${date.toString()}</p>
    `);
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end();
      }
      response.json(person);
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number
  };
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
});

app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({ error: 'missing name' });
  }
  if (!body.number) {
    return response.status(400).json({ error: 'missing number' });
  }
  if (data.find(entry => body.name === entry.name)) {
    return response.status(400).json({ error: 'name must be unique' });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save().then(savedPerson => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

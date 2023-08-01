const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

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
  response.json(data);
});

app.get('/info', (request, response) => {
  const date = new Date();
  response.send(`
    <p>Phonebook has info for ${data.length} people.</p>
    <p>${date.toString()}</p>
    `);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = data.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  data = data.filter(person => person.id !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const person = request.body;
  if (!person.name) {
    response.status(400).json({ error: 'missing name' });
  } else if (!person.number) {
    response.status(400).json({ error: 'missing number' });
  } else if (data.find(entry => person.name === entry.name)) {
    response.status(400).json({ error: 'name must be unique' });
  } else {
    person.id = Math.floor(MAX_ID * Math.random());
    data = data.concat(person);
    response.json(person);
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

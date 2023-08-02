const secrets = require('./secrets');
const mongoose = require('mongoose');

if (process.argv < 3) {
  console.log('Usage: node mongo.js [password] [name] [number]');
  console.log('Usage: node mongo.js [password]');
}

mongoose.set('strictQuery', false);
mongoose.connect(secrets.url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 5) {
  const [, , , name, number] = process.argv;

  const person = new Person({
    name,
    number
  });

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person);
    });
    mongoose.connection.close();
  });
}

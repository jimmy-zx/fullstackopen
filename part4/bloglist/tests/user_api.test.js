const config = require('../utils/config');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const User = require('../models/user');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl);

describe('POST /api/users', () => {
  beforeAll(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('single creation', async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const createdUser = await User.find({ username: 'mluukkai' });

    expect(createdUser).toBeDefined();
  });

  test('Duplicate username', async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(await User.find({})).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

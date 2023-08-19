const config = require('../utils/config');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');
const { setup } = require('../utils/test_helper.js');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl);

describe('POST /api/users', () => {
  beforeAll(setup);

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

  test('username required', async () => {
    const result = await api
      .post('/api/users')
      .send({ password: '1234' })
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain('username');
  });

  test('username minLength', async () => {
    const result = await api
      .post('/api/users')
      .send({ username: 'ab', password: '1234' })
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain('username');
  });

  test('password required', async () => {
    const result = await api
      .post('/api/users')
      .send({ username: 'abc' })
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toMatch(/password/i);
  });

  test('password minLength', async () => {
    const result = await api
      .post('/api/users')
      .send({ username: 'abc', password: '12' })
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toMatch(/password/i);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

const config = require('../utils/config');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const { setup } = require('../utils/test_helper.js');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl);

describe('POST /api/login', () => {
  beforeAll(setup);

  test('Successful login', async () => {
    await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('Invalid username', async () => {
    await api
      .post('/api/login')
      .send({ username: 'does_not_exist', password: 'ne' })
      .expect(401);
  });

  test('Invalid password', async () => {
    await api
      .post('/api/login')
      .send({ username: 'root', password: 'ne' })
      .expect(401);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

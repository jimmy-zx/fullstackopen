const config = require('../utils/config');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const { setup, rootUser, getHeader } = require('../utils/test_helper.js');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl);

describe('POST /api/login', () => {
  beforeAll(setup);

  test('root login', async () => {
    const result = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(result.body).toHaveProperty('token');
  });
});

describe('GET /api/login', () => {
  beforeAll(setup);

  test('root login', async () => {
    const user = await api
      .get('/api/login')
      .set(await getHeader(api))
      .expect(200);
    expect(user.body.id).toEqual(rootUser._id);
    expect(user.body.username).toEqual(rootUser.username);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

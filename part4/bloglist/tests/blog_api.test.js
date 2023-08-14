const config = require('../utils/config');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

const initBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
];

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl);

describe('GET /api/blogs', () => {
  beforeAll(async () => {
    await Blog.deleteMany({});
    for (const blog of initBlogs) {
      const blogObj = new Blog(blog);
      await blogObj.save();
    }
  });

  test('Content-Type is JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 1000);

  test('Returns correct amount', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initBlogs.length);
  }, 1000);

  test('Returns id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach(blog => expect(blog.id).toBeDefined());
  }, 1000);
});

describe('POST /api/blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    for (const blog of initBlogs) {
      const blogObj = new Blog(blog);
      await blogObj.save();
    }
  });

  test('Adds blog', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'The author',
      url: 'http://example.com/',
      likes: 15
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const updatedBlogs = await Blog.find({});
    expect(updatedBlogs).toHaveLength(initBlogs.length + 1);
    expect(JSON.stringify(updatedBlogs)).toContain('New blog');
  });

  test('Default value for likes', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'The author',
      url: 'http://example.com/'
    };
    await api.post('/api/blogs').send(newBlog);
    const addedBlogs = await Blog.find({ title: newBlog.title });
    expect(addedBlogs[0].likes).toBe(0);
  });

  test('title and url are required', async () => {
    await api
      .post('/api/blogs')
      .send({ title: 'New blog', author: 'The author' })
      .expect(400);
    await api
      .post('/api/blogs')
      .send({ author: 'The author', url: 'http://example.com' })
      .expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

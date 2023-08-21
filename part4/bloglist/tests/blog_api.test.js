const config = require('../utils/config');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const {
  rootUser,
  initBlogs,
  setup,
  getHeader
} = require('../utils/test_helper');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl);

describe('GET /api/blogs', () => {
  beforeAll(setup);

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
  beforeEach(setup);

  test('Adds blog', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'The author',
      url: 'http://example.com/',
      likes: 15
    };
    await api
      .post('/api/blogs')
      .set(await getHeader(api))
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const updatedBlogs = await Blog.find({});
    expect(updatedBlogs).toHaveLength(initBlogs.length + 1);
    expect(JSON.stringify(updatedBlogs)).toContain('New blog');
  });

  test('Add blog without auth', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'The author',
      url: 'http://example.com/',
      likes: 15
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401);
  });

  test('Default value for likes', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'The author',
      url: 'http://example.com/'
    };
    await api
      .post('/api/blogs')
      .set(await getHeader(api))
      .send(newBlog);
    const addedBlogs = await Blog.find({ title: newBlog.title });
    expect(addedBlogs[0].likes).toBe(0);
  });

  test('title and url are required', async () => {
    await api
      .post('/api/blogs')
      .set(await getHeader(api))
      .send({ title: 'New blog', author: 'The author', user: rootUser._id })
      .expect(400);
    await api
      .post('/api/blogs')
      .set(await getHeader(api))
      .send({
        author: 'The author',
        url: 'http://example.com'
      })
      .expect(400);
  });
});

describe('DELETE /api/blogs', () => {
  beforeEach(setup);

  test('Successful deletion', async () => {
    const blogs = await Blog.find({});
    await api.delete(`/api/blogs/${blogs[0]._id}`).set(await getHeader(api)).expect(204);
    expect(await Blog.findById(blogs[0]._id)).toBeNull();
    expect(await Blog.find({})).toHaveLength(initBlogs.length - 1);
  });

  test('Unsuccessful deletion', async () => {
    await api.delete('/api/blogs/1').set(await getHeader(api)).expect(400);
  });
});

describe('PUT /api/blogs', () => {
  beforeEach(setup);

  test('Existing put', async () => {
    const blogs = await Blog.find({});
    const blog = {
      title: 'Updated blog',
      url: 'http://updated.com',
      user: rootUser._id
    };
    const response = await api
      .put(`/api/blogs/${blogs[0]._id}`)
      .send(blog)
      .expect(200);
    expect(response.body.title).toEqual(blog.title);
    expect(response.body.url).toEqual(blog.url);
    expect(await Blog.find({})).toHaveLength(initBlogs.length);
  });

  test('New put', async () => {
    const newBlog = {
      title: 'New blog',
      author: 'The author',
      url: 'http://example.com/',
      likes: 15,
      user: rootUser._id
    };
    await api
      .put('/api/blogs/000000000000000000000000')
      .send(newBlog)
      .expect(200);
  });

  test('Invalid id', async () => {
    await api
      .put('/api/blogs/1')
      .send({ title: 'New blog', url: 'http://example.com/' })
      .expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

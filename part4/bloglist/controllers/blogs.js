const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  console.log('POST');
  const blog = new Blog(request.body);
  console.log(blog);

  const result = await blog.save();
  response.status(201).json(result);
});

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndRemove(request.params.id);
  if (blog) {
    return response.status(204).end();
  }
  response.status(404).end();
});

module.exports = blogsRouter;

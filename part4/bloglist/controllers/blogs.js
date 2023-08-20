const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).end();
  }

  const blog = new Blog({ ...request.body, user: user.id });
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).end();
  }
  const blog = await Blog.findById(request.params.id).populate('user');
  if (!blog) {
    return response.status(404).end();
  }
  if (blog.user.id !== user.id) {
    return response.status(403).end();
  }
  user.blogs.remove(blog.id);
  await user.save();
  await blog.deleteOne();
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;

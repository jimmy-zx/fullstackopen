const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const User = require('../models/user');

let rootUser = {
  username: 'root',
  _id: '64e1112dabaed996cca8afb9',
  passwordHash: bcrypt.hashSync('sekret', 10),
  blogs: []
};

const initBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: rootUser._id,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: rootUser._id,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: rootUser._id,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    user: rootUser._id,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    user: rootUser._id,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: rootUser._id,
    __v: 0
  }
];

rootUser.blogs = initBlogs.map(blog => blog._id);

const setup = async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  const rootUserObj = new User(rootUser);
  await rootUserObj.save();
  for (const blog of initBlogs) {
    const blogObj = new Blog(blog);
    await blogObj.save();
  }
};

const main = async () => {
  const config = require('./config');
  const mongoose = require('mongoose');
  const mongoUrl = config.MONGODB_URI;

  console.log('Connecting to mongodb');
  await mongoose.connect(mongoUrl);

  console.log('Setting up');
  await setup();
  await mongoose.connection.close();
};

if (require.main === module) {
  main();
}

module.exports = { rootUser, initBlogs, setup };

const _ = require('lodash');

const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  return blogs.reduce((psum, blog) => psum + blog.likes, 0);
};

const favoriteBlog = blogs => {
  return blogs.reduce(
    (fav, blog) => (blog.likes > fav.likes ? blog : fav),
    blogs[0]
  );
};

const mostBlogs = blogs => {
  return _.maxBy(
    Object.values(_.groupBy(blogs, blog => blog.author)).map(obj => ({
      blogs: obj.length,
      author: obj[0].author
    })),
    obj => obj.blogs
  );
};

const mostLikes = blogs => {
  return _.maxBy(
    Object.values(_.groupBy(blogs, blog => blog.author)).map(obj => ({
      likes: obj.reduce((psum, blog) => psum + blog.likes, 0),
      author: obj[0].author
    })),
    obj => obj.likes
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};

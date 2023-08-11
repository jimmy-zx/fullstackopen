const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((psum, blog) => psum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((fav, blog) => blog.likes > fav.likes ? blog : fav, blogs[0]);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};

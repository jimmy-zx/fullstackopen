const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((psum, blog) => psum + blog.likes, 0);
};

module.exports = {
  dummy,
  totalLikes
};

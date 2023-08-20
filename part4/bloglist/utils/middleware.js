const config = require('./config');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const errorHandler = (error, request, response, next) => {
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'CastError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message });
  }
  next(error);
};

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  } else {
    return next();
  }
  const decodedToken = jwt.verify(request.token, config.SECRET);
  if (!decodedToken.id) {
    return next();
  }
  const user = await User.findById(decodedToken.id);
  request.user = user;
  next();
};

module.exports = {
  errorHandler,
  userExtractor
};

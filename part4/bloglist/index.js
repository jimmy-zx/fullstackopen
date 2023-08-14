const app = require('./app');
const config = require('./utils/config');
const mongoose = require('mongoose');

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl)
  .then(() => console.log('connected to MongoDB'));

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});

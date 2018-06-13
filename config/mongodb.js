
const config = {
  uri: 'mongodb://localhost:27017' || process.env.MONGO_URI,
  database: 'dbtodo' || process.env.MONGO_DATABASE
};

module.exports = config;
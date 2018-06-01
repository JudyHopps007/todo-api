
const config = {
  uri: "mongodb://localhost:27017/dbtodo" || process.env.MONGO_URI,
  options : {
    useMongoClient: true
  }
};

module.exports = config;
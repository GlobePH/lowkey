var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var mongodb = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hacker_db', {
  useMongoClient: true
});

mongodb.then((res) => {
  console.log(`Successfully connected to the database`);
}).catch((e) => {
  console.log(`Cannot connect to the database with error: ${e}`);
});

module.exports = { mongoose };

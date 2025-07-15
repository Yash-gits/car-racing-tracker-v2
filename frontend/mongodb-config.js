// MongoDB Configuration
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  const db = client.db('car_racing_tracker');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

module.exports = { connectToDatabase };

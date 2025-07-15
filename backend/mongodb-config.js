// mongodb.js

const { MongoClient } = require('mongodb');

// You can use dotenv if needed: require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority';
const DB_NAME = process.env.MONGODB_DB || 'car_racing_tracker';

if (!MONGODB_URI.includes('mongodb+srv') || MONGODB_URI.includes('<username>')) {
  console.warn('⚠️ WARNING: MongoDB URI is not properly configured.');
}

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    const db = client.db(DB_NAME);

    cachedClient = client;
    cachedDb = db;

    console.log(`✅ Connected to MongoDB: ${DB_NAME}`);
    return { client, db };

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
}

module.exports = { connectToDatabase };

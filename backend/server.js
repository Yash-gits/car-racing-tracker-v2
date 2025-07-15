require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const requestIp = require('request-ip');
const geoip = require('geoip-lite');

const app = express();
const PORT = process.env.PORT || 3000;

// Define MongoDB schema and model for logs
const LogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ip: String,
  userAgent: String,
  screenSize: {
    width: Number,
    height: Number,
    screenWidth: Number,
    screenHeight: Number
  },
  ipLocation: {
    country: String,
    region: String,
    city: String,
    ll: [Number]
  },
  referrer: String
});

const LocationSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  ip: String,
  preciseLocation: {
    latitude: Number,
    longitude: Number,
    accuracy: Number
  }
});

// Initialize models
let Log, Location;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());
app.use(requestIp.mw());

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Use MongoDB connection string from environment variables
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-racing-tracker';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
    
    // Initialize models after connection
    Log = mongoose.model('Log', LogSchema);
    Location = mongoose.model('Location', LocationSchema);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Routes
app.get('/', (req, res) => {
  res.send('Car Racing Tracker API is running');
});

// Log data endpoint
app.post('/api/log', async (req, res) => {
  try {
    const clientIp = req.clientIp;
    const geo = geoip.lookup(clientIp) || { country: 'Unknown', region: 'Unknown', city: 'Unknown', ll: [0, 0] };
    
    const logData = new Log({
      ip: clientIp,
      userAgent: req.headers['user-agent'],
      screenSize: req.body.screenSize,
      ipLocation: {
        country: geo.country,
        region: geo.region,
        city: geo.city,
        ll: geo.ll
      },
      referrer: req.headers.referer || 'Direct'
    });
    
    await logData.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error logging data:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Log precise location endpoint
app.post('/api/log-location', async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;
    
    const locationData = new Location({
      ip: req.clientIp,
      preciseLocation: {
        latitude,
        longitude,
        accuracy
      }
    });
    
    await locationData.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error logging location:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get all logs (protected endpoint for admin use)
app.get('/api/logs', async (req, res) => {
  try {
    // In a production app, you would add authentication here
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get all location logs (protected endpoint for admin use)
app.get('/api/locations', async (req, res) => {
  try {
    // In a production app, you would add authentication here
    const locations = await Location.find().sort({ timestamp: -1 });
    res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

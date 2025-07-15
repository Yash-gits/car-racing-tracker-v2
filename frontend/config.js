// Configuration file for MongoDB connection
// DO NOT commit this file to version control

const config = {
  // MongoDB Configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority',
    database: 'car_racing_tracker',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },

  // Application Configuration
  app: {
    name: 'Car Racing Tracker',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: true,
    enableFile: false,
    enableDatabase: true
  },

  // API Configuration
  api: {
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
    timeout: 30000,
    retries: 3
  },

  // Frontend Configuration
  frontend: {
    refreshInterval: 30000, // 30 seconds
    maxLapTimeDisplay: 100, // Maximum lap times to display
    defaultPageSize: 20,
    enableRealTimeUpdates: true
  },

  // Race Configuration
  race: {
    maxParticipants: 50,
    minLaps: 1,
    maxLaps: 500,
    defaultLaps: 10,
    lapTimeThreshold: 300000 // 5 minutes in milliseconds
  },

  // Driver Configuration
  driver: {
    experienceLevels: ['beginner', 'intermediate', 'advanced', 'professional'],
    maxCarNumber: 999,
    minCarNumber: 1
  },

  // Track Configuration
  track: {
    difficultyLevels: ['easy', 'medium', 'hard', 'expert'],
    minLength: 100, // meters
    maxLength: 50000, // meters
    maxTurns: 50
  }
};

// Environment-specific overrides
if (config.app.environment === 'production') {
  config.logging.enableConsole = false;
  config.logging.enableFile = true;
  config.frontend.enableRealTimeUpdates = false;
}

if (config.app.environment === 'development') {
  config.logging.level = 'debug';
  config.api.baseUrl = 'http://localhost:3000/api';
}

module.exports = config;

require('dotenv').config(); // Load .env variables

module.exports = {
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableConsole: true,
    enableFile: true,
    enableDatabase: true // set to true to enable MongoDB logging
  },
  mongodb: {
    uri: process.env.MONGODB_URI || ''
  },
  app: {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api'
  },
  github: {
    pagesUrl: process.env.GITHUB_PAGES_URL || ''
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || '',
    corsOrigin: process.env.CORS_ORIGIN || '*'
  },
  services: {
    weatherApiKey: process.env.WEATHER_API_KEY || '',
    mapsApiKey: process.env.MAPS_API_KEY || ''
  },
  backup: {
    frequency: process.env.BACKUP_FREQUENCY || 'daily',
    retentionDays: process.env.BACKUP_RETENTION_DAYS || 30
  }
};

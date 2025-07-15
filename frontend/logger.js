// logger.js
const fs = require('fs');
const path = require('path');
const winston = require('winston');
const config = require('./config');

// Ensure logs directory exists for file logging
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// ✅ JSON log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// ✅ Console output format for dev
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  })
);

// ✅ Setup transports
const transports = [];

// Console transport
if (config.logging.enableConsole) {
  transports.push(new winston.transports.Console({
    format: consoleFormat,
    level: config.logging.level || 'info'
  }));
}

// File transport
if (config.logging.enableFile) {
  transports.push(
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: logFormat,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: logFormat,
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5
    })
  );
}

// ✅ MongoDB transport
if (config.logging.enableDatabase && config.mongodb?.uri) {
  try {
    const MongoDBTransport = require('winston-mongodb').MongoDB;
    transports.push(new MongoDBTransport({
      db: config.mongodb.uri,
      collection: 'logs',
      level: 'info',
      format: logFormat,
      options: {
        useUnifiedTopology: true
      }
    }));
  } catch (err) {
    console.warn('⚠️ MongoDB transport not initialized:', err.message);
  }
}

// ✅ Create logger instance
const logger = winston.createLogger({
  level: config.logging.level || 'info',
  format: logFormat,
  transports,
  exitOnError: false
});


// ==========================
// ✳️ Custom Logging Methods
// ==========================

logger.database = (action, collection, data = {}) => {
  logger.info('Database Operation', {
    type: 'database',
    action,
    collection,
    data
  });
};

logger.api = (method, endpoint, statusCode, responseTime, data = {}) => {
  logger.info('API Request', {
    type: 'api',
    method,
    endpoint,
    statusCode,
    responseTime,
    data
  });
};

logger.race = (action, raceId, data = {}) => {
  logger.info('Race Event', {
    type: 'race',
    action,
    raceId,
    data
  });
};

logger.driver = (action, driverId, data = {}) => {
  logger.info('Driver Event', {
    type: 'driver',
    action,
    driverId,
    data
  });
};

logger.lapTime = (action, lapData = {}) => {
  logger.info('Lap Time Event', {
    type: 'lapTime',
    action,
    raceId: lapData?.raceId,
    driverId: lapData?.driverId,
    lapNumber: lapData?.lapNumber,
    lapTime: lapData?.lapTime
  });
};

logger.performance = (operation, startTime, data = {}) => {
  const duration = Date.now() - startTime;
  logger.info('Performance Metric', {
    type: 'performance',
    operation,
    duration,
    data
  });
};

logger.system = (metric, value, unit = '') => {
  logger.info('System Metric', {
    type: 'system',
    metric,
    value,
    unit
  });
};

logger.location = (deviceInfo = {}, locationInfo = {}, ipDetails = {}) => {
  logger.info('Location Access', {
    type: 'location',
    device: deviceInfo,
    location: locationInfo,
    ip: ipDetails
  });
};

// Global logger error handler
logger.on('error', (err) => {
  console.error('❌ Logger internal error:', err);
});

module.exports = logger;

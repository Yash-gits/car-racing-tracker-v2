// Logging Configuration
const winston = require('winston');
const config = require('./config');

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  })
);

// Create transports array
const transports = [];

// Console transport (for development)
if (config.logging.enableConsole) {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: config.logging.level
    })
  );
}

// File transport (for production)
if (config.logging.enableFile) {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: logFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );
}

// MongoDB transport (for database logging)
if (config.logging.enableDatabase && config.mongodb.uri) {
  const MongoDBTransport = require('winston-mongodb').MongoDB;
  transports.push(
    new MongoDBTransport({
      db: config.mongodb.uri,
      collection: 'logs',
      level: 'info',
      format: logFormat,
      options: {
        useUnifiedTopology: true
      }
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  transports,
  exitOnError: false
});

// Add custom logging methods
logger.database = (action, collection, data = {}) => {
  logger.info('Database Operation', {
    type: 'database',
    action,
    collection,
    data,
    timestamp: new Date().toISOString()
  });
};

logger.api = (method, endpoint, statusCode, responseTime, data = {}) => {
  logger.info('API Request', {
    type: 'api',
    method,
    endpoint,
    statusCode,
    responseTime,
    data,
    timestamp: new Date().toISOString()
  });
};

logger.race = (action, raceId, data = {}) => {
  logger.info('Race Event', {
    type: 'race',
    action,
    raceId,
    data,
    timestamp: new Date().toISOString()
  });
};

logger.driver = (action, driverId, data = {}) => {
  logger.info('Driver Event', {
    type: 'driver',
    action,
    driverId,
    data,
    timestamp: new Date().toISOString()
  });
};

logger.lapTime = (action, lapData) => {
  logger.info('Lap Time Event', {
    type: 'lapTime',
    action,
    raceId: lapData.raceId,
    driverId: lapData.driverId,
    lapNumber: lapData.lapNumber,
    lapTime: lapData.lapTime,
    timestamp: new Date().toISOString()
  });
};

// Error handling for logger
logger.on('error', (error) => {
  console.error('Logger error:', error);
});

// Performance monitoring
logger.performance = (operation, startTime, data = {}) => {
  const duration = Date.now() - startTime;
  logger.info('Performance Metric', {
    type: 'performance',
    operation,
    duration,
    data,
    timestamp: new Date().toISOString()
  });
};

// System monitoring
logger.system = (metric, value, unit = '') => {
  logger.info('System Metric', {
    type: 'system',
    metric,
    value,
    unit,
    timestamp: new Date().toISOString()
  });
};

module.exports = logger;

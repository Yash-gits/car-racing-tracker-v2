// MongoDB Schema Definitions
const mongoose = require('mongoose');

// Race Schema
const raceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  track: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  weather: {
    type: String,
    enum: ['sunny', 'cloudy', 'rainy', 'windy'],
    default: 'sunny'
  },
  trackCondition: {
    type: String,
    enum: ['dry', 'wet', 'mixed'],
    default: 'dry'
  },
  totalLaps: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  participants: [{
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver'
    },
    carNumber: Number,
    startingPosition: Number
  }]
}, {
  timestamps: true
});

// Driver Schema
const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  carNumber: {
    type: Number,
    required: true
  },
  team: {
    type: String,
    trim: true
  },
  nationality: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'professional'],
    default: 'beginner'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Lap Time Schema
const lapTimeSchema = new mongoose.Schema({
  raceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Race',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  lapNumber: {
    type: Number,
    required: true,
    min: 1
  },
  lapTime: {
    type: Number, // in milliseconds
    required: true,
    min: 0
  },
  sector1Time: {
    type: Number,
    min: 0
  },
  sector2Time: {
    type: Number,
    min: 0
  },
  sector3Time: {
    type: Number,
    min: 0
  },
  topSpeed: {
    type: Number,
    min: 0
  },
  position: {
    type: Number,
    min: 1
  },
  gap: {
    type: Number // gap to leader in milliseconds
  }
}, {
  timestamps: true
});

// Track Schema
const trackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  length: {
    type: Number, // in meters
    required: true,
    min: 0
  },
  turns: {
    type: Number,
    required: true,
    min: 0
  },
  lapRecord: {
    time: Number, // in milliseconds
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver'
    },
    date: Date
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'expert'],
    default: 'medium'
  }
}, {
  timestamps: true
});

// Create Models
const Race = mongoose.model('Race', raceSchema);
const Driver = mongoose.model('Driver', driverSchema);
const LapTime = mongoose.model('LapTime', lapTimeSchema);
const Track = mongoose.model('Track', trackSchema);

module.exports = {
  Race,
  Driver,
  LapTime,
  Track,
  raceSchema,
  driverSchema,
  lapTimeSchema,
  trackSchema
};

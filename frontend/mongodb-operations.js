// MongoDB Operations
const { connectToDatabase } = require('./mongodb-config');

class DatabaseOperations {
  
  // Race Operations
  async createRace(raceData) {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection('races').insertOne({
        ...raceData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return result;
    } catch (error) {
      console.error('Error creating race:', error);
      throw error;
    }
  }

  async getRaces(filter = {}) {
    try {
      const { db } = await connectToDatabase();
      const races = await db.collection('races').find(filter).toArray();
      return races;
    } catch (error) {
      console.error('Error fetching races:', error);
      throw error;
    }
  }

  async updateRace(raceId, updateData) {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection('races').updateOne(
        { _id: raceId },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
      return result;
    } catch (error) {
      console.error('Error updating race:', error);
      throw error;
    }
  }

  // Driver Operations
  async createDriver(driverData) {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection('drivers').insertOne({
        ...driverData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return result;
    } catch (error) {
      console.error('Error creating driver:', error);
      throw error;
    }
  }

  async getDrivers(filter = {}) {
    try {
      const { db } = await connectToDatabase();
      const drivers = await db.collection('drivers').find(filter).toArray();
      return drivers;
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  }

  // Lap Time Operations
  async recordLapTime(lapData) {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection('lap_times').insertOne({
        ...lapData,
        recordedAt: new Date()
      });
      return result;
    } catch (error) {
      console.error('Error recording lap time:', error);
      throw error;
    }
  }

  async getLapTimes(raceId) {
    try {
      const { db } = await connectToDatabase();
      const lapTimes = await db.collection('lap_times')
        .find({ raceId })
        .sort({ lapNumber: 1 })
        .toArray();
      return lapTimes;
    } catch (error) {
      console.error('Error fetching lap times:', error);
      throw error;
    }
  }

  // Analytics Operations
  async getDriverStats(driverId) {
    try {
      const { db } = await connectToDatabase();
      const stats = await db.collection('lap_times').aggregate([
        { $match: { driverId } },
        {
          $group: {
            _id: '$driverId',
            totalLaps: { $sum: 1 },
            bestLapTime: { $min: '$lapTime' },
            averageLapTime: { $avg: '$lapTime' },
            totalRaces: { $addToSet: '$raceId' }
          }
        }
      ]).toArray();
      return stats[0] || null;
    } catch (error) {
      console.error('Error fetching driver stats:', error);
      throw error;
    }
  }
}

module.exports = new DatabaseOperations();

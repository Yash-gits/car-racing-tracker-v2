
// database-operations.js

const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('./mongodb-config');

class DatabaseOperations {

  // 🏁 Race Operations
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
      console.error('❌ Error creating race:', error);
      throw error;
    }
  }

  async getRaces(filter = {}) {
    try {
      const { db } = await connectToDatabase();
      return await db.collection('races').find(filter).toArray();
    } catch (error) {
      console.error('❌ Error fetching races:', error);
      throw error;
    }
  }

  async updateRace(raceId, updateData) {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection('races').updateOne(
        { _id: new ObjectId(raceId) },
        { $set: { ...updateData, updatedAt: new Date() } }
      );
      return result;
    } catch (error) {
      console.error('❌ Error updating race:', error);
      throw error;
    }
  }

  // 👨‍✈️ Driver Operations
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
      console.error('❌ Error creating driver:', error);
      throw error;
    }
  }

  async getDrivers(filter = {}) {
    try {
      const { db } = await connectToDatabase();
      return await db.collection('drivers').find(filter).toArray();
    } catch (error) {
      console.error('❌ Error fetching drivers:', error);
      throw error;
    }
  }

  // ⏱️ Lap Time Operations
  async recordLapTime(lapData) {
    try {
      const { db } = await connectToDatabase();
      const result = await db.collection('lap_times').insertOne({
        ...lapData,
        recordedAt: new Date()
      });
      return result;
    } catch (error) {
      console.error('❌ Error recording lap time:', error);
      throw error;
    }
  }

  async getLapTimes(raceId) {
    try {
      const { db } = await connectToDatabase();
      return await db.collection('lap_times')
        .find({ raceId })
        .sort({ lapNumber: 1 })
        .toArray();
    } catch (error) {
      console.error('❌ Error fetching lap times:', error);
      throw error;
    }
  }

  // 📊 Analytics Operations
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
        },
        {
          $project: {
            _id: 0,
            driverId: '$_id',
            totalLaps: 1,
            bestLapTime: 1,
            averageLapTime: 1,
            raceCount: { $size: '$totalRaces' }
          }
        }
      ]).toArray();

      return stats[0] || null;
    } catch (error) {
      console.error('❌ Error fetching driver stats:', error);
      throw error;
    }
  }
}

module.exports = new DatabaseOperations();

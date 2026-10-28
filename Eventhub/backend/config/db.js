// config/db.js
// ─── MongoDB Connection Helper ───
// Uses mongoose.connect() with the MONGO_URI from environment variables.
// Logs success or exits the process on failure so the app never runs
// in a silently-broken state.

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // mongoose.connect returns a connection object; we grab the host to log it
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    // If the DB is unreachable we exit immediately – there is no point
    // in serving API requests that would all fail anyway.
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

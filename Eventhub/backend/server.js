// server.js
// ─── EventHub Backend Entry Point ───
// Loads environment variables, connects to MongoDB, registers middleware
// and routes, then starts the Express server.

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Middleware imports
const requestLogger = require('./middleware/requestLogger');
const authGuard = require('./middleware/authGuard');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const ticketRoutes = require('./routes/tickets');

// ─── Load .env variables into process.env ───
dotenv.config();

// ─── Connect to MongoDB ───
connectDB();

// ─── Create Express App ───
const app = express();

// ─── Global Middleware ───
app.use(cors());               // Enable CORS for all origins (needed for React dev proxy)
app.use(express.json());       // Parse JSON request bodies (req.body)
app.use(requestLogger);        // Log every request: [METHOD] [PATH] [TIMESTAMP]

// ─── Health Check Route ───
// Simple endpoint to verify the server is running (used by Docker health checks)
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'EventHub API is healthy 🚀' });
});

// ─── API Routes ───
// Auth routes are PUBLIC (no authGuard)
app.use('/api/v1/auth', authRoutes);

// Event GET is public (handled inside the route file),
// Event POST is protected (authGuard applied inside the route file)
app.use('/api/v1/events', eventRoutes);

// All ticket routes are PROTECTED – apply authGuard to the entire router
app.use('/api/v1/tickets', authGuard, ticketRoutes);

// ─── Global Error Handler (must be LAST middleware) ───
app.use(errorHandler);

// ─── Start Server ───
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 EventHub API server running on port ${PORT}`);
});

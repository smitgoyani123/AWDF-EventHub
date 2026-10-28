// middleware/requestLogger.js
// ─── Global Request Logger Middleware ───
// Logs every incoming HTTP request in the format: [METHOD] [PATH] [TIMESTAMP]
// Applied globally (app.use) BEFORE route handlers so every request is logged.

const requestLogger = (req, res, next) => {
  // new Date().toISOString() gives a UTC timestamp like "2026-10-28T18:30:00.000Z"
  console.log(`[${req.method}] ${req.path} [${new Date().toISOString()}]`);
  next(); // pass control to the next middleware / route handler
};

module.exports = requestLogger;

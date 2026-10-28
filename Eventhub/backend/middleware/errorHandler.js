// middleware/errorHandler.js
// ─── Global Error Handler Middleware ───
// Express identifies an error-handling middleware by its 4-parameter signature
// (err, req, res, next). This MUST be the LAST app.use() in server.js.
//
// Purpose: catch any error thrown/passed via next(err) and return a clean
// JSON response instead of a raw stack trace or Mongoose error dump.

const errorHandler = (err, req, res, next) => {
  // Log the full error on the server for debugging (never sent to the client)
  console.error('❌ Error:', err);

  // ── Mongoose ValidationError ──
  // Occurs when a document fails schema validation (e.g. missing required field).
  // We extract the individual field-level messages and return them as a single string.
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
  }

  // ── Mongoose CastError ──
  // Occurs when an invalid ObjectId is passed (e.g. GET /tickets/not-an-id).
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // ── MongoDB Duplicate Key Error (code 11000) ──
  // Happens when a unique field (like email) already exists in the collection.
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Duplicate value for field: ${field}`,
    });
  }

  // ── Generic / Unknown Error ──
  // Fall back to 500 and use the error's own message if available.
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;

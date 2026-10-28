// middleware/authGuard.js
// ─── JWT Authentication Guard Middleware ───
// Validates the "Authorization: Bearer <token>" header.
// On success: attaches { id, role } to req.user so downstream handlers
//   know which user is making the request.
// On failure: returns a 401 JSON response and does NOT call next().

const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
  // 1. Read the Authorization header
  const authHeader = req.headers.authorization;

  // 2. Check that the header exists and follows the "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  // 3. Extract the token string (everything after "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // 4. Verify the token using the same secret that was used to sign it.
    //    jwt.verify() throws if the token is expired, tampered, or invalid.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attach the decoded payload (id + role) to the request object
    //    so that route handlers can access req.user.id and req.user.role.
    req.user = { id: decoded.id, role: decoded.role };

    next(); // token is valid – proceed to the route handler
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

module.exports = authGuard;

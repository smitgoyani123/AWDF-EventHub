// routes/auth.js
// ─── Authentication Routes ───
// POST /api/v1/auth/login  — accepts { email, password }, returns a signed JWT.

const express = require('express');
const jwt = require('jsonwebtoken');
const Attendee = require('../models/Attendee');

const router = express.Router();

// POST /api/v1/auth/login
// Body: { email: string, password: string }
// Returns: { success, token, attendee: { id, name, email, role } }
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate that both fields were sent
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // 2. Look up the attendee by email (email is stored lowercase in the schema)
    const attendee = await Attendee.findOne({ email: email.toLowerCase() });
    if (!attendee) {
      // Generic message to avoid leaking whether the email exists
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 3. Compare the plain-text password with the stored bcrypt hash
    const isMatch = await attendee.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 4. Sign a JWT containing the attendee's id and role.
    //    expiresIn '7d' means the user stays logged in for a week.
    const token = jwt.sign(
      { id: attendee._id, role: attendee.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Return the token and a sanitised attendee object (no password)
    res.status(200).json({
      success: true,
      token,
      attendee: {
        id: attendee._id,
        name: attendee.name,
        email: attendee.email,
        role: attendee.role,
      },
    });
  } catch (err) {
    next(err); // forward unexpected errors to the global errorHandler
  }
});

module.exports = router;

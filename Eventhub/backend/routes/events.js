// routes/events.js
// ─── Event Routes ───
// GET  /api/v1/events       — public, returns all events
// POST /api/v1/events       — protected (organizer/admin only), creates an event

const express = require('express');
const Event = require('../models/Event');
const authGuard = require('../middleware/authGuard');

const router = express.Router();

// ────────────────────────────────────────────────
// GET /api/v1/events  (Public – no authGuard)
// Returns all events sorted by date (newest first).
// ────────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // ascending by date
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
});

// ────────────────────────────────────────────────
// POST /api/v1/events  (Protected – organizer or admin only)
// Body: { title, category, date, venue, ticketsAvailable }
// ────────────────────────────────────────────────
router.post('/', authGuard, async (req, res, next) => {
  try {
    // Role check: only organizers and admins may create events
    if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only organizers or admins can create events.',
      });
    }

    const { title, category, date, venue, ticketsAvailable } = req.body;

    // Mongoose will run schema-level validation (required fields, min values)
    const event = await Event.create({
      title,
      category,
      date,
      venue,
      ticketsAvailable,
    });

    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

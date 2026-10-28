// routes/tickets.js
// ─── Ticket Routes (all protected by authGuard) ───
// POST   /api/v1/tickets           — book tickets for an event
// GET    /api/v1/tickets/my        — get the logged-in user's tickets
// PATCH  /api/v1/tickets/:id/status — update ticket status (book/cancel/use)

const express = require('express');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');

const router = express.Router();

// ────────────────────────────────────────────────
// POST /api/v1/tickets
// Body: { eventId, quantity }
// Books 'quantity' tickets for the given event, decrementing ticketsAvailable.
// ────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const { eventId, quantity } = req.body;

    // 1. Validate inputs
    if (!eventId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'eventId and quantity are required.',
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1.',
      });
    }

    // 2. Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    // 3. Check ticket availability – never let the count go negative
    if (event.ticketsAvailable < quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough tickets available. Only ${event.ticketsAvailable} ticket(s) remaining for "${event.title}".`,
      });
    }

    // 4. Create the ticket document
    //    req.user.id is set by the authGuard middleware
    const ticket = await Ticket.create({
      attendeeId: req.user.id,
      eventId,
      quantity,
    });

    // 5. Atomically decrement the event's ticketsAvailable using $inc.
    //    $inc is atomic at the MongoDB level, preventing race conditions.
    await Event.findByIdAndUpdate(eventId, {
      $inc: { ticketsAvailable: -quantity },
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
});

// ────────────────────────────────────────────────
// GET /api/v1/tickets/my
// Returns only the logged-in attendee's tickets.
// Uses .populate() to embed attendee and event details.
// ────────────────────────────────────────────────
router.get('/my', async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ attendeeId: req.user.id })
      .populate('attendeeId', 'name email')   // only embed name & email
      .populate('eventId', 'title date venue') // only embed title, date, venue
      .sort({ bookingDate: -1 });              // newest bookings first

    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    next(err);
  }
});

// ────────────────────────────────────────────────
// PATCH /api/v1/tickets/:id/status
// Body: { status } — must be one of 'booked', 'cancelled', 'used'
// A user may update only their own ticket; admin can update any.
// If status becomes 'cancelled', refund the quantity back to the event.
// ────────────────────────────────────────────────
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['booked', 'cancelled', 'used'];

    // 1. Validate the requested status value
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    // 2. Find the ticket by ID
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found.',
      });
    }

    // 3. Ownership check: only the ticket owner OR an admin may update
    if (ticket.attendeeId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own tickets.',
      });
    }

    // 4. If changing TO 'cancelled' (and it wasn't already cancelled),
    //    give the quantity back to the event's ticketsAvailable.
    if (status === 'cancelled' && ticket.status !== 'cancelled') {
      await Event.findByIdAndUpdate(ticket.eventId, {
        $inc: { ticketsAvailable: ticket.quantity },
      });
    }

    // 5. Update the ticket status and return the updated document
    ticket.status = status;
    await ticket.save();

    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

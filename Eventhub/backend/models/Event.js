// models/Event.js
// ─── Event Schema ───
// Represents a bookable event with a finite number of tickets.

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    // Event title – displayed on EventCards and tickets
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },

    // Category for filtering (Technology, Music, Workshop, Sports, etc.)
    category: {
      type: String,
      trim: true,
    },

    // Date & time of the event – required so we can sort/display correctly
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },

    // Physical venue where the event takes place
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },

    // Number of tickets still available for booking.
    // min: 0 ensures it never goes negative at the schema level.
    ticketsAvailable: {
      type: Number,
      min: [0, 'Tickets available cannot be negative'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);

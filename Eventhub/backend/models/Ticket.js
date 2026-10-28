// models/Ticket.js
// ─── Ticket Schema ───
// Represents a booking: links one Attendee to one Event with a quantity.

const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    // Reference to the Attendee who booked. 'ref' enables .populate().
    attendeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Attendee',
      required: [true, 'Attendee ID is required'],
    },

    // Reference to the Event being booked
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },

    // How many tickets were booked in this single transaction
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },

    // Automatically set to the current date/time when the ticket is created
    bookingDate: {
      type: Date,
      default: Date.now,
    },

    // Lifecycle: booked → used  OR  booked → cancelled
    status: {
      type: String,
      enum: ['booked', 'cancelled', 'used'],
      default: 'booked',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);

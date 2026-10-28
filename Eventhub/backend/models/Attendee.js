// models/Attendee.js
// ─── Attendee (User) Schema ───
// Represents a user who can log in and book tickets.
// Passwords are hashed using bcrypt before being saved (pre-save hook).

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const attendeeSchema = new mongoose.Schema(
  {
    // Full name of the attendee – required for display in tickets & navbar
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    // Email is the unique login identifier – stored in lowercase to avoid
    // case-sensitive duplicate issues (e.g. "A@b.com" vs "a@b.com")
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,           // Mongoose schema-level transform
      trim: true,
    },

    // Optional phone field
    phone: {
      type: String,
      trim: true,
    },

    // Password is stored as a bcrypt hash – never in plain text
    password: {
      type: String,
      required: [true, 'Password is required'],
    },

    // Role-based access control: determines what routes a user may access
    role: {
      type: String,
      enum: ['attendee', 'organizer', 'admin'],  // only these 3 values allowed
      default: 'attendee',
    },
  },
  {
    // Adds createdAt and updatedAt timestamps automatically
    timestamps: true,
  }
);

// ─── Pre-save Hook: Hash password before persisting ───
// 'this' refers to the document being saved.
// We only hash if the password field was modified (avoids double-hashing on updates).
attendeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);         // 10 rounds is a good default
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Method: Compare a plain-text password against the stored hash ───
// Used during login to verify credentials.
attendeeSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Attendee', attendeeSchema);

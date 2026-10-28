// seed.js
// ─── Database Seeder ───
// Inserts demo users (admin, organizer, attendee) and 5 sample events.
// Run with:  npm run seed   (or:  node seed.js)
// The script connects to MongoDB, clears existing data, inserts fresh
// seed data, then disconnects. Passwords are plain text here but will be
// bcrypt-hashed automatically by the Attendee pre-save hook.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Attendee = require('./models/Attendee');
const Event = require('./models/Event');
const Ticket = require('./models/Ticket');

// Load environment variables
dotenv.config();

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // ── Clear existing collections ──
    await Attendee.deleteMany({});
    await Event.deleteMany({});
    await Ticket.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ── Seed Attendees (Users) ──
    // Passwords here are plain text; the Attendee pre-save hook will bcrypt them.
    // These are the demo credentials documented in the README.
    const attendees = await Attendee.create([
      {
        name: 'Super Admin',
        email: 'admin@eventhub.com',
        phone: '9998887776',
        password: 'admin123',       // Demo password for admin
        role: 'admin',
      },
      {
        name: 'Priya Patel',
        email: 'priya@organizer.com',
        phone: '9123456780',
        password: 'organizer123',   // Demo password for organizer
        role: 'organizer',
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '9876543210',
        password: 'attendee123',    // Demo password for attendee
        role: 'attendee',
      },
    ]);
    console.log(`👤 Seeded ${attendees.length} attendees`);

    // ── Seed Events ──
    // 5 sample events, including one with ticketsAvailable: 0 (sold out)
    const events = await Event.create([
      {
        title: 'National Hackathon 2026',
        category: 'Technology',
        date: new Date('2026-11-15T09:00:00Z'),
        venue: 'CSPIT Auditorium, CHARUSAT',
        ticketsAvailable: 45,
      },
      {
        title: 'Sunburn Campus Beats',
        category: 'Music',
        date: new Date('2026-12-05T18:00:00Z'),
        venue: 'Open Air Theatre, Anand',
        ticketsAvailable: 120,
      },
      {
        title: 'AI & Deep Learning Masterclass',
        category: 'Workshop',
        date: new Date('2026-11-28T10:00:00Z'),
        venue: 'Seminar Hall 3, IT Dept',
        ticketsAvailable: 15,
      },
      {
        title: 'Inter-College Football Cup',
        category: 'Sports',
        date: new Date('2026-12-10T15:30:00Z'),
        venue: 'University Sports Complex',
        ticketsAvailable: 0,         // ← Sold out event for testing
      },
      {
        title: 'Cloud Computing Summit',
        category: 'Technology',
        date: new Date('2026-12-20T10:00:00Z'),
        venue: 'Conference Hall, IT Tower',
        ticketsAvailable: 80,
      },
    ]);
    console.log(`🎫 Seeded ${events.length} events`);

    console.log('\n🌱 Seeding complete!');
    console.log('─────────────────────────────────────');
    console.log('Demo Login Credentials:');
    console.log('  Admin:     admin@eventhub.com     / admin123');
    console.log('  Organizer: priya@organizer.com    / organizer123');
    console.log('  Attendee:  rahul@example.com      / attendee123');
    console.log('─────────────────────────────────────');

    // Disconnect after seeding
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDB();

const express = require('express');
const cors = require('cors');

const requestLogger = require('./middleware/requestLogger');
const authGuard = require('./middleware/authGuard');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const ticketRoutes = require('./routes/tickets');

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'EventHub API is healthy 🚀' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/tickets', authGuard, ticketRoutes);

app.use(errorHandler);

module.exports = app;

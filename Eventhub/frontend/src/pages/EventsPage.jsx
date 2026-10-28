// pages/EventsPage.jsx
// ─── Events Page ───
// Fetches all events from GET /api/v1/events on mount.
// Features:
//   • 3 states: loading, error, events list
//   • Client-side search box (filters by title using .filter())
//   • Booking form: select event → enter quantity → POST /api/v1/tickets
//   • Refreshes events list after a booking to show updated ticket counts

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';

const API = '/api/v1';

const EventsPage = () => {
  const { token } = useAuth();

  // ── State ──
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');  // 'success' or 'error'

  // Booking form state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [booking, setBooking] = useState(false);

  // ── Fetch events from the API on mount ──
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API}/events`);
      setEvents(res.data.data);     // API returns { success, count, data: [...] }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  // useEffect with empty dependency array = runs once on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // ── Book tickets handler ──
  const handleBookTicket = async () => {
    if (!selectedEvent || quantity < 1) return;
    setBooking(true);
    try {
      await axios.post(
        `${API}/tickets`,
        { eventId: selectedEvent._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }  // attach JWT
      );
      showMessage(`🎉 Successfully booked ${quantity} ticket(s) for "${selectedEvent.title}"!`, 'success');
      setSelectedEvent(null);
      setQuantity(1);
      fetchEvents();  // refresh events to show updated ticketsAvailable
    } catch (err) {
      showMessage(err.response?.data?.message || 'Booking failed.', 'error');
    } finally {
      setBooking(false);
    }
  };

  // Helper to show a temporary message banner
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  // ── Client-side search: filter the ALREADY-FETCHED array by title ──
  // No new API call is made; this is purely in-memory filtering.
  const filteredEvents = events.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      {/* Page Header with search box */}
      <div className="page-header">
        <div>
          <h2>Available Events</h2>
          <p className="page-subtitle">Browse and book live event tickets online</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="🔍 Search events by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '0.9rem',
              width: '260px',
            }}
          />
        </div>
      </div>

      {/* Success / Error message banner */}
      {message && (
        <div
          className="alert"
          style={{
            background: messageType === 'success' ? '#d1fae5' : '#fee2e2',
            color: messageType === 'success' ? '#065f46' : '#dc2626',
            border: `1px solid ${messageType === 'success' ? '#a7f3d0' : '#fca5a5'}`,
          }}
        >
          {message}
        </div>
      )}

      {/* Booking form – shown when an event's "Book" button is clicked */}
      {selectedEvent && (
        <div className="organizer-form-card" style={{ marginBottom: '1.5rem' }}>
          <h3>Book Tickets: {selectedEvent.title}</h3>
          <p className="page-subtitle" style={{ marginBottom: '1rem' }}>
            {selectedEvent.ticketsAvailable} ticket(s) available at {selectedEvent.venue}
          </p>
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={selectedEvent.ticketsAvailable}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn-primary"
              onClick={handleBookTicket}
              disabled={booking}
              style={{ flex: 1 }}
            >
              {booking ? 'Booking...' : `Confirm Booking (${quantity} ticket${quantity > 1 ? 's' : ''})`}
            </button>
            <button
              className="btn-cancel"
              onClick={() => { setSelectedEvent(null); setQuantity(1); }}
              style={{ flex: 0, padding: '0.75rem 1.5rem' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Event cards grid: loading → error → empty → list */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading events, please wait...</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <p style={{ color: '#dc2626' }}>❌ {error}</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="empty-state">
          <p>No events found{searchTerm ? ` matching "${searchTerm}"` : ''}.</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <EventCard
              key={event._id}
              title={event.title}
              category={event.category}
              date={event.date}
              venue={event.venue}
              ticketsAvailable={event.ticketsAvailable}
              onBook={() => setSelectedEvent(event)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;

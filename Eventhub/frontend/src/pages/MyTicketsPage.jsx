// pages/MyTicketsPage.jsx
// ─── My Tickets Page ───
// Fetches the logged-in user's tickets from GET /api/v1/tickets/my.
// Each ticket card shows event details (populated from the backend) and
// a "Cancel Booking" button that PATCHes the ticket status to 'cancelled'.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = '/api/v1';

const MyTicketsPage = () => {
  const { user, token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ── Fetch the user's tickets on mount ──
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(`${API}/tickets/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data.data);  // API returns { success, count, data: [...] }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ── Cancel a ticket booking ──
  // PATCHes status to 'cancelled', which also refunds the tickets on the backend.
  const handleCancelTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to cancel this ticket booking?')) return;
    try {
      await axios.patch(
        `${API}/tickets/${ticketId}/status`,
        { status: 'cancelled' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh tickets list to show the updated status
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel ticket.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>My Booked Tickets</h2>
          <p className="page-subtitle">
            Attendee: <strong>{user?.name}</strong> ({user?.email})
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Fetching your tickets...</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <p style={{ color: '#dc2626' }}>❌ {error}</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          <p>You haven't booked any event tickets yet.</p>
          {/* Using Link instead of <a> to avoid full-page reload */}
          <Link to="/events" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="tickets-grid">
          {tickets.map((t) => (
            <div key={t._id} className="ticket-card">
              <div className="ticket-header">
                {/* Show last 6 chars of the ticket ID as a short reference */}
                <span className="ticket-id">#{t._id.slice(-6).toUpperCase()}</span>
                <span className={`status-badge status-${t.status}`}>
                  {t.status.toUpperCase()}
                </span>
              </div>

              {/* eventId is populated by the backend with { title, date, venue } */}
              <h3 className="ticket-event-title">{t.eventId?.title || 'Unknown Event'}</h3>
              <p className="ticket-info">📍 {t.eventId?.venue || 'N/A'}</p>
              <p className="ticket-info">
                📅 {t.eventId?.date
                  ? new Date(t.eventId.date).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>

              <div className="ticket-meta">
                <div>
                  <small>Quantity</small>
                  <p><strong>{t.quantity} ticket(s)</strong></p>
                </div>
                <div>
                  <small>Booked On</small>
                  <p>{new Date(t.bookingDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Only show Cancel button if ticket is still 'booked' */}
              {t.status === 'booked' && (
                <button
                  onClick={() => handleCancelTicket(t._id)}
                  className="btn-cancel"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTicketsPage;

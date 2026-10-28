// pages/OrganizerPanel.jsx
// ─── Organizer Panel (Lazy-Loaded) ───
// A form to create new events via POST /api/v1/events.
// Only accessible by users with role 'organizer' or 'admin' (enforced
// by ProtectedRoute and the backend route).
// This file is code-split via React.lazy() in App.jsx.

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = '/api/v1';

const OrganizerPanel = () => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    date: '',
    venue: '',
    ticketsAvailable: 50,
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Update form field state on every keystroke
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit the form to create a new event via the API
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSubmitting(true);

    try {
      await axios.post(
        `${API}/events`,
        {
          title: formData.title,
          category: formData.category,
          date: new Date(formData.date).toISOString(),
          venue: formData.venue,
          ticketsAvailable: Number(formData.ticketsAvailable),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMsg(`Event "${formData.title}" created successfully! Attendees can now book tickets.`);
      // Reset form fields after successful creation
      setFormData({
        title: '',
        category: 'Technology',
        date: '',
        venue: '',
        ticketsAvailable: 50,
      });
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create event.');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Organizer Panel (Lazy Loaded)</h2>
          <p className="page-subtitle">
            Welcome, <strong>{user?.name}</strong>. Create and publish new events for attendees.
          </p>
        </div>
      </div>

      {/* Success / Error banners */}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && (
        <div className="alert" style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>
          {errorMsg}
        </div>
      )}

      <div className="organizer-form-card">
        <h3>Create New Event</h3>
        <form onSubmit={handleCreateEvent} className="organizer-form">
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. AI & Robotics Symposium"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Technology">Technology</option>
                <option value="Music">Music</option>
                <option value="Workshop">Workshop</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ticketsAvailable">Available Tickets</label>
              <input
                id="ticketsAvailable"
                type="number"
                name="ticketsAvailable"
                min="1"
                value={formData.ticketsAvailable}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date & Time</label>
              <input
                id="date"
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="venue">Venue</label>
              <input
                id="venue"
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                placeholder="e.g. Audi 2, CSPIT"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrganizerPanel;

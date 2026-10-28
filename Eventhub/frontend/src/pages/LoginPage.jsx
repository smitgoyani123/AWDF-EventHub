// pages/LoginPage.jsx
// ─── Login Page ───
// Accepts email and password, calls the real POST /api/v1/auth/login endpoint
// through the AuthContext login() function.
// Also provides quick-login buttons for the 3 demo accounts.

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // After login, redirect to the page the user originally wanted (or /events)
  const from = location.state?.from?.pathname || '/events';

  const [formData, setFormData] = useState({
    email: 'rahul@example.com',
    password: 'attendee123',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Update form field state on every keystroke
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit the login form – calls AuthContext.login() which hits the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      // Show the error message from the API response (e.g. "Invalid email or password.")
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick-login: pre-fills credentials and submits
  const handleQuickLogin = async (email, password) => {
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome to EventHub</h2>
        <p className="login-subtitle">Sign in to browse and book event tickets</p>

        {/* Error alert – only shown when login fails */}
        {error && (
          <div className="alert" style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="attendee@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick-login buttons for the 3 seeded demo accounts */}
        <div className="quick-login-section">
          <p>Quick Demo Sign-in:</p>
          <div className="quick-buttons">
            <button
              type="button"
              className="btn-quick"
              disabled={loading}
              onClick={() => handleQuickLogin('rahul@example.com', 'attendee123')}
            >
              Attendee
            </button>
            <button
              type="button"
              className="btn-quick"
              disabled={loading}
              onClick={() => handleQuickLogin('priya@organizer.com', 'organizer123')}
            >
              Organizer
            </button>
            <button
              type="button"
              className="btn-quick"
              disabled={loading}
              onClick={() => handleQuickLogin('admin@eventhub.com', 'admin123')}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

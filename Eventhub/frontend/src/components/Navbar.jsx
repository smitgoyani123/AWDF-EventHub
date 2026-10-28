// components/Navbar.jsx
// ─── Navigation Bar ───
// Uses react-router <Link> components (no full-page reload).
// Shows different links based on auth state and user role.

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Clear auth state and redirect to login page
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Logo links to /events (main page for logged-in users) */}
        <Link to="/events" className="nav-logo">
          🎟️ <span>EventHub</span>
        </Link>

        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/events" className="nav-link">Events</Link>
              <Link to="/my-tickets" className="nav-link">My Tickets</Link>

              {/* Only show Organizer Panel link for organizer/admin roles */}
              {(user?.role === 'organizer' || user?.role === 'admin') && (
                <Link to="/organizer" className="nav-link">Organizer Panel</Link>
              )}

              <div className="user-profile">
                <span className="user-name">{user?.name}</span>
                <span className={`badge-role badge-${user?.role?.toLowerCase()}`}>
                  {user?.role}
                </span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/" className="btn-login-nav">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

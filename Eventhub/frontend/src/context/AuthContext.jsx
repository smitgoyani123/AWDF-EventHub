// context/AuthContext.jsx
// ─── Global Authentication Context ───
// Holds { attendee, token, role } state and provides login() / logout() helpers.
// The JWT token is persisted in localStorage so the user stays logged in
// across page refreshes.

import { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Create the context with a null default (the Provider supplies the real value)
const AuthContext = createContext(null);

// ─── API base URL ───
// Uses a relative path so that:
//   • In Docker: nginx proxies /api/ to the backend container
//   • In local dev: Vite's proxy config forwards /api → http://localhost:5000
const API = '/api/v1';

export const AuthProvider = ({ children }) => {
  // ── Initialise state from localStorage (if a previous session exists) ──
  const [token, setToken] = useState(() => localStorage.getItem('eventhub_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('eventhub_user');
    return saved ? JSON.parse(saved) : null;
  });

  // ── login(email, password) ──
  // Calls POST /api/v1/auth/login, stores the JWT + user object.
  const login = async (email, password) => {
    // Send credentials to the backend login endpoint
    const res = await axios.post(`${API}/auth/login`, { email, password });
    const { token: jwt, attendee } = res.data;

    // Persist in localStorage so the session survives page reloads
    localStorage.setItem('eventhub_token', jwt);
    localStorage.setItem('eventhub_user', JSON.stringify(attendee));

    // Update React state (triggers re-render of consuming components)
    setToken(jwt);
    setUser(attendee);
    return attendee;
  };

  // ── logout() ──
  // Clears all auth state and localStorage entries.
  const logout = () => {
    localStorage.removeItem('eventhub_token');
    localStorage.removeItem('eventhub_user');
    setToken(null);
    setUser(null);
  };

  // Expose token, user, convenience booleans, and actions
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,   // true if a JWT is stored
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ── Custom Hook ──
// Makes it easy to consume auth state: const { user, token, login, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

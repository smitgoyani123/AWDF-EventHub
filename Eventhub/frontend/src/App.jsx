// App.jsx
// ─── Root Application Component ───
// Sets up BrowserRouter, AuthProvider, and all route definitions.
// OrganizerPanel is lazy-loaded with React.lazy + Suspense (code-splitting).

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import EventsPage from './pages/EventsPage';
import MyTicketsPage from './pages/MyTicketsPage';

// React.lazy dynamically imports OrganizerPanel only when the route is visited.
// This reduces the initial bundle size (code-splitting).
const OrganizerPanel = lazy(() => import('./pages/OrganizerPanel'));

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Route: Login page at "/" */}
              <Route path="/" element={<LoginPage />} />

              {/* Protected Route: Events listing */}
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <EventsPage />
                  </ProtectedRoute>
                }
              />

              {/* Protected Route: User's booked tickets */}
              <Route
                path="/my-tickets"
                element={
                  <ProtectedRoute>
                    <MyTicketsPage />
                  </ProtectedRoute>
                }
              />

              {/* Lazy-loaded + Role-restricted Route: Organizer Panel */}
              {/* allowedRoles uses lowercase to match backend role values */}
              <Route
                path="/organizer"
                element={
                  <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                    <Suspense
                      fallback={
                        <div className="loading-state">
                          <div className="spinner"></div>
                          <p>Loading Organizer Panel (React.lazy)...</p>
                        </div>
                      }
                    >
                      <OrganizerPanel />
                    </Suspense>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all: redirect unknown paths to /events */}
              <Route path="*" element={<Navigate to="/events" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

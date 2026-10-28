// components/ProtectedRoute.jsx
// ─── Protected Route Component ───
// Wraps pages that require authentication (and optionally a specific role).
// Redirect logic:
//   • No token → Navigate to "/" (login page)
//   • Token present but wrong role → Navigate to "/events"
// The two redirect targets DIFFER deliberately (per requirement) and
// neither performs a logout.

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to the login page ("/")
  // preserving the intended destination in location state
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If specific roles are required (e.g. ['organizer','admin'] for OrganizerPanel)
  // and the current user's role is NOT in that list, redirect to /events
  // (a DIFFERENT target from above; the user stays logged in).
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/events" replace />;
  }

  // Authorised — render the child page
  return children;
};

export default ProtectedRoute;

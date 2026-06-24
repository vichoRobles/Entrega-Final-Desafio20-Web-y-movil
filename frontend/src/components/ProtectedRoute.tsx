import { Navigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../utils/AuthContext';
import type { ReactNode } from 'react';

const ProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: UserRole[];
}) => {
  const { isAuthenticated, role } = useAuth();

  // If not logged in, boot them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  // If they are logged in, render the protected component
  return children;
};

export default ProtectedRoute;
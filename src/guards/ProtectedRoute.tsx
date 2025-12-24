import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { type ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('customer' | 'agent' | 'admin')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { state } = useAuth();
  const { user, token } = state;

  // אם אין טוקן - הפנה ל-login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // אם יש רשימת תפקידים מותרים - בדוק אם המשתמש מורשה
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const accessToken = useAppSelector((state) => state.auth.accessToken); // ✅ FIXED: Use accessToken instead of token
  
  // Check if user has valid session
  const hasValidSession = isAuthenticated && accessToken;

  useEffect(() => {
    // Save current location to return after login
    if (!hasValidSession) {
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [hasValidSession, location.pathname]);

  if (!hasValidSession) {
    // Redirect to login but save where they were trying to go
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
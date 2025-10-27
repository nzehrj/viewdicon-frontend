import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AuthRoutes from './routes/AuthRoutes';
import DashboardRoutes from './routes/DashboardRoutes';
import { useAppSelector } from './store/hooks';

const AppRoutes: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const location = useLocation();

  // ✅ FIXED: Allow authenticated users to access these onboarding routes
  const onboardingRoutes = [
    '/auth/afro-id-welcome',
    '/auth/circle_resolve',
    // Add any other post-authentication onboarding routes here
  ];

  // Check if current route is an onboarding route
  const isOnboardingRoute = onboardingRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth/*" element={
        // ✅ Allow access if: not authenticated OR is an onboarding route
        (isAuthenticated && !isOnboardingRoute) 
          ? <Navigate to="/dashboard" replace /> 
          : <AuthRoutes />
      } />

      {/* Dashboard Routes (Protected) */}
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <DashboardRoutes />
        </ProtectedRoute>
      } />

      {/* Root redirect */}
      <Route path="/" element={
        <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />
      } />

      {/* Catch all */}
      <Route path="*" element={
        <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />
      } />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
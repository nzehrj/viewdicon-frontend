import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AuthRoutes from './routes/AuthRoutes';
import DashboardRoutes from './routes/DashboardRoutes';
import { useAppSelector } from './store/hooks';

const AppRoutes: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth/*" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthRoutes />
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
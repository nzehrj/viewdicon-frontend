import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { store } from './store/store';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AuthRoutes from './routes/AuthRoutes';
import DashboardRoutes from './routes/DashboardRoutes';
import { useAppSelector } from './store/hooks';

// ✅ PHASE 9: Offline Sync Integration
import { OfflineSync } from '@components/sync/OfflineSync';
import { useOfflineQueue } from '@hooks/useOfflineQueue';

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

// ✅ NEW: Global Offline Sync Manager
const GlobalOfflineSync: React.FC = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  const {
    syncQueue,
    showSyncModal,
    setShowSyncModal,
    handleRetry,
    handleDelete,
    handleRetryAll,
    handlePause,
    handleResume,
  } = useOfflineQueue();

  // Only show for authenticated users
  if (!isAuthenticated) return null;

  const queueLength = syncQueue.length;
  const hasPendingOrFailed = syncQueue.some(
    a => a.status === 'pending' || a.status === 'failed'
  );

  return (
    <>
      {/* Floating Sync Button - Shows when queue has items */}
      <AnimatePresence>
        {queueLength > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSyncModal(true)}
            className={`fixed bottom-24 right-6 z-[60] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${
              hasPendingOrFailed
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
            title="View Sync Queue"
          >
            <RefreshCw 
              className={`w-6 h-6 text-white ${
                syncQueue.some(a => a.status === 'syncing') ? 'animate-spin' : ''
              }`} 
            />
            
            {/* Badge showing queue count */}
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
              {queueLength}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Offline Sync Modal */}
      <OfflineSync
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        queuedActions={syncQueue}
        onRetry={handleRetry}
        onDelete={handleDelete}
        onRetryAll={handleRetryAll}
        onPauseSync={handlePause}
        onResumeSync={handleResume}
      />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <AppRoutes />
          
          {/* ✅ Global Offline Sync Manager */}
          <GlobalOfflineSync />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
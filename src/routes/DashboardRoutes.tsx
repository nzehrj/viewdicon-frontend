import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardHome from '../components/dashboard/DashboardHome';

const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Dashboard - No Layout/Sidebar */}
      <Route index element={<DashboardHome />} />
      
      {/* Catch all - redirect to dashboard home */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default DashboardRoutes;
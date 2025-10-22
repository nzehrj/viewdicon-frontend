import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardHome from '../components/dashboard/DashboardHome';
import VillagePage from '../components/dashboard/VillagePage';

const DashboardRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Dashboard with Layout */}
      <Route element={<DashboardLayout />}>
        {/* Dashboard Home */}
        <Route index element={<DashboardHome />} />
        
        {/* Village Pages */}
        <Route path="village/:villageId" element={<VillagePage />} />
        
        {/* Catch all - redirect to dashboard home */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default DashboardRoutes;
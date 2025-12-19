import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNavigation, NavigationTab } from '@components/common/BottomNavigation';
import { useAppSelector } from '@store/hooks';

interface GlobalLayoutProps {
  children?: React.ReactNode;
}

/**
 * GLOBAL LAYOUT WRAPPER
 * 
 * Main layout component that wraps all authenticated screens.
 * 
 * Features:
 * - Bottom navigation (5 tabs)
 * - Jollof TV floating bubble
 * - Padding for bottom nav
 * - Theme support
 * 
 * Location: src/layouts/GlobalLayout.tsx
 */
export const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  // Active navigation tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  
  
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Main Content Area */}
      <main className="pb-20">
        {children || <Outlet />}
      </main>
      
      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
    </div>
  );
};

export default GlobalLayout;
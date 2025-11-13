import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNavigation, NavigationTab } from '@components/common/BottomNavigation';
import { JollofTVBubble } from '@components/common/JollofTVBubble';
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
  
  // Jollof TV state
  const [isJollofTVVisible, setIsJollofTVVisible] = useState(true);
  const isJollofTVLive = true; // Set to true for demo
  
  // Active navigation tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  
  const handleJollofTVClose = () => {
    setIsJollofTVVisible(false);
  };
  
  const handleJollofTVMaximize = () => {
    // TODO: Navigate to full-screen Jollof TV page
    console.log('Maximize Jollof TV');
  };
  
  const handleSprayCowrie = () => {
    // TODO: Open Cowrie spray modal
    console.log('Spray Cowrie');
  };
  
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
      
      {/* Jollof TV Floating Bubble */}
      {isJollofTVVisible && (
        <JollofTVBubble
          isLive={isJollofTVLive}
          streamTitle="National Town Hall"
          streamerName="Governor's Address"
          viewerCount={1247}
          onClose={handleJollofTVClose}
          onMaximize={handleJollofTVMaximize}
          onSprayCowrie={handleSprayCowrie}
        />
      )}
    </div>
  );
};

export default GlobalLayout;
import React from 'react';
import { Home, Users, Search, ShoppingBag, UserCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';

export type NavigationTab = 'home' | 'circle' | 'discover' | 'market' | 'me';

interface BottomNavigationProps {
  activeTab?: NavigationTab;
  onTabChange?: (tab: NavigationTab) => void;
}

/**
 * BOTTOM NAVIGATION COMPONENT
 * 
 * The 5 main tabs that define the entire platform:
 * 1. HOME - Dashboard (work tools, status tiles, action stack)
 * 2. CIRCLE - Social layer (Village Square, Rooms, My Circle, Council)
 * 3. DISCOVER - Marketplace (cross-village search, find professionals)
 * 4. MARKET - Transactions (escrow, orders, dispatch, payouts)
 * 5. ME - Identity (Afro-ID, devices, shield, crest, appeals)
 * 
 * Always visible at bottom of screen (except in immersive modes)
 */
export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab: propActiveTab,
  onTabChange,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab from route if not provided as prop
  const getActiveTabFromRoute = (): NavigationTab => {
    const path = location.pathname;
    if (path.includes('/circle')) return 'circle';
    if (path.includes('/discover')) return 'discover';
    if (path.includes('/market')) return 'market';
    if (path.includes('/me') || path.includes('/profile')) return 'me';
    return 'home';
  };
  
  const activeTab = propActiveTab || getActiveTabFromRoute();
  
  const tabs: Array<{
    id: NavigationTab;
    label: string;
    icon: React.ElementType;
    route: string;
    color: string;
  }> = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      route: '/dashboard',
      color: '#10b981', // Green
    },
    {
      id: 'circle',
      label: 'Circle',
      icon: Users,
      route: '/circle',
      color: '#8b5cf6', // Purple
    },
    {
      id: 'discover',
      label: 'Discover',
      icon: Search,
      route: '/discover',
      color: '#f59e0b', // Amber
    },
    {
      id: 'market',
      label: 'Market',
      icon: ShoppingBag,
      route: '/market',
      color: '#3b82f6', // Blue
    },
    {
      id: 'me',
      label: 'Me',
      icon: UserCircle,
      route: '/me',
      color: '#ef4444', // Red
    },
  ];
  
  const handleTabClick = (tab: typeof tabs[0]) => {
    if (onTabChange) {
      onTabChange(tab.id);
    } else {
      // Default behavior: navigate to route
      navigate(tab.route);
    }
  };
  
  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-50 ${
      theme === 'dark' 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-200'
    } border-t`}>
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-around px-2 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive ? 'scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {/* Icon with background */}
                <div 
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? 'scale-110' : ''
                  }`}
                  style={{
                    backgroundColor: isActive ? `${tab.color}20` : theme === 'dark' ? '#374151' : '#f3f4f6',
                    color: isActive ? tab.color : theme === 'dark' ? '#9ca3af' : '#6b7280',
                  }}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                
                {/* Label */}
                <span 
                  className={`text-xs font-medium transition-colors ${
                    isActive 
                      ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                      : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}
                  style={isActive ? { color: tab.color } : {}}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
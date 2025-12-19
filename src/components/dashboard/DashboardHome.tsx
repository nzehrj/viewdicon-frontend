import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home as HomeIcon,
  Bell,
  Search,
  User,
  X,
  Grid,
  Share2,
  Building2,
  Bot,
  MessageSquare,
  Heart,
  Users,
  MessageCircle,
} from 'lucide-react';

// ✅ PHASE 9: Onboarding Tour
import { OnboardingTour } from '@components/onboarding/OnboardingTour';

// ✅ SOCIAL VIEW COMPONENT
import { SocialView } from '@components/feeds/SocialView';

import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { logout as authLogout } from '@store/slices/authSlice';
import { clearUser } from '@store/slices/userSlice';

// Village Configurations
import agricultureConfig from '../../config/villages/agriculture.json';
import businessConfig from '../../config/villages/business.json';
import constructionConfig from '../../config/villages/construction.json';
import craftsConfig from '../../config/villages/crafts.json';
import creativeConfig from '../../config/villages/creative.json';
import educationConfig from '../../config/villages/education.json';
import financeConfig from '../../config/villages/finance.json';
import governanceConfig from '../../config/villages/governance.json';
import governmentConfig from '../../config/villages/government.json';
import healthcareConfig from '../../config/villages/healthcare.json';
import gettingStartedConfig from '../../config/villages/getting_started.json';
import hospitalityConfig from '../../config/villages/hospitality.json';
import mediaConfig from '../../config/villages/media.json';
import securityConfig from '../../config/villages/security.json';
import spiritualConfig from '../../config/villages/spiritual.json';
import technologyConfig from '../../config/villages/technology.json';
import transportConfig from '../../config/villages/transport.json';

// ✅ PHASE 1-5: Core Components
import { SettingsPanel } from '@components/settings/SettingsPanel';
import NotificationCenter from '@components/notifications/NotificationCenter';
import { ProfileCard } from '@components/profile/ProfileCard';
import { ToolsView } from '@components/tools/ToolsView';
import { RequestsSection } from '@components/home/RequestsSection';
import { ConnectionsSection } from '@components/home/ConnectionsSection';
import { CommunitySection } from '@components/home/CommunitySection';
import { FamilyTreeSection } from '@components/home/FamilyTreeSection';
import { ContentPreferencesSection } from '@components/home/ContentPreferencesSection';
import { VillageSelector } from '@components/village/VillageSelector';
import { RoleChangeRequest } from '@components/village/RoleChangeRequest';

// ✅ CHAT Components - DEFAULT IMPORTS
import { MessagingView } from '@components/messaging/MessagingView';

// ✅ PHASE 7: LINK Tab (Networking) - NetworkView Component
import { NetworkView } from '@components/network/NetworkView';

// ✅ PHASE 8: GUARD Tab (Security) - SecurityView Component
import { SecurityView } from '@components/security/SecurityView';
import ProtectionModeScreen  from '@components/security/ProtectionModeScreen';

import type { ProtectionMode,} from '@/types/security.types';


const villageConfigs: Record<string, any> = {
  agriculture: agricultureConfig,
  business: businessConfig,
  construction: constructionConfig,
  crafts: craftsConfig,
  creative: creativeConfig,
  education: educationConfig,
  finance: financeConfig,
  governance: governanceConfig,
  government: governmentConfig,
  healthcare: healthcareConfig,
  getting_started: gettingStartedConfig,
  hospitality: hospitalityConfig,
  media: mediaConfig,
  security: securityConfig,
  spiritual: spiritualConfig,
  technology: technologyConfig,
  transport: transportConfig,
};


interface Tool {
  toolId: string;
  toolName: string;
  description: string;
  icon?: string;
  category?: string;
}

const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Navigation States
  const [activeView, setActiveView] = useState<'home' | 'profile' | 'tools' | 'business' | 'network' | 'security'>('home');
  const [activeBottomTab, setActiveBottomTab] = useState<'home' | 'social' | 'banking' | 'ai' | 'chat' | 'profile'>('home');
  const [activeHomeApp, setActiveHomeApp] = useState<string | null>(null);
  const [shouldOpenMenu, setShouldOpenMenu] = useState(false); // ✅ NEW: Track if menu should open

  // Onboarding Tour State
  const [showOnboarding, setShowOnboarding] = useState(false);
    
  // Modal States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isVillageSelectorOpen, setIsVillageSelectorOpen] = useState(false);
  const [isRoleChangeRequestOpen, setIsRoleChangeRequestOpen] = useState(false);
  const [selectedVillageForChange, setSelectedVillageForChange] = useState<{
    villageId: string;
    villageName: string;
    villageColor: string;
    roleId: string;
    roleName: string;
    roleIcon: string;
  } | null>(null);

  // User States
  const [protectionMode] = useState<ProtectionMode | null>(null);

  
  // Redux State
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  const userVillage = useAppSelector((state) => state.user.village);
  const userRole = useAppSelector((state) => state.user.role);
  const phoneNumber = useAppSelector((state) => state.auth.phoneNumber);
  const messageRequests = useAppSelector((state) => state.user.messageRequests);

  // Scroll-based Navigation Visibility
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll-based Navigation
  useEffect(() => {
    const handleScroll = () => {
      // Get scroll position - works for both window and containers
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      
      // Hide when scrolling down (past 100px)
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      } 
      // Show when scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsNavVisible(true);
      }
      
      // Always show at very top
      if (currentScrollY < 50) {
        setIsNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };


    // Also listen to scroll on main container
    const handleContainerScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const currentScrollY = target.scrollTop;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsNavVisible(true);
      }
      
      if (currentScrollY < 50) {
        setIsNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Listen to window scroll
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Listen to scroll on all scrollable containers
    const scrollableContainers = document.querySelectorAll('[class*="overflow"]');
    scrollableContainers.forEach((container) => {
      container.addEventListener('scroll', handleContainerScroll, { passive: true });
    });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      scrollableContainers.forEach((container) => {
        container.removeEventListener('scroll', handleContainerScroll);
      });
    };
  }, [lastScrollY]);

  // Check onboarding status on mount
  useEffect(() => {
    if (user) {
      const hasCompletedTour = localStorage.getItem('onboardingCompleted');
      
      // Show tour for new users who haven't completed it
      if (!hasCompletedTour) {
        // Small delay for better UX (1 second)
        setTimeout(() => {
          setShowOnboarding(true);
        }, 1000);
      }
    }
  }, [user]);


  // Village Configuration
  const villageConfig = userVillage?.villageId ? villageConfigs[userVillage.villageId] : null;
  const rolesOrGuilds = villageConfig?.roles || villageConfig?.guilds || [];
  const roleConfig = rolesOrGuilds.find((r: any) => 
    r.roleId === userRole?.roleId || r.guildId === userRole?.roleId
  );
  const tools: Tool[] = roleConfig?.tools || roleConfig?.extraTools || [];
  const villageColor = villageConfig?.color || villageConfig?.visual?.colorPrimary || '#10b981';
  const pendingRequestsCount = messageRequests.filter(r => r.status === 'pending').length;

  // Helper Functions
  const resolveIcon = (iconName?: string) => {
    if (!iconName) return Grid;
    const IconComp = (Icons as any)[iconName];
    return IconComp || Grid;
  };

  const RoleIcon = resolveIcon(roleConfig?.icon);
  const displayName = user?.full_name || user?.name || phoneNumber || 'User';
  const villageName = villageConfig?.villageName || villageConfig?.displayName || 'Dashboard';
  const roleName = roleConfig?.roleName || roleConfig?.guildName || 'User';

  // ====== ONBOARDING HANDLERS ======
  const handleOnboardingComplete = async () => {
    // Save to localStorage immediately
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Optional: Save to backend asynchronously
    try {
      // await api.post('/api/user/complete-onboarding');
      console.log('Onboarding completed!');
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
    }
    
    // Close tour
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('onboardingSkipped', 'true');
    setShowOnboarding(false);
  };

  // Event Handlers

  const handleContactSupport = () => {
    console.log('Contacting support...');
  };

  const handleOpenVillageSelector = () => {
    setIsVillageSelectorOpen(true);
  };

  const handleSelectVillage = (villageId: string, roleId: string) => {
    const selectedVillage = villageConfigs[villageId];
    const selectedRole = selectedVillage?.roles?.find((r: any) => r.roleId === roleId);
    
    if (selectedVillage && selectedRole) {
      setSelectedVillageForChange({
        villageId,
        villageName: selectedVillage.villageName,
        villageColor: selectedVillage.color,
        roleId,
        roleName: selectedRole.roleName,
        roleIcon: selectedRole.icon,
      });
      setIsVillageSelectorOpen(false);
      setIsRoleChangeRequestOpen(true);
    }
  };

  const handleSubmitRoleChange = (data: any) => {
    console.log('Submitting role change:', data);
  };

  const handleLogout = () => {
    dispatch(authLogout());
    dispatch(clearUser());
    navigate('/auth/login', { replace: true });
  };


  // Helper to check if view should be full-screen
  const isFullScreenView = activeView !== 'home';


   // Helper function to determine which bottom tab should appear active
  const getActiveBottomTab = () => {
    // If we're in these views, they came from Profile menu, so keep Profile active
    if (['business', 'network', 'security', 'tools'].includes(activeView)) {
      return 'profile';
    }
    return activeBottomTab;
  };

  // Bottom Navigation Items
 const bottomNavItems = [
    { id: 'home', icon: HomeIcon, label: 'Home', color: '#10b981' },
    { id: 'social', icon: Share2, label: 'Social', color: '#3b82f6' },
    { id: 'ai', icon: Bot, label: 'AI Agent', color: '#8b5cf6' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', color: '#ec4899' },
    { id: 'profile', icon: User, label: 'Profile', color: '#6b7280' },
  ];


  return (
    <div className={`min-h-screen pb-20 mb-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Header */}
      <AnimatePresence>
        {isNavVisible && activeBottomTab !== 'profile' && (activeView === 'home' || !isFullScreenView) && (
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30 
            }}
            className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-none`}
          >
            {/* Main Header Content */}
            <div className="flex items-center justify-between px-1 py-4 max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
                >
                  <RoleIcon className="w-6 h-6" />
                </div>
                <div className="hidden sm:block">
                  <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {roleName}
                  </h1>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {villageName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
                <button 
                  className={`p-2 rounded-lg relative ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  onClick={() => setIsNotificationOpen(true)}
                >
                  <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  {pendingRequestsCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto max-w-4xl mx-auto mt-4" style={{ height: 'calc(100vh - 88px)' }}>
          <div className={isFullScreenView ? 'h-screen' : ''}>
            <AnimatePresence mode="wait">
              {/* HOME VIEW */}
              {activeView === 'home' && activeBottomTab === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8 p-2 max-w-6xl mx-auto"
                >
                  <div 
                    className=" p-4 sm:p-6 rounded-2xl text-white relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${villageColor} 0%, ${villageColor}dd 100%)` }}
                  >
                    <div className="relative z-10">
                      <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                        Welcome Home, {displayName}!
                      </h2>
                      <p className="text-white/90 text-sm sm:text-base mb-1">
                        You are now part of the digital Motherland
                      </p>
                      {user?.tribe && (
                        <p className="text-white font-semibold text-base sm:text-lg">
                          {user.tribe}
                        </p>
                      )}
                    </div>
                    <div className="absolute right-0 top-0 w-32 h-32 sm:w-48 sm:h-48 opacity-10">
                      <RoleIcon className="w-full h-full" />
                    </div>
                  </div>

                  {/* 6 App Icons */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-4">
                    <motion.button
                      onClick={() => setActiveHomeApp('requests')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 outline-none"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow relative">
                        <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        {pendingRequestsCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {pendingRequestsCount}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs sm:text-sm font-medium text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Requests
                      </span>
                    </motion.button>

                    <motion.button
                      onClick={() => setActiveHomeApp('connections')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 outline-none"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                        <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <span className={`text-xs sm:text-sm font-medium text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Connections
                      </span>
                    </motion.button>

                    <motion.button
                      onClick={() => setActiveHomeApp('community')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                        <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <span className={`text-xs sm:text-sm font-medium text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Community
                      </span>
                    </motion.button>

                    <motion.button
                      onClick={() => setActiveHomeApp('familytree')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 outline-none"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                        <span className="text-3xl sm:text-4xl">🌳</span>
                      </div>
                      <span className={`text-xs sm:text-sm font-medium text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Family Tree
                      </span>
                    </motion.button>

                    <motion.button
                      onClick={() => setActiveHomeApp('preferences')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 outline-none"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                        <span className="text-3xl sm:text-4xl">🎨</span>
                      </div>
                      <span className={`text-xs sm:text-sm font-medium text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Preferences
                      </span>
                    </motion.button>

                    {/* Cowrie Banking */}
                    <motion.button
                      onClick={() => setActiveHomeApp('banking')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 outline-none"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                        <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <span className={`text-xs sm:text-sm font-medium text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Banking
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* SOCIAL VIEW */}
              {activeView === 'home' && activeBottomTab === 'social' && (
                <motion.div 
                  key="social" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }}
                >
                  <SocialView isNavVisible={isNavVisible} />
                </motion.div>
              )}


              {/* AI AGENT VIEW */}
              {activeView === 'home' && activeBottomTab === 'ai' && (
                <motion.div key="ai" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`p-12 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <Bot className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>AI Agent</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Your intelligent assistant for professional guidance</p>
                </motion.div>
              )}

             {/* CHAT VIEW - Using MessagingView Component */}
              {activeView === 'home' && activeBottomTab === 'chat' && (
                <motion.div 
                  key="chat" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }}
                >
                  <MessagingView />
                </motion.div>
              )}

              {/* ✅ PROFILE BOTTOM TAB VIEW - NEW! */}
              {activeBottomTab === 'profile' && activeView === 'home' && (
                <ProfileCard
                  viewType="self"
                  isVisible={true}
                  onEditProfile={() => console.log('Edit profile')}
                  onNavigate={(view) => {
                    setShouldOpenMenu(false); // ✅ Reset flag when navigating away
                    setActiveView(view);
                  }}
                  onLogout={handleLogout}
                  onOpenSettings={() => setIsSettingsOpen(true)}
                  currentView={activeView}
                  activeBottomTab={activeBottomTab}
                  onBottomNavClick={(tab) => {
                    setShouldOpenMenu(false); // ✅ Reset flag when changing tabs
                    setActiveBottomTab(tab);
                    setActiveView('home');
                  }}
                  openMenuOnLoad={shouldOpenMenu} // ✅ Open menu only when flag is true
                  onMenuOpened={() => setShouldOpenMenu(false)} // ✅ Reset flag after opening
                />
              )}
              
              {/* ✅ PHASE 7: NETWORK VIEW - Uses NetworkView Component */}
              {activeView === 'network' && activeBottomTab === 'profile' && (
                <NetworkView 
                  villageName={villageName}
                  userId={user?.id}
                  onBack={() => {
                    console.log('🔙 Going back to open menu from Network');
                    setShouldOpenMenu(true); // ✅ Set flag to open menu
                    setActiveView('home');
                  }}
                />
              )}

              {/* ✅ PHASE 8: SECURITY VIEW - Uses SecurityView Component */}
              {activeView === 'security' && activeBottomTab === 'profile' && (
                <SecurityView 
                  villageName={villageName}
                  userId={user?.id}
                  protectionMode={protectionMode}
                  onRequestCircle={() => console.log('Request circle from security view')}
                  onBack={() => {
                    console.log('🔙 Going back to ProfileCard from Security');
                    setActiveView('home');
                  }}
                />
              )}


              {/* TOOLS VIEW */}
              {activeView === 'tools' && activeBottomTab === 'profile' && (
                <ToolsView
                  tools={tools}
                  roleName={roleName}
                  villageColor={villageColor}
                  onBack={() => {
                    console.log('🔙 Going back to open menu from Tools');
                    setShouldOpenMenu(true); // ✅ Set flag to open menu
                    setActiveView('home');
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Bottom Navigation Bar */}
        <AnimatePresence>
          {isNavVisible && activeBottomTab !== 'profile' && (activeView === 'home' || !isFullScreenView) && (
            <motion.nav
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 30 
              }}
              className={`fixed bottom-0 left-0 right-0 z-50 h-22 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border-t`}
            >
              <div className="flex items-center justify-between px-2 py-2 max-w-4xl mx-auto">
                {bottomNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = getActiveBottomTab() === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveBottomTab(item.id as any);
                        setActiveView('home');  
                      }}
                      className={`flex flex-col outline-none items-center gap-1 px-2 py-2 rounded-xl transition-all ${
                        isActive ? 'scale-105' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div 
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all ${
                          isActive ? 'scale-110' : ''
                        }`} 
                        style={{ 
                          backgroundColor: isActive ? `${item.color}20` : theme === 'dark' ? '#374151' : '#f3f4f6', 
                          color: isActive ? item.color : theme === 'dark' ? '#9ca3af' : '#6b7280' 
                        }}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <span 
                        className={`text-xs font-medium transition-colors ${
                          isActive 
                            ? theme === 'dark' ? 'text-white' : 'text-gray-900' 
                            : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`} 
                        style={{ color: isActive ? item.color : undefined }}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      

        {/* App Modals */}
        <AnimatePresence>
          {activeHomeApp && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setActiveHomeApp(null)} 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.9, y: 20 }} 
                  className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                  } rounded-2xl shadow-2xl`}
                >
                  <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
                    theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                  }`}>
                    <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {activeHomeApp === 'requests' && 'Message Requests'}
                      {activeHomeApp === 'connections' && 'My Connections'}
                      {activeHomeApp === 'community' && 'Community'}
                      {activeHomeApp === 'familytree' && 'Family Tree'}
                      {activeHomeApp === 'preferences' && 'Content Preferences'}
                      {activeHomeApp === 'banking' && 'Cowrie Banking'}
                    </h2>
                    <button 
                      onClick={() => setActiveHomeApp(null)} 
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6">
                    {activeHomeApp === 'requests' && <RequestsSection />}
                    {activeHomeApp === 'connections' && <ConnectionsSection />}
                    {activeHomeApp === 'community' && <CommunitySection />}
                    {activeHomeApp === 'familytree' && <FamilyTreeSection />}
                    {activeHomeApp === 'preferences' && <ContentPreferencesSection />}
                    {activeHomeApp === 'banking' && (
                      // ⚠️ TEMPORARY PLACEHOLDER - Will be replaced with actual Banking component
                      <div className={`space-y-4 sm:space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {/* Banking Header */}
                        <div className="text-center">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                            <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                          </div>
                          <h3 className={`text-xl sm:text-2xl font-bold mb-1 sm:mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Cowrie Banking
                          </h3>
                          <p className={`text-xs sm:text-sm px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Send, receive, and manage your Cowries
                          </p>
                        </div>

                        {/* Balance Card */}
                        <div className={`p-4 sm:p-6 rounded-xl ${
                          theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 to-white'
                        } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                          <p className={`text-xs sm:text-sm mb-1 sm:mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Available Balance
                          </p>
                          <p className={`text-3xl sm:text-4xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            ₵ 12,450.00
                          </p>
                          <p className="text-xs sm:text-sm text-green-500">+2.5% this week</p>
                        </div>

                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                          <button className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-lg active:scale-95 transition-all text-left">
                            <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">💰</div>
                            <p className="font-bold text-sm sm:text-lg mb-0.5 sm:mb-1">Send</p>
                            <p className="text-xs sm:text-sm opacity-90 hidden sm:block">Transfer Cowries</p>
                          </button>
                          
                          <button className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-lg active:scale-95 transition-all text-left">
                            <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">📥</div>
                            <p className="font-bold text-sm sm:text-lg mb-0.5 sm:mb-1">Receive</p>
                            <p className="text-xs sm:text-sm opacity-90 hidden sm:block">Get paid</p>
                          </button>
                          
                          <button className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white hover:shadow-lg active:scale-95 transition-all text-left">
                            <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">💳</div>
                            <p className="font-bold text-sm sm:text-lg mb-0.5 sm:mb-1">Top Up</p>
                            <p className="text-xs sm:text-sm opacity-90 hidden sm:block">Add funds</p>
                          </button>
                          
                          <button className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:shadow-lg active:scale-95 transition-all text-left">
                            <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">📊</div>
                            <p className="font-bold text-sm sm:text-lg mb-0.5 sm:mb-1">History</p>
                            <p className="text-xs sm:text-sm opacity-90 hidden sm:block">View transactions</p>
                          </button>
                        </div>

                        {/* Recent Transactions */}
                        <div>
                          <h4 className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 px-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Recent Transactions
                          </h4>
                          <div className="space-y-2 sm:space-y-3">
                            {[
                              { type: 'sent', name: 'John Doe', amount: -500, time: '2h ago' },
                              { type: 'received', name: 'Sarah Smith', amount: 1200, time: '5h ago' },
                              { type: 'sent', name: 'Michael Chen', amount: -350, time: '1d ago' },
                            ].map((transaction, idx) => (
                              <div
                                key={idx}
                                className={`p-3 sm:p-4 rounded-lg flex items-center justify-between ${
                                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    transaction.type === 'sent' ? 'bg-red-100' : 'bg-green-100'
                                  }`}>
                                    <span className="text-base sm:text-xl">
                                      {transaction.type === 'sent' ? '📤' : '📥'}
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className={`font-semibold text-sm sm:text-base truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                      {transaction.name}
                                    </p>
                                    <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {transaction.time}
                                    </p>
                                  </div>
                                </div>
                                <p className={`font-bold text-sm sm:text-base flex-shrink-0 ml-2 ${
                                  transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                                }`}>
                                  {transaction.amount > 0 ? '+' : ''}₵{Math.abs(transaction.amount)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Coming Soon Notice */}
                        <div className={`p-4 sm:p-6 rounded-xl border-2 border-dashed text-center ${
                          theme === 'dark' ? 'border-gray-700 bg-gray-800/30' : 'border-gray-300 bg-gray-50/50'
                        }`}>
                          <p className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            🚀 Full banking features coming soon
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Global Modals */}
        <SettingsPanel 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)}
          onOpenVillageSelector={handleOpenVillageSelector}
        />
        <NotificationCenter isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
        <VillageSelector 
          isOpen={isVillageSelectorOpen} 
          onClose={() => setIsVillageSelectorOpen(false)} 
          onSelectVillage={handleSelectVillage} 
        />
        
        {selectedVillageForChange && (
          <RoleChangeRequest
            isOpen={isRoleChangeRequestOpen}
            onClose={() => {
              setIsRoleChangeRequestOpen(false);
              setSelectedVillageForChange(null);
            }}
            villageId={selectedVillageForChange.villageId}
            villageName={selectedVillageForChange.villageName}
            villageColor={selectedVillageForChange.villageColor}
            roleId={selectedVillageForChange.roleId}
            roleName={selectedVillageForChange.roleName}
            roleIcon={selectedVillageForChange.roleIcon}
            onSubmit={handleSubmitRoleChange}
          />
        )}
        
        {protectionMode && (
         <ProtectionModeScreen 
            protectionMode={protectionMode} 
            onRequestCircle={() => {
              console.log('Requesting circle verification from protection mode');
              // TODO: Implement circle alert
            }}
            onContactSupport={handleContactSupport} 
          />
        )}

        {/* Onboarding Tour - Shows automatically on first login */}
        <OnboardingTour
          isOpen={showOnboarding}
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
          
    </div>
  );
};

export default DashboardHome;
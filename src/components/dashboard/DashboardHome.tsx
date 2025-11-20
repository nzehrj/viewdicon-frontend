import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home as HomeIcon,
  Bell,
  Search,
  User,
  Menu,
  Video,
  Plus,
  Mic,
  Sparkles,
  Image,
  X,
  LogOut,
  Grid,
  Shield,
  Settings,
  Share2,
  Building2,
  ChevronLeft,
  ChevronRight,
  Bot,
  MessageSquare,
  Heart,
  Users,
  RefreshCw,
  MessageCircle,
  Eye,
  CreditCard,
  Monitor,
  Activity,
  Link as LinkIcon,
  Briefcase,
} from 'lucide-react';

// ✅ FEED COMPONENTS
import { MotionFeed } from '@components/feeds/MotionFeed';
import { GalleryFeed } from '@components/feeds/GalleryFeed';
import { FamilyCircle } from '@components/feeds/FamilyCircle';
import { DiscoverySpotlight } from '@components/feeds/DiscoverySpotlight';
import { FeedComposer } from '@components/feeds/FeedComposer';
import { Discover } from '@components/discover/Discover';


import { useNavigate } from 'react-router-dom';
import { GuardianDashboard } from './GuardianDashboard';
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
import { FeedTimeline } from '@components/feed/FeedTimeline';
import { ProfileCard } from './ProfileCard';
import { AfroIDSection } from './AfroIDSection';
import { SettingsPanel } from '@components/settings/SettingsPanel';
import NotificationCenter from '@components/notifications/NotificationCenter';
import { TwinPresenceToggle } from '@components/dashboard/TwinPresenceToggle';
import { ProtectionModeScreen } from '@components/security/ProtectionModeScreen';
import { RequestsSection } from '@components/home/RequestsSection';
import { ConnectionsSection } from '@components/home/ConnectionsSection';
import { CommunitySection } from '@components/home/CommunitySection';
import { FamilyTreeSection } from '@components/home/FamilyTreeSection';
import { ContentPreferencesSection } from '@components/home/ContentPreferencesSection';
import { VillageChangeSection } from '@components/home/VillageChangeSection';
import { VillageSelector } from '@components/village/VillageSelector';
import { RoleChangeRequest } from '@components/village/RoleChangeRequest';

// ✅ PHASE 6: Business Session Components - DEFAULT IMPORTS
import BusinessSession from '@components/business/BusinessSession';
import EscrowManager from '@components/business/EscrowManager';
import DisputeResolution from '@components/business/DisputeResolution';
import SessionHistory from '@components/business/SessionHistory';

// ✅ PHASE 7: LINK Tab (Networking) Components - DEFAULT IMPORTS
import KinshipNetwork from '@components/market/KinshipNetwork';
import LinkRequest from '@components/market/LinkRequest';
import NetworkStats from '@components/market/NetworkStats';

// ✅ PHASE 8: GUARD Tab (Security) Components - DEFAULT IMPORTS
import SecurityDashboard from '@components/security/SecurityDashboard';
import WatchfulEye from '@components/security/WatchfulEye';
import VerificationTiers from '@components/security/VerificationTiers';
import DeviceManager from '@components/security/DeviceManager';
import SessionMonitor from '@components/security/SessionMonitor';

import type { ProtectionMode } from '@/types/security.types';

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
  const [showBusinessSession, setShowBusinessSession] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'profile' | 'tools' | 'business' | 'network' | 'security'>('home');
  const [activeBottomTab, setActiveBottomTab] = useState<'home' | 'social' | 'banking' | 'ai' | 'chat'>('home');
  const [activeHomeApp, setActiveHomeApp] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // For mobile

  const [activeFeedType, setActiveFeedType] = useState<'village' | 'discover' | 'motion' | 'gallery' | 'voice' | 'family' | 'spotlight'>('village');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  
  // ✅ Sub-tab states for Phase 6, 7, 8
  const [activeBusinessTab, setActiveBusinessTab] = useState<'sessions' | 'escrow' | 'history' | 'disputes'>('sessions');
  const [activeNetworkTab, setActiveNetworkTab] = useState<'kinship' | 'requests' | 'stats'>('kinship');
  const [activeSecurityTab, setActiveSecurityTab] = useState<'dashboard' | 'watchful-eye' | 'verification' | 'devices' | 'sessions'>('dashboard');
  
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
  const [presenceMode, setPresenceMode] = useState<'spirit' | 'flesh'>('spirit');
  const [protectionMode] = useState<ProtectionMode | null>(null);
  
  // Redux State
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  const userVillage = useAppSelector((state) => state.user.village);
  const userRole = useAppSelector((state) => state.user.role);
  const phoneNumber = useAppSelector((state) => state.auth.phoneNumber);
  const messageRequests = useAppSelector((state) => state.user.messageRequests);

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
  
  // Mock Data
  const spiritAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=spirit';
  const fleshPhoto = 'https://api.dicebear.com/7.x/avataaars/svg?seed=real';
  const photoStatus: 'verified_real' | 'flagged_filtered' | 'rejected_ai' | 'not_uploaded' = 'verified_real';

  // Event Handlers
  const handlePresenceToggle = (mode: 'spirit' | 'flesh') => {
    setPresenceMode(mode);
  };

  const handleRequestCircle = () => {
    console.log('Requesting circle verification...');
  };

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
  const isFullScreenView = () => {
    return (
      activeView === 'profile' ||
      activeView === 'business' ||
      activeView === 'network' ||
      activeView === 'security' ||
      activeView === 'tools' ||
      (activeView === 'home' && activeBottomTab === 'social')
    );
  };

  // Bottom Navigation Items
  const bottomNavItems = [
    { id: 'home', icon: HomeIcon, label: 'Home', color: '#10b981' },
    { id: 'social', icon: Share2, label: 'Social', color: '#3b82f6' },
    { id: 'banking', icon: Building2, label: 'Banking', color: '#f59e0b' },
    { id: 'ai', icon: Bot, label: 'AI Agent', color: '#8b5cf6' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', color: '#ec4899' },
  ];

  // ✅ Business Tab Configuration
  const businessTabs = [
    { id: 'sessions', label: 'Sessions', icon: Briefcase },
    { id: 'escrow', label: 'Escrow', icon: Shield },
    { id: 'history', label: 'History', icon: Activity },
    { id: 'disputes', label: 'Disputes', icon: MessageSquare },
  ];

  // ✅ Network Tab Configuration
  const networkTabs = [
    { id: 'kinship', label: 'Kinship', icon: Users },
    { id: 'requests', label: 'Requests', icon: Heart },
    { id: 'stats', label: 'Stats', icon: Activity },
  ];

  // ✅ Security Tab Configuration
  const securityTabs = [
    { id: 'dashboard', label: 'Overview', icon: Shield },
    { id: 'watchful-eye', label: 'Watchful Eye', icon: Eye },
    { id: 'verification', label: 'Verification', icon: CreditCard },
    { id: 'devices', label: 'Devices', icon: Monitor },
    { id: 'sessions', label: 'Sessions', icon: Activity },
  ];

  // ✅ Feed Tab Configuration
    const feedTabs = [
    { id: 'village', label: 'Village Square', icon: Users, color: '#10b981' },
    { id: 'discover', label: 'Discover', icon: Search, color: '#06b6d4' }, // ✅ ADD THIS
    { id: 'motion', label: 'Motion', icon: Video, color: '#f59e0b' },
    { id: 'gallery', label: 'Gallery', icon: Image, color: '#ec4899' },
    { id: 'voice', label: 'Voice', icon: Mic, color: '#8b5cf6' },
    { id: 'family', label: 'Family', icon: Heart, color: '#ef4444' },
    { id: 'spotlight', label: 'Spotlight', icon: Sparkles, color: '#fbbf24' },
  ];

  return (
    <div className={`min-h-screen pb-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Header */}
      {!isFullScreenView() && (
        <header className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => {
                if (isFullScreenView()) {
                  setIsSidebarVisible(!isSidebarVisible);
                } else {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                }
              }}
              className={`lg:hidden p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <Menu className="w-6 h-6" />
            </button>

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

          {/* Feed Type Tabs - Only show when in social view */}
          {activeView === 'home' && activeBottomTab === 'social' && (
            <div className="overflow-x-auto pb-2 px-4 hide-scrollbar">
              <div className="flex items-center gap-2 min-w-max">
                {feedTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeFeedType === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFeedType(tab.id as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                        isActive
                          ? 'text-white'
                          : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={isActive ? { backgroundColor: tab.color } : {}}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mobile Menu Sidebar */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                />
                
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className={`fixed top-0 left-0 h-full w-72 z-50 lg:hidden ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  } shadow-2xl`}
                >
                  <div className={`flex items-center justify-between p-4 border-b ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Menu
                    </h2>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100%-80px)]">
                    <button
                      onClick={() => { setActiveView('home'); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeView === 'home'
                          ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                          : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <HomeIcon className="w-5 h-5" />
                      <span className="font-medium">Home</span>
                    </button>
                    <button
                      onClick={() => { setActiveView('profile'); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeView === 'profile'
                          ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                          : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Profile</span>
                    </button>
                    <button
                      onClick={() => { setActiveView('business'); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeView === 'business'
                          ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                          : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Briefcase className="w-5 h-5" />
                      <span className="font-medium">Business</span>
                    </button>
                    <button
                      onClick={() => { setActiveView('network'); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeView === 'network'
                          ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                          : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <LinkIcon className="w-5 h-5" />
                      <span className="font-medium">Network</span>
                    </button>
                    <button
                      onClick={() => { setActiveView('security'); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeView === 'security'
                          ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                          : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Security</span>
                    </button>
                    <button
                      onClick={() => { setActiveView('tools'); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeView === 'tools'
                          ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                          : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                      <span className="font-medium">My Tools</span>
                    </button>
                    <button
                      onClick={() => { setIsSettingsOpen(true); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Settings</span>
                    </button>
                    <button 
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        theme === 'dark' ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </nav>
                </motion.div>
              </>
            )}
          </AnimatePresence>
       </header>
      )}

      <div className="flex">
        <aside 
          className={`
            hidden lg:block
            ${isSidebarCollapsed ? 'w-20' : 'w-64'}
            ${isFullScreenView() ? 'h-screen sticky top-0' : 'h-[calc(100vh-73px)] sticky top-[73px]'}
            overflow-y-auto
            ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
            border-r
            transition-all duration-300 ease-in-out
            relative
          `}
        >
          {/* Collapse/Expand Toggle Button */}
          {isFullScreenView() && (
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`
                absolute -right-3 top-6 z-50
                w-6 h-6 rounded-full
                ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
                flex items-center justify-center
                transition-all duration-200
                shadow-md
              `}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          )}
          <div className={`${isSidebarCollapsed ? 'p-3' : 'p-6'} transition-all duration-300`}>
            {/* User Profile Card */}
            <div className={`${isSidebarCollapsed ? 'p-2' : 'p-4'} rounded-xl mb-6 ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className={`flex ${isSidebarCollapsed ? 'flex-col' : 'items-center'} gap-3 mb-3`}>
                <div className="relative">
                  <div className={`${isSidebarCollapsed ? 'w-10 h-10' : 'w-12 h-12'} rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                  } transition-all duration-300`}>
                    <User className={`${isSidebarCollapsed ? 'w-5 h-5' : 'w-6 h-6'} ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-50'
                  } ${presenceMode === 'spirit' ? 'bg-purple-500' : 'bg-green-500'}`} />
                </div>
                
                {!isSidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {displayName}
                    </p>
                    <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {roleName}
                    </p>
                  </div>
                )}
              </div>
              
              {!isSidebarCollapsed && (
                <button
                  onClick={() => setActiveView('profile')}
                  className="w-full text-xs font-semibold text-center py-2 rounded-lg transition-colors"
                  style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
                >
                  View Profile
                </button>
              )}
            </div>

            {/* Navigation */}
            <nav className="space-y-2 mb-6 ">
              <button
                onClick={() => setActiveView('home')}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'home'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={isSidebarCollapsed ? 'Home' : ''}
              >
                <HomeIcon className="w-5 h-5" />
                {!isSidebarCollapsed && <span className="font-medium">Home</span>}
              </button>
              
              <button
                onClick={() => setActiveView('profile')}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'profile'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={isSidebarCollapsed ? 'Profile' : ''}
              >
                <User className="w-5 h-5" />
                {!isSidebarCollapsed && <span className="font-medium">Profile</span>}
              </button>
              
              <button
                onClick={() => setActiveView('business')}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'business'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={isSidebarCollapsed ? 'Business' : ''}
              >
                <Briefcase className="w-5 h-5" />
                {!isSidebarCollapsed && <span className="font-medium">Business</span>}
              </button>
              
              <button
                onClick={() => setActiveView('network')}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'network'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={isSidebarCollapsed ? 'Network' : ''}
              >
                <LinkIcon className="w-5 h-5" />
                {!isSidebarCollapsed && <span className="font-medium">Network</span>}
              </button>
              
              <button
                onClick={() => setActiveView('security')}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'security'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={isSidebarCollapsed ? 'Security' : ''}
              >
                <Shield className="w-5 h-5" />
                {!isSidebarCollapsed && <span className="font-medium">Security</span>}
              </button>
              
              <button
                onClick={() => setActiveView('tools')}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'tools'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={isSidebarCollapsed ? 'My Tools' : ''}
              >
                <Grid className="w-5 h-5" />
                {!isSidebarCollapsed && (
                  <>
                    <span className="font-medium">My Tools</span>
                    <span 
                      className="ml-auto py-0.5 text-xs rounded-full"
                      style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
                    >
                      {tools.length}
                    </span>
                  </>
                )}
              </button>
            </nav>

            {/* Settings */}
            <div className="mb-6">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={isSidebarCollapsed ? 'Settings' : ''}
              >
                <Settings className="w-5 h-5" />
                {!isSidebarCollapsed && <span className="font-medium">Settings</span>}
              </button>
            </div>

            {/* Logout */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={handleLogout}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
                }`}
                title={isSidebarCollapsed ? 'Logout' : ''}
              >
                <LogOut className="w-5 h-5" />
                {!isSidebarCollapsed && <span className="font-medium">Logout</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {isSidebarVisible && isFullScreenView() && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarVisible(false)}
                  className="lg:hidden fixed inset-0 bg-black/60 z-40"
                />
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className={`
                    lg:hidden fixed top-0 left-0 h-full w-64 z-50
                    ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
                    shadow-2xl overflow-y-auto
                  `}
                >
                  {/* Close button */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Menu
                    </h2>
                    <button
                      onClick={() => setIsSidebarVisible(false)}
                      className="p-2 rounded-lg hover:bg-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Sidebar Content - Copy from desktop sidebar */}
                  <div className="p-6">
                    <div className="p-4 rounded-xl mb-6 bg-gray-700/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-600">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-gray-700 ${
                            presenceMode === 'spirit' ? 'bg-purple-500' : 'bg-green-500'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {displayName}
                          </p>
                          <p className="text-xs truncate text-gray-400">{roleName}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveView('profile');
                          setIsSidebarVisible(false);
                        }}
                        className="w-full text-xs font-semibold text-center py-2 rounded-lg transition-colors"
                        style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
                      >
                        View Profile
                      </button>
                    </div>

                    <nav className="space-y-2 mb-6">
                      <button
                        onClick={() => { setActiveView('home'); setIsSidebarVisible(false); setActiveBottomTab('home'); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                          activeView === 'home' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <HomeIcon className="w-5 h-5" />
                        <span className="font-medium">Home</span>
                      </button>
                      
                      <button
                        onClick={() => { setActiveView('profile'); setIsSidebarVisible(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                          activeView === 'profile' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Profile</span>
                      </button>
                      
                      <button
                        onClick={() => { setActiveView('business'); setIsSidebarVisible(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                          activeView === 'business' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <Briefcase className="w-5 h-5" />
                        <span className="font-medium">Business</span>
                      </button>
                      
                      <button
                        onClick={() => { setActiveView('network'); setIsSidebarVisible(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                          activeView === 'network' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <LinkIcon className="w-5 h-5" />
                        <span className="font-medium">Network</span>
                      </button>
                      
                      <button
                        onClick={() => { setActiveView('security'); setIsSidebarVisible(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                          activeView === 'security' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <Shield className="w-5 h-5" />
                        <span className="font-medium">Security</span>
                      </button>
                      
                      <button
                        onClick={() => { setActiveView('tools'); setIsSidebarVisible(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                          activeView === 'tools' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <Grid className="w-5 h-5" />
                        <span className="font-medium">My Tools</span>
                      </button>
                    </nav>

                    <div className="mb-6">
                      <button
                        onClick={() => { setIsSettingsOpen(true); setIsSidebarVisible(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700"
                      >
                        <Settings className="w-5 h-5" />
                        <span className="font-medium">Settings</span>
                      </button>
                    </div>

                    <div className="pt-6 border-t border-gray-700">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          <div className={`${isFullScreenView() ? 'h-screen' : 'p-4 sm:p-6 lg:p-8'} max-w-7xl mx-auto`}>
            <AnimatePresence mode="wait">
              {/* HOME VIEW */}
              {activeView === 'home' && activeBottomTab === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div 
                    className="p-6 sm:p-8 rounded-2xl text-white relative overflow-hidden"
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
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    <motion.button
                      onClick={() => setActiveHomeApp('requests')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2"
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
                      className="flex flex-col items-center gap-2"
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
                      className="flex flex-col items-center gap-2"
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
                      className="flex flex-col items-center gap-2"
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

                    <motion.button
                      onClick={() => setActiveHomeApp('village')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                        <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <span className={`text-xs sm:text-sm font-medium text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Change Village
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
                  className="relative p-4"
                >
                  <AnimatePresence mode="wait">
                    {activeFeedType === 'village' && (
                      <motion.div key="village-feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <FeedTimeline />
                      </motion.div>
                    )}
                    
                    {activeFeedType === 'discover' && (
                      <motion.div key="discover-feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Discover />
                      </motion.div>
                    )}
                    
                    {activeFeedType === 'motion' && (
                      <motion.div key="motion-feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <MotionFeed />
                      </motion.div>
                    )}
                    
                    {activeFeedType === 'gallery' && (
                      <motion.div key="gallery-feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <GalleryFeed />
                      </motion.div>
                    )}
                    
                    {activeFeedType === 'voice' && (
                      <motion.div key="voice-feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className={`p-4 sm:p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                          <div className={`p-8 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                            <Mic className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                            <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              Voice Feed
                            </h3>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Audio discussions and voice notes (Coming Soon)
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {activeFeedType === 'family' && (
                      <motion.div key="family-feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <FamilyCircle />
                      </motion.div>
                    )}
                    
                    {activeFeedType === 'spotlight' && (
                      <motion.div key="spotlight-feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <DiscoverySpotlight />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Floating Create Post Button */}
                  <button
                    onClick={() => setIsComposerOpen(true)}
                    className="fixed bottom-28 right-6 lg:right-12 w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </motion.div>
              )}
              {/* BANKING VIEW */}
              {activeView === 'home' && activeBottomTab === 'banking' && (
                <motion.div key="banking" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`p-12 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <Building2 className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Cowrie Banking</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Send, receive, and manage your Cowries (Wari tokens)</p>
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

              {/* CHAT VIEW */}
              {activeView === 'home' && activeBottomTab === 'chat' && (
                <motion.div key="chat" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`p-12 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <MessageCircle className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Chat</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Direct messages with your connections</p>
                </motion.div>
              )}

              {/* PROFILE VIEW */}
              {activeView === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 max-w-4xl mx-auto p-4">
                  <div className="flex justify-end mb-4">
                    <TwinPresenceToggle 
                      spiritAvatar={spiritAvatar} 
                      fleshPhoto={fleshPhoto} 
                      hasFleshAccess={true} 
                      currentMode={presenceMode} 
                      onToggle={handlePresenceToggle} 
                      photoStatus={photoStatus} 
                    />
                  </div>
                  <ProfileCard viewType="self" onEditProfile={() => console.log('Edit profile')} />
                  <GuardianDashboard
                    shield={{
                      afro_id: user?.afro_id || '',
                      overall_state: 'calm',
                      last_updated: new Date(),
                      guardians: {
                        voice_spirit: { status: 'ok', last_check: new Date(), message: 'Voice pattern matches your blessing', voiceprint_match_score: 95 },
                        drum_binding: { status: 'ok', last_check: new Date(), message: 'This device is blessed and recognized', registered_devices: 2, current_device_blessed: true },
                        footsteps: { status: 'ok', last_check: new Date(), message: 'Your movements are consistent and familiar', anomaly_score: 5 },
                        cultural_memory: { status: 'ok', last_check: new Date(), message: 'Your identity remains true to your oath', consistency_score: 92 },
                      },
                      recommended_restrictions: [],
                      requires_clan_blessing: false,
                    }}
                    showDetails={true}
                  />
                  <AfroIDSection showWarning={true} allowDownload={true} allowShare={true} />
                  
                  {/* Analytics Section */}
                  <div className={`p-8 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                    <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Analytics
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>248</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Connections</p>
                      </div>
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>1.2k</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Views</p>
                      </div>
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>42</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Posts</p>
                      </div>
                      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>89%</p>
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Engagement</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ✅ PHASE 6: BUSINESS VIEW - WITH SUB-TABS */}
              {activeView === 'business' && (
                <motion.div key="business" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 p-4">
                  <div>
                    <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Business Sessions
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Manage your professional engagements
                    </p>
                  </div>

                  {/* Business Tabs */}
                  <div className={`flex gap-2 overflow-x-auto pb-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    {businessTabs.map((tab) => {
                      const TabIcon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveBusinessTab(tab.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                            activeBusinessTab === tab.id
                              ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                              : theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <TabIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Business Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeBusinessTab === 'sessions' && (
                      <motion.div key="sessions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {showBusinessSession ? (
                          <BusinessSession 
                            professionalId="prof-123"
                            professionalName="John Doe"
                            professionalVillage={villageName}
                            professionalVillageColor={villageColor}
                            professionalCrest={8}
                            serviceType="Professional Service"
                            onClose={() => {
                              console.log('Closing BusinessSession');
                              setShowBusinessSession(false);
                            }}
                          />
                        ) : (
                          <div className="space-y-4">
                            <div className={`p-6 rounded-xl border text-center ${
                              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                            }`}>
                              <Briefcase className={`w-12 h-12 mx-auto mb-3 ${
                                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                              }`} />
                              <h3 className={`text-lg font-bold mb-2 ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                No Active Sessions
                              </h3>
                              <p className={`text-sm mb-4 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                Start a new business session with a professional
                              </p>
                              <button
                                onClick={() => setShowBusinessSession(true)}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                              >
                                Start New Session
                              </button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                    {activeBusinessTab === 'escrow' && (
                      <motion.div key="escrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <EscrowManager 
                          escrowId="esc-456"
                          amount={45000}
                          currency="NGN"
                          payerId={user?.id || 'user-123'}
                          beneficiaryId="prof-123"
                          payerName={displayName}
                          beneficiaryName="John Doe"
                          status="locked"
                          createdAt={new Date().toISOString()}
                          onFund={() => console.log('Fund escrow')}
                          onRelease={() => console.log('Release escrow')}
                          onRefund={() => console.log('Refund escrow')}
                          onRaiseDispute={(reason, evidence) => console.log('Raise dispute', reason, evidence)}
                        />
                      </motion.div>
                    )}
                    {activeBusinessTab === 'history' && (
                      <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <SessionHistory 
                          userId={user?.id || 'user-123'}
                          transactions={[]}
                          isLoading={false}
                          onViewDetails={(sessionId) => console.log('View details', sessionId)}
                          onDownloadReceipt={(receiptId) => console.log('Download receipt', receiptId)}
                          onViewDispute={(sessionId) => console.log('View dispute', sessionId)}
                        />
                      </motion.div>
                    )}
                    {activeBusinessTab === 'disputes' && (
                      <motion.div key="disputes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <DisputeResolution 
                          escrowId="esc-456"
                          disputeId="disp-789"
                          mootId="moot-101"
                          sessionId="sess-202"
                          amount={45000}
                          raisedBy="payer"
                          status="evidence_submission"
                          parties={{
                            payer: { id: user?.id || 'user-123', name: displayName, crest: 7 },
                            beneficiary: { id: 'prof-123', name: 'John Doe', crest: 8 }
                          }}
                          mediator={{
                            id: 'med-303',
                            name: 'Elder Smith',
                            village: villageName,
                            crest: 10,
                            mootsResolved: 45
                          }}
                          evidence={[]}
                          messages={[]}
                          timeline={{
                            initiated: new Date().toISOString(),
                            mediatorAssigned: new Date().toISOString(),
                            evidenceDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
                          }}
                          onFileUpload={async (file, description) => console.log('File upload', file, description)}
                          onSendMessage={async (message, isPrivate) => console.log('Send message', message, isPrivate)}
                          onAcceptResolution={async () => console.log('Accept resolution')}
                          onRejectResolution={async () => console.log('Reject resolution')}
                          onEscalate={async (reason) => console.log('Escalate', reason)}
                          onClose={() => setActiveBusinessTab('disputes')}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              // ✅ PHASE 7: NETWORK VIEW - WITH SUB-TABS (Fixed)
              {activeView === 'network' && (
                <motion.div key="network" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 p-4">
                  <div>
                    <h2 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Kinship Network
                    </h2>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Your professional connections and community
                    </p>
                  </div>

                  {/* Network Tabs */}
                  <div className={`flex gap-2 overflow-x-auto pb-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    {networkTabs.map((tab) => {
                      const TabIcon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveNetworkTab(tab.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                            activeNetworkTab === tab.id
                              ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                              : theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <TabIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Network Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeNetworkTab === 'kinship' && (
                      <motion.div key="kinship" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <KinshipNetwork 
                          userId={user?.id || 'user-123'}
                          userVillage={villageName}
                          connections={[]}
                          pendingRequests={0}
                          isLoading={false}
                          onViewProfile={(connectionId) => console.log('View profile', connectionId)}
                          onSendMessage={(connectionId) => console.log('Send message', connectionId)}
                          onViewRequests={() => setActiveNetworkTab('requests')}
                        />
                      </motion.div>
                    )}
                    {activeNetworkTab === 'requests' && (
                      <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <LinkRequest 
                          currentUserId={user?.id || 'user-123'}
                          receivedRequests={[]}
                          sentRequests={[]}
                          suggestions={[]}
                          isLoading={false}
                          onAcceptRequest={async (requestId) => console.log('Accept request', requestId)}
                          onRejectRequest={async (requestId) => console.log('Reject request', requestId)}
                          onCancelRequest={async (requestId) => console.log('Cancel request', requestId)}
                          onSendRequest={async (userId, message) => console.log('Send request', userId, message)}
                          onViewProfile={(userId) => console.log('View profile', userId)}
                        />
                      </motion.div>
                    )}
                    {activeNetworkTab === 'stats' && (
                      <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <NetworkStats 
                          userId={user?.id || 'user-123'}
                          metrics={{
                            totalConnections: 248,
                            newConnectionsThisWeek: 12,
                            connectionGrowthRate: 15.5,
                            averageCrest: 7.2,
                            totalSessions: 156,
                            activeConnections: 189,
                            mutualConnectionRate: 0.68
                          }}
                          villageDistribution={[
                            { village: villageName, count: 85, percentage: 34 },
                            { village: 'Technology', count: 62, percentage: 25 },
                            { village: 'Creative', count: 48, percentage: 19 },
                            { village: 'Business', count: 35, percentage: 14 },
                            { village: 'Healthcare', count: 18, percentage: 8 }
                          ]}
                          tierDistribution={[
                            { tier: 'C1', count: 156, percentage: 63 },
                            { tier: 'C2', count: 68, percentage: 27 },
                            { tier: 'C3', count: 24, percentage: 10 }
                          ]}
                          engagementData={{
                            messagesExchanged: 1247,
                            profileViews: 3456,
                            sessionRequests: 89,
                            averageResponseTime: '2h'
                          }}
                          growthData={[
                            { period: 'Jan', connections: 180, sessions: 45 },
                            { period: 'Feb', connections: 195, sessions: 52 },
                            { period: 'Mar', connections: 210, sessions: 63 },
                            { period: 'Apr', connections: 228, sessions: 78 },
                            { period: 'May', connections: 248, sessions: 89 }
                          ]}
                          topConnections={[
                            { id: '1', name: 'Sarah Johnson', village: 'Technology', sessions: 23, mutualConnections: 45 },
                            { id: '2', name: 'Michael Chen', village: 'Creative', sessions: 18, mutualConnections: 38 },
                            { id: '3', name: 'Amina Okafor', village: villageName, sessions: 15, mutualConnections: 52 }
                          ]}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              // ✅ PHASE 8: SECURITY VIEW - WITH SUB-TABS (Fixed)
              {activeView === 'security' && (
                <motion.div key="security" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 p-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Ancestral Shield
                      </h2>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Your complete security and verification system
                      </p>
                    </div>
                  </div>

                  {/* Security Tabs */}
                  <div className={`flex gap-2 overflow-x-auto pb-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                    {securityTabs.map((tab) => {
                      const TabIcon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveSecurityTab(tab.id as any)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                            activeSecurityTab === tab.id
                              ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                              : theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <TabIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Security Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeSecurityTab === 'dashboard' && (
                      <motion.div key="security-dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <SecurityDashboard 
                          userId={user?.id || 'user-123'}
                          metrics={{
                            overallScore: 85,
                            securityLevel: 'high',
                            threatLevel: 'low',
                            lastSecurityCheck: new Date().toISOString(),
                            protectionModesActive: 4
                          }}
                          verificationStatus={{
                            crest: 7,
                            shield: {
                              level: 3,
                              maxLevel: 5,
                              status: 'active'
                            },
                            honor: {
                              stage: 2,
                              maxStage: 5,
                              title: 'Trusted Member'
                            }
                          }}
                          recentActivity={[
                            {
                              id: '1',
                              type: 'login',
                              description: 'Successful login from Lagos',
                              timestamp: new Date().toISOString(),
                              location: 'Lagos, Nigeria',
                              device: 'iPhone 14',
                              status: 'success'
                            }
                          ]}
                          trustedDevices={[
                            {
                              id: 'dev-1',
                              name: 'iPhone 14',
                              type: 'mobile',
                              lastUsed: new Date().toISOString(),
                              location: 'Lagos, Nigeria',
                              isCurrentDevice: true
                            }
                          ]}
                          emergencyContacts={3}
                          activeSessions={1}
                          protectionModeActive={false}
                          onViewActivity={() => console.log('View activity')}
                          onManageDevices={() => setActiveSecurityTab('devices')}
                          onManageContacts={() => console.log('Manage contacts')}
                          onViewSessions={() => setActiveSecurityTab('sessions')}
                          onConfigureSecurity={() => console.log('Configure security')}
                          onActivateProtection={() => console.log('Activate protection')}
                        />
                      </motion.div>
                    )}
                    {activeSecurityTab === 'watchful-eye' && (
                      <motion.div key="watchful-eye" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <WatchfulEye 
                          isActive={true}
                          reason="transaction"
                          transactionAmount={45000}
                          onCaptureComplete={async (capture) => {
                            console.log('Capture complete', capture);
                            return true;
                          }}
                          onCancel={() => setActiveSecurityTab('dashboard')}
                          onSkip={() => setActiveSecurityTab('dashboard')}
                        />
                      </motion.div>
                    )}
                    {activeSecurityTab === 'verification' && (
                      <motion.div key="verification" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <VerificationTiers 
                          crest={{
                            level: 7,
                            maxLevel: 10,
                            progress: 65,
                            nextLevelRequirements: {
                              transactions: 50,
                              rating: 4.5,
                              timeInDays: 90
                            },
                            benefits: [
                              'Access to premium tools',
                              'Priority support',
                              'Lower transaction fees',
                              'Verified badge'
                            ]
                          }}
                          shield={{
                            level: 3,
                            maxLevel: 5,
                            status: 'active',
                            protections: [
                              {
                                name: 'Two-Factor Authentication',
                                enabled: true,
                                description: 'Extra layer of security for your account'
                              },
                              {
                                name: 'Device Recognition',
                                enabled: true,
                                description: 'Automatic detection of trusted devices'
                              },
                              {
                                name: 'Face Verification',
                                enabled: false,
                                description: 'Biometric verification for sensitive actions'
                              }
                            ],
                            vulnerabilities: []
                          }}
                          honor={{
                            stage: 2,
                            maxStage: 5,
                            title: 'Trusted Member',
                            description: 'You have established yourself as a reliable community member',
                            achievements: [
                              {
                                name: 'Complete Profile',
                                completed: true,
                                description: 'Fill out all profile information'
                              },
                              {
                                name: 'First Connection',
                                completed: true,
                                description: 'Make your first professional connection'
                              },
                              {
                                name: 'Verified Identity',
                                completed: false,
                                description: 'Complete identity verification process'
                              }
                            ],
                            nextStageRequirements: [
                              'Complete 100 successful transactions',
                              'Maintain 4.5+ rating for 6 months',
                              'Verify your identity with government ID'
                            ]
                          }}
                          onUpgradeCrest={() => console.log('Upgrade crest')}
                          onActivateShield={() => console.log('Activate shield')}
                          onViewAchievements={() => console.log('View achievements')}
                        />
                      </motion.div>
                    )}
                    {activeSecurityTab === 'devices' && (
                      <motion.div key="devices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <DeviceManager 
                          devices={[
                            {
                              id: 'dev-1',
                              name: 'iPhone 14',
                              type: 'mobile',
                              browser: 'safari',
                              browserVersion: '17.0',
                              os: 'iOS',
                              osVersion: '17.0',
                              status: 'active',
                              location: {
                                city: 'Lagos',
                                country: 'Nigeria'
                              },
                              ipAddress: '197.210.x.x',
                              lastActive: new Date(),
                              firstSeen: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                              isCurrent: true,
                              trustScore: 95,
                              loginCount: 156
                            }
                          ]}
                          currentDeviceId="dev-1"
                          onTrustDevice={(deviceId) => console.log('Trust device', deviceId)}
                          onBlockDevice={(deviceId) => console.log('Block device', deviceId)}
                          onRemoveDevice={(deviceId) => console.log('Remove device', deviceId)}
                          onRefreshDevices={() => console.log('Refresh devices')}
                          onAddDevice={() => console.log('Add device')}
                        />
                      </motion.div>
                    )}
                    {activeSecurityTab === 'sessions' && (
                      <motion.div key="sessions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <SessionMonitor 
                          sessions={[
                            {
                              id: 'sess-1',
                              deviceName: 'iPhone 14',
                              deviceType: 'mobile',
                              browser: 'Safari',
                              browserVersion: '17.0',
                              os: 'iOS 17.0',
                              location: {
                                city: 'Lagos',
                                country: 'Nigeria',
                                ip: '197.210.x.x'
                              },
                              status: 'active',
                              startedAt: new Date(),
                              lastActivity: new Date(),
                              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                              isCurrent: true,
                              isSecure: true,
                              activities: [
                                {
                                  timestamp: new Date(),
                                  action: 'Logged in',
                                  details: 'From Lagos, Nigeria'
                                }
                              ]
                            }
                          ]}
                          onTerminateSession={(sessionId) => console.log('Terminate session', sessionId)}
                          onTerminateAllOthers={() => console.log('Terminate all others')}
                          onRefreshSessions={() => console.log('Refresh sessions')}
                          maxConcurrentSessions={5}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* TOOLS VIEW */}
              {activeView === 'tools' && (
                <motion.div key="tools" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 p-4">
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>My Tools</h2>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{tools.length} tools available for {roleName}</p>
                  </div>
                  
                  {tools.length === 0 ? (
                    <div className={`p-12 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                      <Grid className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                      <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>No Tools Available Yet</h3>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Complete your profile verification to access your professional tools
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {tools.map((tool) => {
                        const ToolIcon = resolveIcon(tool.icon);
                        return (
                          <motion.button 
                            key={tool.toolId} 
                            whileHover={{ scale: 1.02 }} 
                            whileTap={{ scale: 0.98 }} 
                            className={`p-6 rounded-xl text-left transition-all ${
                              theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'
                            }`}
                          >
                            <div 
                              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" 
                              style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
                            >
                              <ToolIcon className="w-7 h-7" />
                            </div>
                            <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {tool.toolName}
                            </h4>
                            <p className={`text-sm line-clamp-2 mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {tool.description}
                            </p>
                            {tool.category && (
                              <span 
                                className="inline-block px-2 py-1 text-xs rounded-full" 
                                style={{ backgroundColor: `${villageColor}15`, color: villageColor }}
                              >
                                {tool.category}
                              </span>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 h-22 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
          <div className="flex items-center justify-around px-2 py-2 max-w-screen-xl mx-auto">
            {bottomNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeBottomTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveBottomTab(item.id as any);
                    setActiveView('home');
                  }}
                  className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all ${
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
        </nav>
      

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
                    {activeHomeApp === 'village' && 'Change Village or Role'}
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
                  {activeHomeApp === 'village' && (
                    <VillageChangeSection onOpenVillageSelector={handleOpenVillageSelector} />
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Global Modals */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
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
      
      {protectionMode?.active && (
        <ProtectionModeScreen 
          protectionMode={protectionMode} 
          onRequestCircle={handleRequestCircle} 
          onContactSupport={handleContactSupport} 
        />
      )}

        {/* Feed Composer Modal */}
      <FeedComposer 
        isOpen={isComposerOpen} 
        onClose={() => setIsComposerOpen(false)}
        defaultFeedType={activeFeedType}
        onPost={(postData) => {
          console.log('Post created:', postData);
          setIsComposerOpen(false);
          // TODO: Handle post submission
        }}
      />
    </div>
  );
};

export default DashboardHome;
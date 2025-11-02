import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  Settings,
  Bell,
  Search,
  User,
  Menu,
  X,
  LogOut,
  //ChevronRight,
  Grid,
  BarChart,
  Calendar,
  MessageSquare,
  //FileText,
  Users,
  Sun,
  Moon,
  Shield,
  Heart,
  // Bottom Nav Icons
  Share2,
  Compass,
  Wallet,
  Bot,
  //TrendingUp
} from 'lucide-react';
import { GuardianDashboard } from './GuardianDashboard';
import * as Icons from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { toggleTheme } from '@store/slices/themeSlice';

// Import village configs
import healthcareConfig from '../../config/villages/healthcare.json';
import farmingConfig from '../../config/villages/farming.json';
import constructionConfig from '../../config/villages/construction.json';
import businessConfig from '../../config/villages/business.json';
import creativeConfig from '../../config/villages/creative.json';
import educationConfig from '../../config/villages/education.json';
import governmentConfig from '../../config/villages/government.json';
import transportConfig from '../../config/villages/transport.json';
import technologyConfig from '../../config/villages/technology.json';
import hospitalityConfig from '../../config/villages/hospitality.json';
import financeConfig from '../../config/villages/finance.json';
import environmentConfig from '../../config/villages/environment.json';

// Import new components
import { FeedTimeline } from '@components/feed/FeedTimeline';
import { ProfileCard } from './ProfileCard';
import { AfroIDSection } from './AfroIDSection';
import { MessageRequests } from '@components/messaging/MessageRequests';
import { TrustedConnections } from '@components/messaging/TrustedConnections';

const villageConfigs: Record<string, any> = {
   healthcare: healthcareConfig,
   farming: farmingConfig,
   construction: constructionConfig,
   business: businessConfig,
   creative: creativeConfig,
   education: educationConfig,
   government: governmentConfig,
   transport: transportConfig,
   technology: technologyConfig,
   hospitality: hospitalityConfig,
   finance: financeConfig,
   environment: environmentConfig,
};

interface Tool {
  toolId: string;
  toolName: string;
  description: string;
  icon?: string;
  category?: string;
}

const DashboardHome: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'profile' | 'tools' | 'analytics'>('overview');
  const [activeBottomTab, setActiveBottomTab] = useState<'social' | 'discover' | 'banking' | 'ai'>('social');
  
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  const userVillage = useAppSelector((state) => state.user.village);
  const userRole = useAppSelector((state) => state.user.role);
  const phoneNumber = useAppSelector((state) => state.auth.phoneNumber);
  const messageRequests = useAppSelector((state) => state.user.messageRequests);

  // Get village config and role-specific tools
  const villageConfig = userVillage?.villageId ? villageConfigs[userVillage.villageId] : null;
  const roleConfig = villageConfig?.roles?.find((r: any) => r.roleId === userRole?.roleId);
  const tools: Tool[] = roleConfig?.tools || [];
  const villageColor = villageConfig?.color || '#10b981';

  // Count pending message requests
  const pendingRequestsCount = messageRequests.filter(r => r.status === 'pending').length;

  // Helper to resolve Lucide icons
  const resolveIcon = (iconName?: string) => {
    if (!iconName) return Grid;
    const IconComp = (Icons as any)[iconName];
    return IconComp || Grid;
  };

  // Get role icon
  const RoleIcon = resolveIcon(roleConfig?.icon);

  // Display name for user
  const displayName = user?.full_name || user?.name || phoneNumber || 'User';

  // Bottom navigation items
  const bottomNavItems = [
    { id: 'social', icon: Share2, label: 'Social', color: '#3b82f6' },
    { id: 'discover', icon: Compass, label: 'Discover', color: '#ec4899' },
    { id: 'banking', icon: Wallet, label: 'Banking', color: '#10b981' },
    { id: 'ai', icon: Bot, label: 'AI Agent', color: '#8b5cf6' },
  ];

  return (
    <div className={`min-h-screen pb-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Header */}
      <header className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo/Title */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
            >
              <RoleIcon className="w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {roleConfig?.roleName || 'Dashboard'}
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {villageConfig?.villageName}
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <button className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            <button 
              className={`p-2 rounded-lg relative ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              onClick={() => setActiveView('overview')} // TODO: Open notifications panel
            >
              <Bell className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              {pendingRequestsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button 
              onClick={() => dispatch(toggleTheme())}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              <Settings className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`lg:hidden border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
            >
              <nav className="px-4 py-4 space-y-2">
                <button
                  onClick={() => { setActiveView('overview'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeView === 'overview'
                      ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                      : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Overview</span>
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
                  onClick={() => { setActiveView('analytics'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeView === 'analytics'
                      ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                      : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <BarChart className="w-5 h-5" />
                  <span className="font-medium">Analytics</span>
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className={`hidden lg:block w-64 h-[calc(100vh-73px)] sticky top-[73px] overflow-y-auto ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-r`}>
          <div className="p-6">
            {/* User Profile Mini Card */}
            <div className={`p-4 rounded-xl mb-6 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  <User className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {displayName}
                  </p>
                  <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {roleConfig?.roleName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveView('profile')}
                className="w-full text-xs font-semibold text-center py-2 rounded-lg transition-colors"
                style={{ 
                  backgroundColor: `${villageColor}20`, 
                  color: villageColor 
                }}
              >
                View Profile
              </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 mb-6">
              <button
                onClick={() => setActiveView('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'overview'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Overview</span>
              </button>
              <button
                onClick={() => setActiveView('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'profile'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Profile</span>
              </button>
              <button
                onClick={() => setActiveView('tools')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'tools'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Grid className="w-5 h-5" />
                <span className="font-medium">My Tools</span>
                <span 
                  className="ml-auto px-2 py-0.5 text-xs rounded-full"
                  style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
                >
                  {tools.length}
                </span>
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'analytics'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <BarChart className="w-5 h-5" />
                <span className="font-medium">Analytics</span>
              </button>
            </nav>

            {/* Quick Links */}
            <div>
              <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-4 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}>
                Quick Links
              </h3>
              <div className="space-y-2">
                <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}>
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Whispers</span>
                  {pendingRequestsCount > 0 && (
                    <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-red-500 text-white">
                      {pendingRequestsCount}
                    </span>
                  )}
                </button>
                <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}>
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Trusted</span>
                </button>
                <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}>
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Community</span>
                </button>
                <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}>
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Calendar</span>
                </button>
              </div>
            </div>

            {/* Logout */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                theme === 'dark' ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
              }`}>
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {/* Overview / Social Feed */}
              {activeView === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Welcome Banner */}
                  <div 
                    className="p-6 sm:p-8 rounded-2xl text-white relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${villageColor} 0%, ${villageColor}dd 100%)` }}
                  >
                    <div className="relative z-10">
                      <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                        Welcome back, {displayName}! 👋
                      </h2>
                      <p className="text-white/90 text-sm sm:text-base">
                        Ready to connect with the Motherland today
                      </p>
                    </div>
                    <div className="absolute right-0 top-0 w-32 h-32 sm:w-48 sm:h-48 opacity-10">
                      <RoleIcon className="w-full h-full" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`p-4 sm:p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                      <Grid className={`w-5 h-5 mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      <p className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {tools.length}
                      </p>
                      <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Tools
                      </p>
                    </div>
                    <div className={`p-4 sm:p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                      <MessageSquare className={`w-5 h-5 mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      <p className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {pendingRequestsCount}
                      </p>
                      <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Requests
                      </p>
                    </div>
                    <div className={`p-4 sm:p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                      <Heart className={`w-5 h-5 mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      <p className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        0
                      </p>
                      <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Connections
                      </p>
                    </div>
                    <div className={`p-4 sm:p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                      <Users className={`w-5 h-5 mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      <p className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        248
                      </p>
                      <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Community
                      </p>
                    </div>
                  </div>

                  {/* Render content based on active bottom tab */}
                  {activeBottomTab === 'social' && (
                    <div>
                      <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Your Feed
                      </h3>
                      <FeedTimeline />
                    </div>
                  )}

                  {activeBottomTab === 'discover' && (
                    <div className={`p-12 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                      <Compass className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                      <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Discover
                      </h3>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Explore villages, find professionals, discover content
                      </p>
                    </div>
                  )}

                  {activeBottomTab === 'banking' && (
                    <div className={`p-12 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                      <Wallet className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                      <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Cowrie Banking
                      </h3>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Send, receive, and manage your Cowries (Wari tokens)
                      </p>
                    </div>
                  )}

                  {activeBottomTab === 'ai' && (
                    <div className={`p-12 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                      <Bot className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                      <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        AI Agent
                      </h3>
                      <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Your intelligent assistant for professional guidance
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Profile View */}
              {activeView === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6 max-w-4xl mx-auto"
                >
                  <ProfileCard
                    viewType="self"
                    onEditProfile={() => console.log('Edit profile')}
                  />
                  
                  {/* ✅ ADD Guardian Dashboard */}
                  <GuardianDashboard
                    shield={{
                      afro_id: user?.afro_id || '',
                      overall_state: 'calm',
                      last_updated: new Date(),
                      guardians: {
                        voice_spirit: {
                          status: 'ok',
                          last_check: new Date(),
                          message: 'Voice pattern matches your blessing',
                          voiceprint_match_score: 95,
                        },
                        drum_binding: {
                          status: 'ok',
                          last_check: new Date(),
                          message: 'This device is blessed and recognized',
                          registered_devices: 2,
                          current_device_blessed: true,
                        },
                        footsteps: {
                          status: 'ok',
                          last_check: new Date(),
                          message: 'Your movements are consistent and familiar',
                          anomaly_score: 5,
                        },
                        cultural_memory: {
                          status: 'ok',
                          last_check: new Date(),
                          message: 'Your identity remains true to your oath',
                          consistency_score: 92,
                        },
                      },
                      recommended_restrictions: [],
                      requires_clan_blessing: false,
                    }}
                    showDetails={true}
                  />
                  
                  <AfroIDSection
                    showWarning={true}
                    allowDownload={true}
                    allowShare={true}
                  />

                  <MessageRequests />
                  
                  <TrustedConnections />
                </motion.div>
              )}

              {/* Tools View */}
              {activeView === 'tools' && (
                <motion.div
                  key="tools"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      My Tools
                    </h2>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {tools.length} tools available for {roleConfig?.roleName}
                    </p>
                  </div>

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
                </motion.div>
              )}

              {/* Analytics View */}
              {activeView === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Analytics
                    </h2>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Track your progress and performance
                    </p>
                  </div>

                  <div className={`p-12 rounded-xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <BarChart className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Analytics Coming Soon
                    </p>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Track your activity and see detailed insights
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border-t`}>
        <div className="flex items-center justify-around px-4 py-3 max-w-screen-xl mx-auto">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeBottomTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveBottomTab(item.id as any);
                  setActiveView('overview'); // Always go to overview when switching bottom tabs
                }}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'scale-105'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isActive ? 'scale-110' : ''
                  }`}
                  style={{
                    backgroundColor: isActive ? `${item.color}20` : theme === 'dark' ? '#374151' : '#f3f4f6',
                    color: isActive ? item.color : theme === 'dark' ? '#9ca3af' : '#6b7280'
                  }}
                >
                  <Icon className="w-6 h-6" />
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
    </div>
  );
};

export default DashboardHome;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home as HomeIcon,
  Bell,
  Search,
  User,
  Menu,
  X,
  LogOut,
  Grid,
  BarChart,
  Shield,
  Settings,
  Share2,
  Building2,
  Bot,
  Compass,
  MessageSquare,
  Heart,
  Users,
  RefreshCw,
} from 'lucide-react';
import { GuardianDashboard } from './GuardianDashboard';
import * as Icons from 'lucide-react';
import { useAppSelector } from '@store/hooks';

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

import { FeedTimeline } from '@components/feed/FeedTimeline';
import { ProfileCard } from './ProfileCard';
import { AfroIDSection } from './AfroIDSection';
import { SettingsPanel } from '@components/settings/SettingsPanel';
import { NotificationCenter } from '@components/notifications/NotificationCenter';
import { EmergencyContactsManager } from '@components/security/EmergencyContactsManager';
import { LocationTruthPanel } from '@components/dashboard/LocationTruthPanel';
import { TwinPresenceToggle } from '@components/dashboard/TwinPresenceToggle';
import { ProtectionModeScreen } from '@components/security/ProtectionModeScreen';
import { ToolsSection } from '@components/home/ToolsSection';
import { RequestsSection } from '@components/home/RequestsSection';
import { ConnectionsSection } from '@components/home/ConnectionsSection';
import { CommunitySection } from '@components/home/CommunitySection';
import { FamilyTreeSection } from '@components/home/FamilyTreeSection';
import { ContentPreferencesSection } from '@components/home/ContentPreferencesSection';
import { VillageChangeSection } from '@components/home/VillageChangeSection';
import { VillageSelector } from '@components/village/VillageSelector';
import { RoleChangeRequest } from '@components/village/RoleChangeRequest';

import type { EmergencyContact, ProtectionMode } from '@/types/security.types';
import type { LocationTruth } from '@/types/location.types';

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
  const [activeView, setActiveView] = useState<'home' | 'profile' | 'tools' | 'analytics' | 'security'>('home');
  const [activeBottomTab, setActiveBottomTab] = useState<'home' | 'social' | 'discover' | 'banking' | 'ai'>('home');
  const [activeHomeApp, setActiveHomeApp] = useState<string | null>(null);
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
  const [presenceMode, setPresenceMode] = useState<'spirit' | 'flesh'>('spirit');
  const [protectionMode] = useState<ProtectionMode | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      afro_id: 'YRB-LION-95-HEAL-ELDER01',
      display_name: 'Adebayo Johnson',
      relationship: 'Brother',
      phone: '8012345678',
      last_confirmed: new Date('2024-01-15'),
    },
    {
      afro_id: 'IGB-EAGLE-88-TEACH-KEEPER12',
      display_name: 'Chiamaka Okonkwo',
      relationship: 'Close Friend',
      phone: '8087654321',
      last_confirmed: new Date('2024-01-10'),
    },
  ]);
  
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  const userVillage = useAppSelector((state) => state.user.village);
  const userRole = useAppSelector((state) => state.user.role);
  const phoneNumber = useAppSelector((state) => state.auth.phoneNumber);
  const messageRequests = useAppSelector((state) => state.user.messageRequests);

  const villageConfig = userVillage?.villageId ? villageConfigs[userVillage.villageId] : null;
  const roleConfig = villageConfig?.roles?.find((r: any) => r.roleId === userRole?.roleId);
  const tools: Tool[] = roleConfig?.tools || [];
  const villageColor = villageConfig?.color || '#10b981';
  const pendingRequestsCount = messageRequests.filter(r => r.status === 'pending').length;

  const resolveIcon = (iconName?: string) => {
    if (!iconName) return Grid;
    const IconComp = (Icons as any)[iconName];
    return IconComp || Grid;
  };

  const RoleIcon = resolveIcon(roleConfig?.icon);
  const displayName = user?.full_name || user?.name || phoneNumber || 'User';
  const spiritAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=spirit';
  const fleshPhoto = 'https://api.dicebear.com/7.x/avataaars/svg?seed=real';
  const photoStatus: 'verified_real' | 'flagged_filtered' | 'rejected_ai' | 'not_uploaded' = 'verified_real';
  
  const locationTruth: LocationTruth = {
    network_region_guess: 'West Africa / NG',
    spoken_declaration: 'I am in Lagos, Victoria Island, Nigeria',
    clan_confirmations: [
      {
        afro_id: 'YRB-LION-95-HEAL-ELDER01',
        display_name: 'Adebayo Johnson',
        confirmed_at: new Date('2024-01-15'),
        location_claimed: 'Lagos, Nigeria',
      },
    ],
    last_verified_at: new Date(),
    confidence_score: 85,
  };

  const handlePresenceToggle = (mode: 'spirit' | 'flesh') => {
    setPresenceMode(mode);
  };

  const handleAddContact = (contact: Omit<EmergencyContact, 'afro_id'>) => {
    const newContact: EmergencyContact = { ...contact, afro_id: `TEMP-${Date.now()}` };
    setEmergencyContacts([...emergencyContacts, newContact]);
  };

  const handleRemoveContact = (afroId: string) => {
    setEmergencyContacts(emergencyContacts.filter(c => c.afro_id !== afroId));
  };

  const handleUpdateContact = (afroId: string, contact: Omit<EmergencyContact, 'afro_id'>) => {
    setEmergencyContacts(emergencyContacts.map(c => 
      c.afro_id === afroId ? { ...contact, afro_id: afroId } : c
    ));
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

  const bottomNavItems = [
    { id: 'home', icon: HomeIcon, label: 'Home', color: '#10b981' },
    { id: 'social', icon: Share2, label: 'Social', color: '#3b82f6' },
    { id: 'discover', icon: Compass, label: 'Discover', color: '#ec4899' },
    { id: 'banking', icon: Building2, label: 'Banking', color: '#f59e0b' },
    { id: 'ai', icon: Bot, label: 'AI Agent', color: '#8b5cf6' },
  ];

  return (
    <div className={`min-h-screen pb-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Header */}
      <header className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                {roleConfig?.roleName || 'Dashboard'}
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {villageConfig?.villageName}
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
                <button
                  onClick={() => { setIsSettingsOpen(true); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
                <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'
                }`}>
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
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
            <div className={`p-4 rounded-xl mb-6 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    <User className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-50'
                  } ${presenceMode === 'spirit' ? 'bg-purple-500' : 'bg-green-500'}`} />
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
                style={{ backgroundColor: `${villageColor}20`, color: villageColor }}
              >
                View Profile
              </button>
            </div>

            <nav className="space-y-2 mb-6">
              <button
                onClick={() => setActiveView('home')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'home'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <HomeIcon className="w-5 h-5" />
                <span className="font-medium">Home</span>
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
                onClick={() => setActiveView('security')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === 'security'
                    ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                    : theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Security</span>
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

            <div className="mb-6">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
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
              {/* HOME VIEW - PHONE APP GRID */}
              {activeView === 'home' && activeBottomTab === 'home' && (
                <motion.div
                  key="home"
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

                  {/* App Grid - Phone Style */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
                    {/* Tools App */}
                    <motion.button
                      onClick={() => setActiveHomeApp('tools')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
                        <Grid className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <span className={`text-xs sm:text-sm font-medium text-center ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        My Tools
                      </span>
                    </motion.button>

                    {/* Requests App */}
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

                    {/* Connections App */}
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

                    {/* Community App */}
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

                    {/* Family Tree App */}
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

                    {/* Preferences App */}
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

                    {/* Village Change App */}
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

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                      <Grid className={`w-5 h-5 mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {tools.length}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Tools
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                      <MessageSquare className={`w-5 h-5 mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {pendingRequestsCount}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Requests
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                      <Heart className={`w-5 h-5 mb-2 ${theme === 'dark' ? 'text-pink-400' : 'text-pink-600'}`} />
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        0
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Connections
                      </p>
                    </div>
                    <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                      <Users className={`w-5 h-5 mb-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        248
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Community
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SOCIAL VIEW */}
              {activeView === 'home' && activeBottomTab === 'social' && (
                <motion.div key="social" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <FeedTimeline />
                </motion.div>
              )}

              {/* DISCOVER VIEW */}
              {activeView === 'home' && activeBottomTab === 'discover' && (
                <motion.div key="discover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`p-12 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  <Compass className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Discover</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Explore villages, find professionals, discover content</p>
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

              {/* PROFILE VIEW */}
              {activeView === 'profile' && (
                <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 max-w-4xl mx-auto">
                  <div className="flex justify-end mb-4">
                    <TwinPresenceToggle spiritAvatar={spiritAvatar} fleshPhoto={fleshPhoto} hasFleshAccess={true} currentMode={presenceMode} onToggle={handlePresenceToggle} photoStatus={photoStatus} />
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
                </motion.div>
              )}

              {/* SECURITY VIEW */}
              {activeView === 'security' && (
                <motion.div key="security" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Security Dashboard</h2>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Your protection and trusted circle</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GuardianDashboard
                      shield={{
                        afro_id: user?.afro_id || '',
                        overall_state: 'calm',
                        last_updated: new Date(),
                        guardians: {
                          voice_spirit: { status: 'ok', last_check: new Date(), message: 'Voice pattern recognized', voiceprint_match_score: 92 },
                          drum_binding: { status: 'ok', last_check: new Date(), message: 'Device blessed and recognized', registered_devices: 2, current_device_blessed: true },
                          footsteps: { status: 'ok', last_check: new Date(), message: 'Behavior pattern normal', anomaly_score: 5 },
                          cultural_memory: { status: 'ok', last_check: new Date(), message: 'Identity consistent', consistency_score: 95 },
                        },
                        recommended_restrictions: [],
                        requires_clan_blessing: false,
                      }}
                      showDetails={true}
                    />
                    <LocationTruthPanel locationTruth={locationTruth} isOwner={true} />
                    <div className="lg:col-span-2">
                      <EmergencyContactsManager contacts={emergencyContacts} maxContacts={5} onAdd={handleAddContact} onRemove={handleRemoveContact} onUpdate={handleUpdateContact} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TOOLS VIEW */}
              {activeView === 'tools' && (
                <motion.div key="tools" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>My Tools</h2>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{tools.length} tools available for {roleConfig?.roleName}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {tools.map((tool) => {
                      const ToolIcon = resolveIcon(tool.icon);
                      return (
                        <motion.button key={tool.toolId} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`p-6 rounded-xl text-left transition-all ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:shadow-lg'}`}>
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${villageColor}20`, color: villageColor }}>
                            <ToolIcon className="w-7 h-7" />
                          </div>
                          <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{tool.toolName}</h4>
                          <p className={`text-sm line-clamp-2 mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{tool.description}</p>
                          {tool.category && (
                            <span className="inline-block px-2 py-1 text-xs rounded-full" style={{ backgroundColor: `${villageColor}15`, color: villageColor }}>{tool.category}</span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ANALYTICS VIEW */}
              {activeView === 'analytics' && (
                <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div>
                    <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Analytics</h2>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Track your progress and performance</p>
                  </div>
                  <div className={`p-12 rounded-xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <BarChart className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Analytics Coming Soon</p>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Track your activity and see detailed insights</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className={`fixed bottom-0 left-0 right-0 z-50 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
        <div className="flex items-center justify-around px-2 py-3 max-w-screen-xl mx-auto">
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
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all ${isActive ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all ${isActive ? 'scale-110' : ''}`} style={{ backgroundColor: isActive ? `${item.color}20` : theme === 'dark' ? '#374151' : '#f3f4f6', color: isActive ? item.color : theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className={`text-xs font-medium transition-colors ${isActive ? theme === 'dark' ? 'text-white' : 'text-gray-900' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} style={{ color: isActive ? item.color : undefined }}>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveHomeApp(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl`}>
                <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {activeHomeApp === 'tools' && 'My Tools'}
                    {activeHomeApp === 'requests' && 'Message Requests'}
                    {activeHomeApp === 'connections' && 'My Connections'}
                    {activeHomeApp === 'community' && 'Community'}
                    {activeHomeApp === 'familytree' && 'Family Tree'}
                    {activeHomeApp === 'preferences' && 'Content Preferences'}
                    {activeHomeApp === 'village' && 'Change Village or Role'}
                  </h2>
                  <button onClick={() => setActiveHomeApp(null)} className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6">
                  {activeHomeApp === 'tools' && <ToolsSection tools={tools} villageColor={villageColor} onToolClick={(toolId) => console.log('Tool clicked:', toolId)} />}
                  {activeHomeApp === 'requests' && <RequestsSection />}
                  {activeHomeApp === 'connections' && <ConnectionsSection />}
                  {activeHomeApp === 'community' && <CommunitySection />}
                  {activeHomeApp === 'familytree' && <FamilyTreeSection />}
                  {activeHomeApp === 'preferences' && <ContentPreferencesSection />}
                  {activeHomeApp === 'village' && <VillageChangeSection onOpenVillageSelector={handleOpenVillageSelector} />}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      {/* Notification Center */}
      <NotificationCenter isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
      
      {/* Village Selector */}
      <VillageSelector isOpen={isVillageSelectorOpen} onClose={() => setIsVillageSelectorOpen(false)} onSelectVillage={handleSelectVillage} />
      
      {/* Role Change Request */}
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
      
      {/* Protection Mode Overlay */}
      {protectionMode?.active && (
        <ProtectionModeScreen protectionMode={protectionMode} onRequestCircle={handleRequestCircle} onContactSupport={handleContactSupport} />
      )}
    </div>
  );
};

export default DashboardHome;
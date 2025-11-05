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
  AlertTriangle,
  // Bottom Nav Icons
  Share2,
  Building2,
  Bot,
  Compass,
} from 'lucide-react';
import { GuardianDashboard } from './GuardianDashboard';
import * as Icons from 'lucide-react';
import { useAppSelector } from '@store/hooks';

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

// Import existing components
import { FeedTimeline } from '@components/feed/FeedTimeline';
import { ProfileCard } from './ProfileCard';
import { AfroIDSection } from './AfroIDSection';

// Import new components
import { SettingsPanel } from '@components/settings/SettingsPanel';
import { NotificationCenter } from '@components/notifications/NotificationCenter';
import { EmergencyContactsManager } from '@components/security/EmergencyContactsManager';
import { LocationTruthPanel } from '@components/dashboard/LocationTruthPanel';
import { TwinPresenceToggle } from '@components/dashboard/TwinPresenceToggle';
import { ProtectionModeScreen } from '@components/security/ProtectionModeScreen';

// Import Home sections
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
  
  // Panel states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // Village selector states
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
  
  // Twin Presence state
  const [presenceMode, setPresenceMode] = useState<'spirit' | 'flesh'>('spirit');
  
  // Protection Mode state - WITH SETTER
  const [protectionMode, setProtectionMode] = useState<ProtectionMode | null>(null);
  
  // Emergency Contacts state
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

  // Mock data for security features
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

  // Security handlers
  const handlePresenceToggle = (mode: 'spirit' | 'flesh') => {
    setPresenceMode(mode);
    console.log('Switched to:', mode);
  };

  const handleAddContact = (contact: Omit<EmergencyContact, 'afro_id'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      afro_id: `TEMP-${Date.now()}`,
    };
    setEmergencyContacts([...emergencyContacts, newContact]);
    console.log('Adding contact:', newContact);
  };

  const handleRemoveContact = (afroId: string) => {
    setEmergencyContacts(emergencyContacts.filter(c => c.afro_id !== afroId));
    console.log('Removing contact:', afroId);
  };

  const handleUpdateContact = (afroId: string, contact: Omit<EmergencyContact, 'afro_id'>) => {
    setEmergencyContacts(emergencyContacts.map(c => 
      c.afro_id === afroId ? { ...contact, afro_id: afroId } : c
    ));
    console.log('Updating contact:', afroId, contact);
  };

  const handleRequestCircle = () => {
    console.log('Requesting circle verification...');
  };

  const handleContactSupport = () => {
    console.log('Contacting support...');
  };

  // Village change handlers
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
    // TODO: API call
  };

  // Demo: Trigger Protection Mode
  const triggerProtectionMode = () => {
    setProtectionMode({
      active: true,
      triggered_at: new Date(),
      reason: 'face_mismatch',
      restrictions: ['wallet_transfer', 'live_stream', 'whisper_strangers'],
    });
  };

  // Bottom navigation items
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

          {/* Header Actions - Only Search & Notification */}
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

                {/* Settings Button in Mobile Menu */}
                <button
                  onClick={() => { setIsSettingsOpen(true); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>

                {/* Logout in Mobile Menu */}
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
            {/* User Profile Mini Card */}
            <div className={`p-4 rounded-xl mb-6 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    <User className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                  </div>
                  {/* Twin Presence indicator */}
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

            {/* Settings Button (Desktop) */}
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

            {/* Logout */}
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
              {/* HOME VIEW - Only show 7 sections when on Home tab */}
              {activeView === 'home' && activeBottomTab === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Welcome Banner - Mobile Optimized */}
                  <div 
                    className="p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl text-white relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${villageColor} 0%, ${villageColor}dd 100%)` }}
                  >
                    <div className="relative z-10">
                      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">
                        Welcome back, {displayName}! 👋
                      </h2>
                      <p className="text-white/90 text-xs sm:text-sm md:text-base">
                        Ready to connect with the Motherland today
                      </p>
                    </div>
                    <div className="absolute right-0 top-0 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 opacity-10">
                      <RoleIcon className="w-full h-full" />
                    </div>
                  </div>

                  {/* ✅ Demo Protection Mode Trigger Button */}
                  <button
                    onClick={triggerProtectionMode}
                    className={`w-full sm:w-auto px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                      theme === 'dark' 
                        ? 'bg-amber-900/20 text-amber-400 hover:bg-amber-900/30 border border-amber-500/30' 
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Demo: Trigger Protection Mode
                  </button>

                  {/* Main Grid - Mobile: 1 column, Tablet: 1-2 columns, Desktop: 2 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Tools Section */}
                    <ToolsSection 
                      tools={tools} 
                      villageColor={villageColor}
                      onToolClick={(toolId) => console.log('Tool clicked:', toolId)}
                    />

                    {/* Requests Section */}
                    <RequestsSection />

                    {/* Connections Section */}
                    <ConnectionsSection />

                    {/* Community Section */}
                    <CommunitySection />

                    {/* Family Tree Section */}
                    <FamilyTreeSection />

                    {/* Content Preferences - Full Width on all screens */}
                    <div className="md:col-span-2">
                      <ContentPreferencesSection />
                    </div>

                    {/* Village Change Section - Full Width on all screens */}
                    <div className="md:col-span-2">
                      <VillageChangeSection onOpenVillageSelector={handleOpenVillageSelector} />
                    </div>
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
                  <FeedTimeline />
                </motion.div>
              )}

              {/* DISCOVER VIEW */}
              {activeView === 'home' && activeBottomTab === 'discover' && (
                <motion.div
                  key="discover"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-12 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <Compass className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Discover
                  </h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Explore villages, find professionals, discover content
                  </p>
                </motion.div>
              )}

              {/* BANKING VIEW */}
              {activeView === 'home' && activeBottomTab === 'banking' && (
                <motion.div
                  key="banking"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-12 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <Building2 className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Cowrie Banking
                  </h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Send, receive, and manage your Cowries (Wari tokens)
                  </p>
                </motion.div>
              )}

              {/* AI AGENT VIEW */}
              {activeView === 'home' && activeBottomTab === 'ai' && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`p-12 rounded-2xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <Bot className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    AI Agent
                  </h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Your intelligent assistant for professional guidance
                  </p>
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

                  <ProfileCard
                    viewType="self"
                    onEditProfile={() => console.log('Edit profile')}
                  />
                  
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
                </motion.div>
              )}

              {/* Security View */}
              {activeView === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                      <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Security Dashboard
                      </h2>
                      <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Your protection and trusted circle
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GuardianDashboard
                      shield={{
                        afro_id: user?.afro_id || '',
                        overall_state: 'calm',
                        last_updated: new Date(),
                        guardians: {
                          voice_spirit: {
                            status: 'ok',
                            last_check: new Date(),
                            message: 'Voice pattern recognized',
                            voiceprint_match_score: 92,
                          },
                          drum_binding: {
                            status: 'ok',
                            last_check: new Date(),
                            message: 'Device blessed and recognized',
                            registered_devices: 2,
                            current_device_blessed: true,
                          },
                          footsteps: {
                            status: 'ok',
                            last_check: new Date(),
                            message: 'Behavior pattern normal',
                            anomaly_score: 5,
                          },
                          cultural_memory: {
                            status: 'ok',
                            last_check: new Date(),
                            message: 'Identity consistent',
                            consistency_score: 95,
                          },
                        },
                        recommended_restrictions: [],
                        requires_clan_blessing: false,
                      }}
                      showDetails={true}
                    />

                    <LocationTruthPanel locationTruth={locationTruth} isOwner={true} />

                    <div className="lg:col-span-2">
                      <EmergencyContactsManager
                        contacts={emergencyContacts}
                        maxContacts={5}
                        onAdd={handleAddContact}
                        onRemove={handleRemoveContact}
                        onUpdate={handleUpdateContact}
                      />
                    </div>
                  </div>
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
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'scale-105'
                    : 'opacity-70 hover:opacity-100'
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

      {/* Settings Panel */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Notification Center */}
      <NotificationCenter isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />

      {/* Village Selector */}
      <VillageSelector
        isOpen={isVillageSelectorOpen}
        onClose={() => setIsVillageSelectorOpen(false)}
        onSelectVillage={handleSelectVillage}
      />

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

      {/* ✅ Protection Mode Overlay - RESTORED */}
      {protectionMode?.active && (
        <ProtectionModeScreen
          protectionMode={protectionMode}
          onRequestCircle={handleRequestCircle}
          onContactSupport={handleContactSupport}
        />
      )}
    </div>
  );
};

export default DashboardHome;
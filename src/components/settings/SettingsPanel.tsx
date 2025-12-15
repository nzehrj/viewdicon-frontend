import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Bell,
  Lock,
  Shield,
  Globe,
  User,
  Smartphone,
  Eye,
  EyeOff,
  ChevronRight,
  X,
  Fingerprint,
  Copy,
  Check,
  Phone,
  Calendar,
  MapPin,
  Camera,
  Save,
  AlertCircle,
  CheckCircle,
  Trash2,
  CreditCard,
  Award,
  RefreshCw,
} from 'lucide-react';

import { useAppSelector, useAppDispatch } from '@store/hooks';
import { toggleTheme } from '@store/slices/themeSlice';
import { Button } from '@components/common/Button';
import { AfroIDCard } from '@components/profile/AfroIDCard';
import { CrestProgress } from '@components/profile/CrestProgress';
import { VillageChangeSection } from '@components/home/VillageChangeSection'; 

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVillageSelector?: () => void;
}

type SettingsTab = 'general' | 'profile' | 'privacy' | 'notifications' | 'account' | 'crest' | 'village';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, onOpenVillageSelector }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  const phoneNumber = useAppSelector((state) => state.auth.phoneNumber);

  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showAfroIDCard, setShowAfroIDCard] = useState(false);

  // Profile Settings States
  const [copiedAfroId, setCopiedAfroId] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.full_name || user?.name || '',
    phone: phoneNumber || user?.phoneNumber || '',
    dateOfBirth: '',
    gender: 'male',
    bio: '',
    location: { country: 'Nigeria', city: 'Lagos' },
    website: '',
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public' as 'public' | 'connections' | 'private',
    afroIdVisibility: 'private' as 'public' | 'connections' | 'private',
    phoneVisibility: 'connections' as 'public' | 'connections' | 'private',
    locationVisibility: 'public' as 'public' | 'connections' | 'private',
    allowMessages: 'everyone' as 'everyone' | 'connections' | 'none',
    showInSearch: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    connectionRequests: true,
    messages: true,
    comments: true,
    likes: false,
    achievements: true,
    systemUpdates: true,
  });

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleCopyAfroId = async () => {
    try {
      await navigator.clipboard.writeText(user?.afro_id || '');
      setCopiedAfroId(true);
      setTimeout(() => setCopiedAfroId(false), 2000);
    } catch (err) {
      console.error('Failed to copy Afro-ID:', err);
    }
  };

  const handleProfileChange = (field: string, value: any) => {
    setProfileData({ ...profileData, [field]: value });
    setHasChanges(true);
  };

  const handleLocationChange = (field: 'country' | 'city', value: string) => {
    setProfileData({
      ...profileData,
      location: { ...profileData.location, [field]: value }
    });
    setHasChanges(true);
  };

  const handlePrivacyChange = (field: string, value: any) => {
    setPrivacySettings({ ...privacySettings, [field]: value });
    setHasChanges(true);
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings({ ...notificationSettings, [field]: value });
    setHasChanges(true);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Profile updated:', profileData);
    setIsSaving(false);
    setHasChanges(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
  { id: 'general' as SettingsTab, label: 'General', icon: SettingsIcon },
  { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
  { id: 'privacy' as SettingsTab, label: 'Privacy', icon: Lock },
  { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
  { id: 'account' as SettingsTab, label: 'Account', icon: Shield },
  { id: 'crest' as SettingsTab, label: 'Crest', icon: Award },
  { id: 'village' as SettingsTab, label: 'Village', icon: RefreshCw }, 
];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed right-0 top-0 bottom-0 w-full sm:w-[500px] md:w-[600px] z-50 ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            } shadow-2xl flex flex-col`}
          >
            {/* Header */}
            <div className={`flex-shrink-0 p-4 sm:p-6 border-b ${
              theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl sm:text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Settings
                </h2>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-100 text-gray-900'
                          : theme === 'dark'
                          ? 'text-gray-400 hover:bg-gray-800'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <AnimatePresence mode="wait">
                {/* GENERAL TAB */}
                {activeTab === 'general' && (
                  <motion.div
                    key="general"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Theme Toggle */}
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        APPEARANCE
                      </h3>
                      
                      <div className={`p-4 rounded-xl border ${
                        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {theme === 'dark' ? (
                              <Moon className="w-5 h-5 text-purple-400" />
                            ) : (
                              <Sun className="w-5 h-5 text-yellow-500" />
                            )}
                            <div>
                              <p className={`font-semibold text-sm ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                              </p>
                              <p className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {theme === 'dark' ? 'Easy on the eyes' : 'Bright and clear'}
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={handleToggleTheme}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              theme === 'dark' ? 'bg-purple-600' : 'bg-gray-300'
                            }`}
                          >
                            <motion.div
                              layout
                              className="absolute top-1 w-4 h-4 bg-white rounded-full"
                              animate={{
                                x: theme === 'dark' ? 28 : 4,
                              }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Language */}
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        LANGUAGE & REGION
                      </h3>
                      
                      <button className={`w-full p-4 rounded-xl border flex items-center justify-between ${
                        theme === 'dark' 
                          ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}>
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5" />
                          <div className="text-left">
                            <p className={`font-semibold text-sm ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              Language
                            </p>
                            <p className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              English (US)
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Avatar Upload */}
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        PROFILE PHOTO
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                        }`}>
                          <User className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                        </div>
                        <button
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors"
                        >
                          <Camera className="w-4 h-4" />
                          Upload Photo
                        </button>
                      </div>
                    </div>

                    {/* Afro-ID Card */}
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        YOUR AFRO-ID
                      </h3>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Fingerprint className="w-5 h-5" />
                            <span className="text-sm font-semibold">Afro-ID</span>
                          </div>
                          <button
                            onClick={handleCopyAfroId}
                            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                          >
                            {copiedAfroId ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-base sm:text-lg font-mono font-bold mb-3 break-all">
                          {user?.afro_id || 'AFR-NG-G1-2024-XXXX'}
                        </p>
                        
                        
                        <button
                          onClick={() => setShowAfroIDCard(true)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-3 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span className="text-sm font-semibold">View Full ID Card</span>
                        </button>
                        
                        <div className="flex items-start gap-2 p-2 rounded-lg bg-white/10">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <p className="text-xs">
                            Keep your Afro-ID private. It's your unique identity in the Digital Motherland.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        BASIC INFORMATION
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => handleProfileChange('name', e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          />
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Phone Number
                          </label>
                          <div className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => handleProfileChange('phone', e.target.value)}
                              className={`flex-1 px-4 py-2 rounded-lg border ${
                                theme === 'dark'
                                  ? 'bg-gray-800 border-gray-700 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Date of Birth
                          </label>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <input
                              type="date"
                              value={profileData.dateOfBirth}
                              onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                              className={`flex-1 px-4 py-2 rounded-lg border ${
                                theme === 'dark'
                                  ? 'bg-gray-800 border-gray-700 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Gender
                          </label>
                          <select
                            value={profileData.gender}
                            onChange={(e) => handleProfileChange('gender', e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="non-binary">Non-binary</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                          </select>
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Bio
                          </label>
                          <textarea
                            value={profileData.bio}
                            onChange={(e) => handleProfileChange('bio', e.target.value)}
                            rows={3}
                            className={`w-full px-4 py-2 rounded-lg border ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        LOCATION
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Country
                          </label>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={profileData.location.country}
                              onChange={(e) => handleLocationChange('country', e.target.value)}
                              className={`flex-1 px-4 py-2 rounded-lg border ${
                                theme === 'dark'
                                  ? 'bg-gray-800 border-gray-700 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className={`block text-sm font-medium mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            City
                          </label>
                          <input
                            type="text"
                            value={profileData.location.city}
                            onChange={(e) => handleLocationChange('city', e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PRIVACY TAB */}
                {activeTab === 'privacy' && (
                  <motion.div
                    key="privacy"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Profile Privacy */}
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        VISIBILITY
                      </h3>
                      
                      <div className="space-y-3">
                        {/* Profile Visibility */}
                        <div className={`p-4 rounded-xl border ${
                          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center gap-3 mb-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <span className={`font-semibold text-sm ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              Profile Visibility
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {['public', 'connections', 'private'].map((visibility) => (
                              <button
                                key={visibility}
                                onClick={() => handlePrivacyChange('profileVisibility', visibility)}
                                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                  privacySettings.profileVisibility === visibility
                                    ? 'bg-purple-600 text-white'
                                    : theme === 'dark'
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Afro-ID Visibility */}
                        <div className={`p-4 rounded-xl border ${
                          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center gap-3 mb-3">
                            <Fingerprint className="w-5 h-5 text-gray-400" />
                            <span className={`font-semibold text-sm ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              Afro-ID Visibility
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {['public', 'connections', 'private'].map((visibility) => (
                              <button
                                key={visibility}
                                onClick={() => handlePrivacyChange('afroIdVisibility', visibility)}
                                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                  privacySettings.afroIdVisibility === visibility
                                    ? 'bg-purple-600 text-white'
                                    : theme === 'dark'
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Show Online Status */}
                        <div className={`p-4 rounded-xl border ${
                          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Shield className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className={`font-semibold text-sm ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  Show Online Status
                                </p>
                                <p className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  Let others see when you're active
                                </p>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => setShowOnlineStatus(!showOnlineStatus)}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                showOnlineStatus ? 'bg-green-600' : 'bg-gray-300'
                              }`}
                            >
                              <motion.div
                                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                                animate={{
                                  x: showOnlineStatus ? 28 : 4,
                                }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              />
                            </button>
                          </div>
                        </div>

                        {/* Private Profile */}
                        <div className={`p-4 rounded-xl border ${
                          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              {privateProfile ? (
                                <EyeOff className="w-5 h-5 text-gray-400" />
                              ) : (
                                <Eye className="w-5 h-5 text-gray-400" />
                              )}
                              <div>
                                <p className={`font-semibold text-sm ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  Private Profile
                                </p>
                                <p className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  Only approved connections can see your profile
                                </p>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => setPrivateProfile(!privateProfile)}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                privateProfile ? 'bg-green-600' : 'bg-gray-300'
                              }`}
                            >
                              <motion.div
                                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                                animate={{
                                  x: privateProfile ? 28 : 4,
                                }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        PUSH NOTIFICATIONS
                      </h3>
                      
                      <div className="space-y-3">
                        <div className={`p-4 rounded-xl border ${
                          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Bell className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className={`font-semibold text-sm ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  Push Notifications
                                </p>
                                <p className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  Get notified about activity
                                </p>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                notificationsEnabled ? 'bg-green-600' : 'bg-gray-300'
                              }`}
                            >
                              <motion.div
                                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                                animate={{
                                  x: notificationsEnabled ? 28 : 4,
                                }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              />
                            </button>
                          </div>
                        </div>

                        <div className={`p-4 rounded-xl border ${
                          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Smartphone className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className={`font-semibold text-sm ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  SMS Notifications
                                </p>
                                <p className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  Receive updates via SMS
                                </p>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => setSmsNotifications(!smsNotifications)}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                smsNotifications ? 'bg-green-600' : 'bg-gray-300'
                              }`}
                            >
                              <motion.div
                                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                                animate={{
                                  x: smsNotifications ? 28 : 4,
                                }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        ACTIVITY NOTIFICATIONS
                      </h3>
                      <div className="space-y-3">
                        {[
                          { key: 'connectionRequests', label: 'Connection Requests' },
                          { key: 'messages', label: 'Messages' },
                          { key: 'comments', label: 'Comments' },
                          { key: 'likes', label: 'Likes' },
                          { key: 'achievements', label: 'Achievements' },
                          { key: 'systemUpdates', label: 'System Updates' },
                        ].map((item) => (
                          <div key={item.key} className={`p-4 rounded-xl border ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className={`font-semibold text-sm ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {item.label}
                              </span>
                              <button
                                onClick={() => handleNotificationChange(item.key, !notificationSettings[item.key as keyof typeof notificationSettings])}
                                className={`relative w-12 h-6 rounded-full transition-colors ${
                                  notificationSettings[item.key as keyof typeof notificationSettings] ? 'bg-green-600' : 'bg-gray-300'
                                }`}
                              >
                                <motion.div
                                  className="absolute top-1 w-4 h-4 bg-white rounded-full"
                                  animate={{
                                    x: notificationSettings[item.key as keyof typeof notificationSettings] ? 28 : 4,
                                  }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ACCOUNT TAB */}
                {activeTab === 'account' && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        ACCOUNT INFORMATION
                      </h3>
                      
                      <div className="space-y-3">
                        <div className={`p-4 rounded-xl border ${
                          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                Phone Number
                              </p>
                              <p className={`font-semibold text-sm ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {phoneNumber || user?.phoneNumber || 'Not set'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className={`p-4 rounded-xl border ${
                          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                Afro ID
                              </p>
                              <p className={`font-semibold text-sm font-mono ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {user?.afro_id || 'Not assigned'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Security Actions */}
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        SECURITY
                      </h3>
                      <button
                        onClick={() => alert('Change password flow - implement OTP verification')}
                        className={`w-full p-4 rounded-xl border flex items-center justify-between ${
                          theme === 'dark' 
                            ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5 text-gray-400" />
                          <div className="text-left">
                            <p className={`font-semibold text-sm ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              Change Password
                            </p>
                            <p className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Update your password regularly
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    {/* Danger Zone */}
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 text-red-500`}>
                        DANGER ZONE
                      </h3>
                      
                      <Button
                        variant="outline"
                        fullWidth
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                            console.log('Delete account flow');
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'crest' && (
                  <motion.div
                    key="crest"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <CrestProgress showHistory={true} />
                  </motion.div>
                )}

                {activeTab === 'village' && (
                  <motion.div
                    key="village"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <VillageChangeSection 
                      onOpenVillageSelector={() => {
                        if (onOpenVillageSelector) {
                          onOpenVillageSelector();
                          onClose(); // Close settings panel when opening village selector
                        }
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Save Button */}
            <AnimatePresence>
              {hasChanges && (
                <motion.div
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  exit={{ y: 100 }}
                  className={`flex-shrink-0 p-4 sm:p-6 border-t ${
                    theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                  }`}
                >
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-semibold transition-colors"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg flex items-center gap-2 z-10"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium text-sm">Changes saved successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showAfroIDCard && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowAfroIDCard(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
                  />
                  
                  {/* Modal */}
                  <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="w-full max-w-md pointer-events-auto"
                    >
                      <AfroIDCard 
                        showActions={true}
                        onClose={() => setShowAfroIDCard(false)}
                      />
                    </motion.div>
                  </div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
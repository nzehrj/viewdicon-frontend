import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Lock,
  Bell,
  Settings as SettingsIcon,
  Shield,
  Fingerprint,
  Copy,
  Check,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Globe,
  Camera,
  Save,
  AlertCircle,
  CheckCircle,
  Trash2,
  Smartphone,
  ChevronRight,
} from 'lucide-react';

// ✅ Using correct types from user's codebase
type Theme = 'light' | 'dark'; // NOT 'system'

interface ProfileData {
  name: string;
  afroId: string;  // NOT email
  phone: string;
  dateOfBirth: string;
  gender: string;
  bio: string;
  location: {
    country: string;
    city: string;
  };
  village: string;
  profession: string;
  skills: string[];
  website?: string;
  avatar?: string;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'connections' | 'private';
  afroIdVisibility: 'public' | 'connections' | 'private';
  phoneVisibility: 'public' | 'connections' | 'private';
  locationVisibility: 'public' | 'connections' | 'private';
  showOnlineStatus: boolean;
  allowMessages: 'everyone' | 'connections' | 'none';
  showInSearch: boolean;
}

interface NotificationSettings {
  pushNotifications: boolean;
  smsNotifications: boolean;  // NOT email
  connectionRequests: boolean;
  messages: boolean;
  comments: boolean;
  likes: boolean;
  achievements: boolean;
  systemUpdates: boolean;
}

interface AppPreferences {
  theme: Theme;
  language: string;
  soundEnabled: boolean;
  autoPlayVideos: boolean;
  dataUsageMode: 'low' | 'normal' | 'high';
}

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  privacy: PrivacySettings;
  notifications: NotificationSettings;
  preferences: AppPreferences;
  onUpdateProfile?: (profile: ProfileData) => void;
  onUpdatePrivacy?: (privacy: PrivacySettings) => void;
  onUpdateNotifications?: (notifications: NotificationSettings) => void;
  onUpdatePreferences?: (preferences: AppPreferences) => void;
  onChangePassword?: () => void;
  onDeleteAccount?: () => void;
  villages?: string[];
  theme?: Theme;
}

type SettingsTab = 'profile' | 'privacy' | 'notifications' | 'preferences' | 'security';

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  isOpen,
  onClose,
  profile: initialProfile,
  privacy: initialPrivacy,
  notifications: initialNotifications,
  preferences: initialPreferences,
  onUpdateProfile,
  onUpdatePrivacy,
  onUpdateNotifications,
  onUpdatePreferences,
  onChangePassword,
  onDeleteAccount,
  villages = [],
  theme = 'dark',
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [profile, setProfile] = useState(initialProfile);
  const [privacy, setPrivacy] = useState(initialPrivacy);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedAfroId, setCopiedAfroId] = useState(false);

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
    { id: 'privacy' as SettingsTab, label: 'Privacy', icon: Lock },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'preferences' as SettingsTab, label: 'Preferences', icon: SettingsIcon },
    { id: 'security' as SettingsTab, label: 'Security', icon: Shield },
  ];

  const handleProfileChange = (field: keyof ProfileData, value: any) => {
    setProfile({ ...profile, [field]: value });
    setHasChanges(true);
  };

  const handleLocationChange = (field: 'country' | 'city', value: string) => {
    setProfile({
      ...profile,
      location: { ...profile.location, [field]: value }
    });
    setHasChanges(true);
  };

  const handlePrivacyChange = (field: keyof PrivacySettings, value: any) => {
    setPrivacy({ ...privacy, [field]: value });
    setHasChanges(true);
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotifications({ ...notifications, [field]: value });
    setHasChanges(true);
  };

  const handlePreferenceChange = (field: keyof AppPreferences, value: any) => {
    setPreferences({ ...preferences, [field]: value });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (activeTab === 'profile' && onUpdateProfile) {
      onUpdateProfile(profile);
    } else if (activeTab === 'privacy' && onUpdatePrivacy) {
      onUpdatePrivacy(privacy);
    } else if (activeTab === 'notifications' && onUpdateNotifications) {
      onUpdateNotifications(notifications);
    } else if (activeTab === 'preferences' && onUpdatePreferences) {
      onUpdatePreferences(preferences);
    }

    setIsSaving(false);
    setHasChanges(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCopyAfroId = async () => {
    try {
      await navigator.clipboard.writeText(profile.afroId);
      setCopiedAfroId(true);
      setTimeout(() => setCopiedAfroId(false), 2000);
    } catch (err) {
      console.error('Failed to copy Afro-ID:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className={`absolute right-0 top-0 bottom-0 w-full sm:w-[600px] z-[70] ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          } shadow-2xl flex flex-col`}
        >
          {/* Header */}
          <div className={`flex-shrink-0 p-6 border-b ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Profile Settings
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
            <div className="flex gap-2 overflow-x-auto pb-2">
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
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
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
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <User className={`w-10 h-10 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                        )}
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
                      <p className="text-lg font-mono font-bold mb-3">{profile.afroId}</p>
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
                          value={profile.name}
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
                            value={profile.phone}
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
                            value={profile.dateOfBirth}
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
                          value={profile.gender}
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
                          value={profile.bio}
                          onChange={(e) => handleProfileChange('bio', e.target.value)}
                          rows={4}
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
                            value={profile.location.country}
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
                          value={profile.location.city}
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

                  {/* Professional Information */}
                  <div>
                    <h3 className={`text-sm font-semibold mb-3 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      PROFESSIONAL INFORMATION
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Village
                        </label>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-gray-400" />
                          <select
                            value={profile.village}
                            onChange={(e) => handleProfileChange('village', e.target.value)}
                            className={`flex-1 px-4 py-2 rounded-lg border ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          >
                            {villages.map((village) => (
                              <option key={village} value={village}>{village}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Profession/Role
                        </label>
                        <input
                          type="text"
                          value={profile.profession}
                          onChange={(e) => handleProfileChange('profession', e.target.value)}
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
                          Website
                        </label>
                        <div className="flex items-center gap-2">
                          <Globe className="w-5 h-5 text-gray-400" />
                          <input
                            type="url"
                            value={profile.website || ''}
                            onChange={(e) => handleProfileChange('website', e.target.value)}
                            placeholder="https://..."
                            className={`flex-1 px-4 py-2 rounded-lg border ${
                              theme === 'dark'
                                ? 'bg-gray-800 border-gray-700 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          />
                        </div>
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
                  <div>
                    <h3 className={`text-sm font-semibold mb-3 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      VISIBILITY
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: 'profileVisibility' as keyof PrivacySettings, label: 'Profile Visibility', icon: User },
                        { key: 'afroIdVisibility' as keyof PrivacySettings, label: 'Afro-ID Visibility', icon: Fingerprint },
                        { key: 'phoneVisibility' as keyof PrivacySettings, label: 'Phone Visibility', icon: Phone },
                        { key: 'locationVisibility' as keyof PrivacySettings, label: 'Location Visibility', icon: MapPin },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.key} className={`p-4 rounded-xl border ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-center gap-3 mb-3">
                              <Icon className="w-5 h-5 text-gray-400" />
                              <span className={`font-semibold text-sm ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {item.label}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {['public', 'connections', 'private'].map((visibility) => (
                                <button
                                  key={visibility}
                                  onClick={() => handlePrivacyChange(item.key, visibility)}
                                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                    privacy[item.key] === visibility
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
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-sm font-semibold mb-3 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      ACTIVITY
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: 'showOnlineStatus' as keyof PrivacySettings, label: 'Show Online Status', desc: 'Let others see when you\'re active' },
                        { key: 'showInSearch' as keyof PrivacySettings, label: 'Show in Search', desc: 'Allow others to find you in search results' },
                      ].map((item) => (
                        <div key={item.key} className={`p-4 rounded-xl border ${
                          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className={`font-semibold text-sm ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {item.label}
                              </p>
                              <p className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {item.desc}
                              </p>
                            </div>
                            <button
                              onClick={() => handlePrivacyChange(item.key, !privacy[item.key])}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                privacy[item.key] ? 'bg-green-600' : 'bg-gray-300'
                              }`}
                            >
                              <motion.div
                                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                                animate={{
                                  x: privacy[item.key] ? 28 : 4,
                                }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-sm font-semibold mb-3 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      MESSAGES
                    </h3>
                    <div className={`p-4 rounded-xl border ${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <p className={`font-semibold text-sm mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Who can message you?
                      </p>
                      <div className="flex gap-2">
                        {['everyone', 'connections', 'none'].map((option) => (
                          <button
                            key={option}
                            onClick={() => handlePrivacyChange('allowMessages', option)}
                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              privacy.allowMessages === option
                                ? 'bg-purple-600 text-white'
                                : theme === 'dark'
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </button>
                        ))}
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
                      {[
                        { key: 'pushNotifications' as keyof NotificationSettings, label: 'Push Notifications', desc: 'Get notified about activity', icon: Bell },
                        { key: 'smsNotifications' as keyof NotificationSettings, label: 'SMS Notifications', desc: 'Receive updates via SMS', icon: Smartphone },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.key} className={`p-4 rounded-xl border ${
                            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <Icon className="w-5 h-5 text-gray-400" />
                                <div>
                                  <p className={`font-semibold text-sm ${
                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {item.label}
                                  </p>
                                  <p className={`text-xs ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    {item.desc}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleNotificationChange(item.key, !notifications[item.key])}
                                className={`relative w-12 h-6 rounded-full transition-colors ${
                                  notifications[item.key] ? 'bg-green-600' : 'bg-gray-300'
                                }`}
                              >
                                <motion.div
                                  className="absolute top-1 w-4 h-4 bg-white rounded-full"
                                  animate={{
                                    x: notifications[item.key] ? 28 : 4,
                                  }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                              </button>
                            </div>
                          </div>
                        );
                      })}
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
                        { key: 'connectionRequests' as keyof NotificationSettings, label: 'Connection Requests' },
                        { key: 'messages' as keyof NotificationSettings, label: 'Messages' },
                        { key: 'comments' as keyof NotificationSettings, label: 'Comments' },
                        { key: 'likes' as keyof NotificationSettings, label: 'Likes' },
                        { key: 'achievements' as keyof NotificationSettings, label: 'Achievements' },
                        { key: 'systemUpdates' as keyof NotificationSettings, label: 'System Updates' },
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
                              onClick={() => handleNotificationChange(item.key, !notifications[item.key])}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                notifications[item.key] ? 'bg-green-600' : 'bg-gray-300'
                              }`}
                            >
                              <motion.div
                                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                                animate={{
                                  x: notifications[item.key] ? 28 : 4,
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

              {/* PREFERENCES TAB */}
              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className={`text-sm font-semibold mb-3 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      APPEARANCE
                    </h3>
                    <div className={`p-4 rounded-xl border ${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <p className={`font-semibold text-sm mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Theme
                      </p>
                      <div className="flex gap-2">
                        {['light', 'dark'].map((themeOption) => (
                          <button
                            key={themeOption}
                            onClick={() => handlePreferenceChange('theme', themeOption as Theme)}
                            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                              preferences.theme === themeOption
                                ? 'bg-purple-600 text-white'
                                : theme === 'dark'
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-sm font-semibold mb-3 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      LANGUAGE
                    </h3>
                    <select
                      value={preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-800 border-gray-700 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    >
                      <option value="en">English</option>
                      <option value="sw">Swahili</option>
                      <option value="yo">Yoruba</option>
                      <option value="ig">Igbo</option>
                      <option value="ha">Hausa</option>
                      <option value="am">Amharic</option>
                      <option value="zu">Zulu</option>
                    </select>
                  </div>

                  <div>
                    <h3 className={`text-sm font-semibold mb-3 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      MEDIA
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: 'soundEnabled' as keyof AppPreferences, label: 'Sound Effects', desc: 'Play sounds for interactions' },
                        { key: 'autoPlayVideos' as keyof AppPreferences, label: 'Auto-play Videos', desc: 'Videos play automatically in feed' },
                      ].map((item) => (
                        <div key={item.key} className={`p-4 rounded-xl border ${
                          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`font-semibold text-sm ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {item.label}
                              </p>
                              <p className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {item.desc}
                              </p>
                            </div>
                            <button
                              onClick={() => handlePreferenceChange(item.key, !preferences[item.key])}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                preferences[item.key] ? 'bg-green-600' : 'bg-gray-300'
                              }`}
                            >
                              <motion.div
                                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                                animate={{
                                  x: preferences[item.key] ? 28 : 4,
                                }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-sm font-semibold mb-3 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      DATA USAGE
                    </h3>
                    <div className={`p-4 rounded-xl border ${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <p className={`font-semibold text-sm mb-3 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Data Usage Mode
                      </p>
                      <div className="flex gap-2">
                        {['low', 'normal', 'high'].map((mode) => (
                          <button
                            key={mode}
                            onClick={() => handlePreferenceChange('dataUsageMode', mode)}
                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                              preferences.dataUsageMode === mode
                                ? 'bg-purple-600 text-white'
                                : theme === 'dark'
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className={`text-sm font-semibold mb-3 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      AUTHENTICATION
                    </h3>
                    <button
                      onClick={onChangePassword}
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
                            Update your password regularly for security
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div>
                    <h3 className={`text-sm font-semibold mb-3 text-red-500`}>
                      DANGER ZONE
                    </h3>
                    <button
                      onClick={onDeleteAccount}
                      className={`w-full p-4 rounded-xl border border-red-500 flex items-center justify-between ${
                        theme === 'dark' 
                          ? 'bg-red-900/20 hover:bg-red-900/30' 
                          : 'bg-red-50 hover:bg-red-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Trash2 className="w-5 h-5 text-red-500" />
                        <div className="text-left">
                          <p className="font-semibold text-sm text-red-500">
                            Delete Account
                          </p>
                          <p className={`text-xs ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Permanently delete your account and all data
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
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
                className={`flex-shrink-0 p-6 border-t ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}
              >
                <button
                  onClick={handleSave}
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
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Changes saved successfully!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileSettings;
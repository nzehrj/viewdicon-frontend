import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User,
  Mail,
  Phone,
  //MapPin,
  //Briefcase,
  //Calendar,
  Globe,
  Lock,
  Bell,
  Eye,
  Shield,
  Trash2,
  Camera,
  Save,
  //X,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  //Edit2,
  //Languages,
  Moon,
  Sun,
  Volume2,
  Smartphone
} from 'lucide-react';

// Types
type PrivacyLevel = 'public' | 'connections' | 'private';
type Theme = 'light' | 'dark' | 'system';
type Language = 'en' | 'yo' | 'ig' | 'ha' | 'sw' | 'am' | 'zu';

interface ProfileData {
  name: string;
  email: string;
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
  profileVisibility: PrivacyLevel;
  emailVisibility: PrivacyLevel;
  phoneVisibility: PrivacyLevel;
  locationVisibility: PrivacyLevel;
  showOnlineStatus: boolean;
  allowMessages: 'everyone' | 'connections' | 'none';
  showInSearch: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  connectionRequests: boolean;
  messages: boolean;
  comments: boolean;
  likes: boolean;
  achievements: boolean;
  systemUpdates: boolean;
}

interface AppPreferences {
  theme: Theme;
  language: Language;
  soundEnabled: boolean;
  autoPlayVideos: boolean;
  dataUsageMode: 'normal' | 'low';
}

interface ProfileSettingsProps {
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
}

type SettingsTab = 'profile' | 'privacy' | 'notifications' | 'preferences' | 'security';

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
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
  villages = []
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [privacy, setPrivacy] = useState<PrivacySettings>(initialPrivacy);
  const [notifications, setNotifications] = useState<NotificationSettings>(initialNotifications);
  const [preferences, setPreferences] = useState<AppPreferences>(initialPreferences);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (activeTab === 'profile') {
      onUpdateProfile?.(profile);
    } else if (activeTab === 'privacy') {
      onUpdatePrivacy?.(privacy);
    } else if (activeTab === 'notifications') {
      onUpdateNotifications?.(notifications);
    } else if (activeTab === 'preferences') {
      onUpdatePreferences?.(preferences);
    }

    setIsSaving(false);
    setHasChanges(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
    { id: 'privacy' as SettingsTab, label: 'Privacy', icon: Eye },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'preferences' as SettingsTab, label: 'Preferences', icon: Globe },
    { id: 'security' as SettingsTab, label: 'Security', icon: Shield }
  ];

  const languages = [
    { code: 'en' as Language, name: 'English' },
    { code: 'yo' as Language, name: 'Yoruba' },
    { code: 'ig' as Language, name: 'Igbo' },
    { code: 'ha' as Language, name: 'Hausa' },
    { code: 'sw' as Language, name: 'Swahili' },
    { code: 'am' as Language, name: 'Amharic' },
    { code: 'zu' as Language, name: 'Zulu' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-indigo-100">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 overflow-x-auto">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[100px] relative flex flex-col items-center gap-1 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeSettingsTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Save Success Message */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-4 mt-4 bg-green-50 border border-green-200 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-900">Settings saved successfully!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Avatar */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Profile Photo</h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="w-10 h-10 text-indigo-600" />
                      </div>
                    )}
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                      Upload Photo
                    </button>
                    <p className="text-xs text-gray-500 mt-2">JPG or PNG. Max size 2MB.</p>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={profile.gender}
                      onChange={(e) => handleProfileChange('gender', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {/* Professional Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Professional Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Village
                  </label>
                  <select
                    value={profile.village}
                    onChange={(e) => handleProfileChange('village', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {villages.map((village) => (
                      <option key={village} value={village}>{village}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profession
                  </label>
                  <input
                    type="text"
                    value={profile.profession}
                    onChange={(e) => handleProfileChange('profession', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={profile.website || ''}
                    onChange={(e) => handleProfileChange('website', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Location</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={profile.location.country}
                      onChange={(e) => handleLocationChange('country', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={profile.location.city}
                      onChange={(e) => handleLocationChange('city', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Profile Visibility</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Who can see your profile?
                  </label>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value as PrivacyLevel)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="public">Everyone</option>
                    <option value="connections">My Connections Only</option>
                    <option value="private">Only Me</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email visibility
                  </label>
                  <select
                    value={privacy.emailVisibility}
                    onChange={(e) => handlePrivacyChange('emailVisibility', e.target.value as PrivacyLevel)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="public">Everyone</option>
                    <option value="connections">My Connections Only</option>
                    <option value="private">Only Me</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number visibility
                  </label>
                  <select
                    value={privacy.phoneVisibility}
                    onChange={(e) => handlePrivacyChange('phoneVisibility', e.target.value as PrivacyLevel)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="public">Everyone</option>
                    <option value="connections">My Connections Only</option>
                    <option value="private">Only Me</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location visibility
                  </label>
                  <select
                    value={privacy.locationVisibility}
                    onChange={(e) => handlePrivacyChange('locationVisibility', e.target.value as PrivacyLevel)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="public">Everyone</option>
                    <option value="connections">My Connections Only</option>
                    <option value="private">Only Me</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Activity & Messaging</h3>

                <label className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700">Show online status</span>
                  <input
                    type="checkbox"
                    checked={privacy.showOnlineStatus}
                    onChange={(e) => handlePrivacyChange('showOnlineStatus', e.target.checked)}
                    className="w-12 h-6 rounded-full appearance-none bg-gray-300 checked:bg-indigo-600 relative transition-colors cursor-pointer"
                  />
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Who can send you messages?
                  </label>
                  <select
                    value={privacy.allowMessages}
                    onChange={(e) => handlePrivacyChange('allowMessages', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="everyone">Everyone</option>
                    <option value="connections">My Connections Only</option>
                    <option value="none">No One</option>
                  </select>
                </div>

                <label className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700">Show in search results</span>
                  <input
                    type="checkbox"
                    checked={privacy.showInSearch}
                    onChange={(e) => handlePrivacyChange('showInSearch', e.target.checked)}
                    className="w-12 h-6 rounded-full appearance-none bg-gray-300 checked:bg-indigo-600 relative transition-colors cursor-pointer"
                  />
                </label>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Notification Channels</h3>

                <label className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Email notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailNotifications}
                    onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
                    className="w-12 h-6 rounded-full appearance-none bg-gray-300 checked:bg-indigo-600 relative transition-colors cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Push notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.pushNotifications}
                    onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                    className="w-12 h-6 rounded-full appearance-none bg-gray-300 checked:bg-indigo-600 relative transition-colors cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">SMS notifications</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.smsNotifications}
                    onChange={(e) => handleNotificationChange('smsNotifications', e.target.checked)}
                    className="w-12 h-6 rounded-full appearance-none bg-gray-300 checked:bg-indigo-600 relative transition-colors cursor-pointer"
                  />
                </label>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Activity Notifications</h3>

                <label className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700">Connection requests</span>
                  <input
                    type="checkbox"
                    checked={notifications.connectionRequests}
                    onChange={(e) => handleNotificationChange('connectionRequests', e.target.checked)}
                    className="w-12 h-6 rounded-full appearance-none bg-gray-300 checked:bg-indigo-600 relative transition-colors cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700">New messages</span>
                  <input
                    type="checkbox"
                    checked={notifications.messages}
                    onChange={(e) => handleNotificationChange('messages', e.target.checked)}
                    className="w-12 h-6 rounded-full appearance-none bg-gray-300 checked:bg-indigo-600 relative transition-colors cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700">Comments on posts</span>
                  <input
                    type="checkbox"
                    checked={notifications.comments}
                    onChange={(e) => handleNotificationChange('comments', e.target.checked)}
                    className="w-12 h-6 rounded-full appearance-none bg-gray-300 checked:bg-indigo-600 relative transition-colors cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700">Likes and reactions</span>
                  <input
                    type="checkbox"
                    checked={notifications.likes}
                    onChange={(e) => handleNotificationChange('likes', e.target.checked)}
                    className="w-12 h-6 rounded-full appearance-none bg-gray-300 checked:bg-indigo-600 relative transition-colors cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700">Achievements and milestones</span>
                  <input
                    type="checkbox"
                    checked={notifications.achievements}
                    onChange={(e) => handleNotificationChange('achievements', e.target.checked)}
                    className="w-12 h-6 rounded-full appearance-none bg-gray-300 checked:bg-indigo-600 relative transition-colors cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700">System updates</span>
                  <input
                    type="checkbox"
                    checked={notifications.systemUpdates}
                    onChange={(e) => handleNotificationChange('systemUpdates', e.target.checked)}
                    className="w-12 h-6 rounded-full appearance-none bg-gray-300 checked:bg-indigo-600 relative transition-colors cursor-pointer"
                  />
                </label>
              </div>
            </motion.div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Appearance</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light' as Theme, label: 'Light', icon: Sun },
                      { value: 'dark' as Theme, label: 'Dark', icon: Moon },
                      { value: 'system' as Theme, label: 'System', icon: Smartphone }
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handlePreferenceChange('theme', option.value)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            preferences.theme === option.value
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-2 ${
                            preferences.theme === option.value ? 'text-indigo-600' : 'text-gray-600'
                          }`} />
                          <p className="text-sm font-medium text-gray-900">{option.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value as Language)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Media & Content</h3>

                <label className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Sound effects</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.soundEnabled}
                    onChange={(e) => handlePreferenceChange('soundEnabled', e.target.checked)}
                    className="w-12 h-6 rounded-full appearance-none bg-gray-300 checked:bg-indigo-600 relative transition-colors cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700">Auto-play videos</span>
                  <input
                    type="checkbox"
                    checked={preferences.autoPlayVideos}
                    onChange={(e) => handlePreferenceChange('autoPlayVideos', e.target.checked)}
                    className="w-12 h-6 rounded-full appearance-none bg-gray-300 checked:bg-indigo-600 relative transition-colors cursor-pointer"
                  />
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data usage mode
                  </label>
                  <select
                    value={preferences.dataUsageMode}
                    onChange={(e) => handlePreferenceChange('dataUsageMode', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="normal">Normal Quality</option>
                    <option value="low">Data Saver Mode</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 mb-4">Account Security</h3>

                <button
                  onClick={onChangePassword}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Change Password</p>
                      <p className="text-sm text-gray-600">Update your password regularly</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">Danger Zone</h3>
                    <p className="text-sm text-red-800">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onDeleteAccount}
                  className="w-full py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Account
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Save Button (Fixed at bottom) */}
      {hasChanges && activeTab !== 'security' && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2 disabled:opacity-50"
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
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
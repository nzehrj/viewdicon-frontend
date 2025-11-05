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
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  ChevronRight,
  X,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { toggleTheme } from '@store/slices/themeSlice';
import { Button } from '@components/common/Button';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'general' | 'privacy' | 'notifications' | 'account';

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);

  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const tabs = [
    { id: 'general' as SettingsTab, label: 'General', icon: SettingsIcon },
    { id: 'privacy' as SettingsTab, label: 'Privacy', icon: Lock },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'account' as SettingsTab, label: 'Account', icon: User },
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
                className={`fixed right-0 top-0 bottom-0 w-full sm:w-96 z-50 ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                } shadow-2xl overflow-y-auto`}
            >
            {/* Header */}
            <div className={`sticky top-0 z-10 p-4 sm:p-6 border-b ${
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
            <div className="p-4 sm:p-6">
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
                        PROFILE
                      </h3>
                      
                      <div className="space-y-3">
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
                              <Mail className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className={`font-semibold text-sm ${
                                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                  Email Notifications
                                </p>
                                <p className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  Receive updates via email
                                </p>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => setEmailNotifications(!emailNotifications)}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                emailNotifications ? 'bg-green-600' : 'bg-gray-300'
                              }`}
                            >
                              <motion.div
                                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                                animate={{
                                  x: emailNotifications ? 28 : 4,
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
                                {user?.phoneNumber || 'Not set'}
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

                    {/* Danger Zone */}
                    <div>
                      <h3 className={`text-sm font-semibold mb-3 text-red-500`}>
                        DANGER ZONE
                      </h3>
                      
                      <Button
                        variant="outline"
                        fullWidth
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        Deactivate Account
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
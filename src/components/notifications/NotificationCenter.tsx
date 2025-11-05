import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageSquare, Shield, X } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import { MessageRequests } from '@components/messaging/MessageRequests';
import { TrustedConnections } from '@components/messaging/TrustedConnections';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

type NotificationTab = 'requests' | 'trusted';

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const messageRequests = useAppSelector((state) => state.user.messageRequests);
  
  const [activeTab, setActiveTab] = useState<NotificationTab>('requests');

  const pendingRequestsCount = messageRequests.filter(r => r.status === 'pending').length;

  const tabs = [
    { 
      id: 'requests' as NotificationTab, 
      label: 'Whisper Requests', 
      icon: MessageSquare,
      count: pendingRequestsCount,
    },
    { 
      id: 'trusted' as NotificationTab, 
      label: 'Trusted Connections', 
      icon: Shield,
      count: 0, // TODO: Get from Redux
    },
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
                <div className="flex items-center gap-3">
                  <Bell className={`w-6 h-6 ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                  <h2 className={`text-xl sm:text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Notifications
                  </h2>
                </div>
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
              <div className="flex gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
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
                      <span className="sm:hidden">
                        {tab.id === 'requests' ? 'Requests' : 'Trusted'}
                      </span>
                      
                      {tab.count > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                          {tab.count}
                        </span>
                      )}

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNotificationTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'requests' && (
                  <motion.div
                    key="requests"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <MessageRequests />
                  </motion.div>
                )}

                {activeTab === 'trusted' && (
                  <motion.div
                    key="trusted"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <TrustedConnections />
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

export default NotificationCenter;
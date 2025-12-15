import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, MessageSquare, Shield, Briefcase } from 'lucide-react';
import { useAppSelector } from '@store/hooks';

// Chat Components
import MessageRequests from '@components/messaging/MessageRequests';
import TrustedConnections from '@components/messaging/TrustedConnections';
import { ChatInterface } from '@components/messaging/ChatInterface';

// Business Component
import { BusinessView } from '@components/business/BusinessView';

type MessagingTab = 'all' | 'requests' | 'trusted' | 'business';

export const MessagingView: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const messageRequests = useAppSelector((state) => state.user.messageRequests);
  const userVillage = useAppSelector((state) => state.user.village);
  
  const [activeTab, setActiveTab] = useState<MessagingTab>('all');
  const [selectedChat, setSelectedChat] = useState<{
    contactId: string;
    contactName: string;
    contactAvatar?: string;
    isOnline: boolean;
  } | null>(null);

  // Village info for BusinessView
  const villageConfigs: Record<string, any> = {
    // Import your village configs here or pass from parent
  };
  const villageConfig = userVillage?.villageId ? villageConfigs[userVillage.villageId] : null;
  const villageName = villageConfig?.villageName || villageConfig?.displayName || 'Village';
  const villageColor = villageConfig?.color || villageConfig?.visual?.colorPrimary || '#10b981';

  // Mock conversations
  const mockConversations = [
    {
      id: 'user-1',
      name: 'Chioma Adeyemi',
      avatar: undefined,
      lastMessage: 'Thanks for your help with the project!',
      lastMessageTime: '2m ago',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: 'user-2',
      name: 'Kwame Osei',
      avatar: undefined,
      lastMessage: 'See you at the meeting tomorrow',
      lastMessageTime: '1h ago',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: 'user-3',
      name: 'Amara Nwosu',
      avatar: undefined,
      lastMessage: 'That sounds great! Let me know when you\'re ready',
      lastMessageTime: '3h ago',
      unreadCount: 1,
      isOnline: true
    }
  ];

  // ✅ Messaging Tab Configuration
  const messagingTabs = [
    { id: 'all' as MessagingTab, label: 'All Chats', icon: MessageCircle },
    { id: 'requests' as MessagingTab, label: 'Requests', icon: MessageSquare },
    { id: 'trusted' as MessagingTab, label: 'Trusted', icon: Shield },
    { id: 'business' as MessagingTab, label: 'Business', icon: Briefcase },
  ];

  const pendingRequestsCount = messageRequests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      {/* Header */}
      <div>
        <h2 className={`text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Messages & Business
        </h2>
        <p className={`text-xs sm:text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Your conversations and professional sessions
        </p>
      </div>

      {/* Messaging Tabs */}
      <div className={`flex gap-2 overflow-x-auto pb-2 ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      } border-b hide-scrollbar`}>
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none !important;
          }
          .hide-scrollbar {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
        `}</style>
        
        {messagingTabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          
          // Count badges
          const requestCount = tab.id === 'requests' ? pendingRequestsCount : 0;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap transition-colors relative text-sm font-medium ${
                isActive
                  ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                  : theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {requestCount > 0 && tab.id === 'requests' && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {requestCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* ALL CHATS TAB */}
        {activeTab === 'all' && (
          <motion.div 
            key="all-chats" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            {selectedChat ? (
              <div className="fixed inset-0 z-[60] bg-white dark:bg-gray-900">
                <ChatInterface
                  contactId={selectedChat.contactId}
                  contactName={selectedChat.contactName}
                  contactAvatar={selectedChat.contactAvatar}
                  isOnline={selectedChat.isOnline}
                  onBack={() => {
                    setSelectedChat(null);
                  }}
                  onVoiceCall={() => {
                    console.log('Voice call:', selectedChat.contactId);
                  }}
                  onVideoCall={() => {
                    console.log('Video call:', selectedChat.contactId);
                  }}
                  onViewProfile={() => {
                    console.log('View profile:', selectedChat.contactId);
                  }}
                />
              </div>
            ) : (
              // Chat list UI
              <div className="space-y-3">
                <h3 className={`text-base sm:text-lg font-bold px-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Recent Conversations
                </h3>
                
                {mockConversations.length > 0 ? (
                  <div className="space-y-2">
                    {mockConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => {
                          setSelectedChat({
                            contactId: conversation.id,
                            contactName: conversation.name,
                            contactAvatar: conversation.avatar,
                            isOnline: conversation.isOnline
                          });
                        }}
                        className={`w-full p-3 sm:p-4 rounded-xl flex items-center gap-3 transition-colors ${
                          theme === 'dark' 
                            ? 'bg-gray-800 hover:bg-gray-750' 
                            : 'bg-white hover:bg-gray-50 border border-gray-200'
                        }`}
                      >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                          }`}>
                            {conversation.avatar ? (
                              <img 
                                src={conversation.avatar} 
                                alt={conversation.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className={`text-base sm:text-lg font-bold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>
                                {conversation.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          {conversation.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <p className={`font-semibold text-sm sm:text-base truncate ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {conversation.name}
                            </p>
                            <span className={`text-xs flex-shrink-0 ml-2 ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              {conversation.lastMessageTime}
                            </span>
                          </div>
                          <p className={`text-xs sm:text-sm truncate ${
                            conversation.unreadCount > 0
                              ? theme === 'dark' ? 'text-white font-medium' : 'text-gray-900 font-medium'
                              : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {conversation.lastMessage}
                          </p>
                        </div>
                        
                        {/* Unread badge */}
                        {conversation.unreadCount > 0 && (
                          <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={`p-12 rounded-2xl text-center ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <MessageCircle className={`w-16 h-16 mx-auto mb-4 ${
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                    <h3 className={`text-xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      No conversations yet
                    </h3>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Start a conversation from your connections
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
        
        {/* REQUESTS TAB */}
        {activeTab === 'requests' && (
          <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MessageRequests />
          </motion.div>
        )}
        
        {/* TRUSTED TAB */}
        {activeTab === 'trusted' && (
          <motion.div key="trusted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TrustedConnections />
          </motion.div>
        )}
        
        {/* BUSINESS TAB - Uses BusinessView Component */}
        {activeTab === 'business' && (
          <motion.div key="business" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BusinessView 
              villageName={villageName}
              villageColor={villageColor}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MessagingView;
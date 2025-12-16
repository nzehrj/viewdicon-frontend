import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Heart, Activity, ArrowLeft } from 'lucide-react';
import { useAppSelector } from '@store/hooks';

// Network Components
import KinshipNetwork from '@components/network/KinshipNetwork';
import LinkRequest from '@components/network/LinkRequest';
import NetworkStats from '@components/network/NetworkStats';
import ConnectionCard from '@components/network/ConnectionCard';

type NetworkTab = 'kinship' | 'requests' | 'stats';

interface NetworkViewProps {
  villageName?: string;
  userId?: string | null;
  onBack?: () => void;
}

export const NetworkView: React.FC<NetworkViewProps> = ({ 
  villageName = 'Village',
  userId,
  onBack,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  
  const [activeNetworkTab, setActiveNetworkTab] = useState<NetworkTab>('kinship');

  const currentUserId = userId || user?.id || 'user-123';

  // Debug logging
  console.log('NetworkView rendered - onBack:', !!onBack);

  // Sample connections for testing ConnectionCard
  const sampleConnections = [
    {
      id: '1',
      afroId: 'AFRO-2024-001',
      name: 'Chinwe Okafor',
      displayName: 'Chinwe Okafor',
      village: 'Technology',
      role: 'Senior Software Engineer',
      crest: 8,
      kinshipTier: 'C1' as const,
      location: { city: 'Lagos', country: 'Nigeria' },
      stats: { connections: 245, sessions: 32, rating: 4.8 },
      businessLink: {
        tier: 'verified' as const,
        totalSessions: 15,
        totalValue: 2500000
      },
      isOnline: true,
      mutualConnections: [
        { id: '2', name: 'Adewale Johnson' },
        { id: '3', name: 'Fatima Ahmed' },
        { id: '4', name: 'Emeka Nwankwo' }
      ]
    },
    {
      id: '2',
      afroId: 'AFRO-2024-002',
      name: 'Kwame Mensah',
      displayName: 'Kwame Mensah',
      village: 'Creative',
      role: 'UI/UX Designer',
      crest: 7,
      kinshipTier: 'C2' as const,
      location: { city: 'Accra', country: 'Ghana' },
      stats: { connections: 189, sessions: 24, rating: 4.6 },
      businessLink: {
        tier: 'trusted' as const,
        totalSessions: 8,
        totalValue: 1200000
      },
      isOnline: false,
      mutualConnections: [
        { id: '5', name: 'Aisha Mohammed' }
      ]
    },
    {
      id: '3',
      afroId: 'AFRO-2024-003',
      name: 'Amara Nkrumah',
      displayName: 'Amara Nkrumah',
      village: 'Business',
      role: 'Business Consultant',
      crest: 9,
      kinshipTier: 'C1' as const,
      location: { city: 'Nairobi', country: 'Kenya' },
      stats: { connections: 312, sessions: 48, rating: 4.9 },
      businessLink: {
        tier: 'elite' as const,
        totalSessions: 25,
        totalValue: 5000000
      },
      isOnline: true,
      mutualConnections: [
        { id: '6', name: 'Oluwaseun Balogun' },
        { id: '7', name: 'Thandiwe Moyo' }
      ]
    }
  ];

  // ✅ Network Tab Configuration
  const networkTabs = [
    { id: 'kinship' as NetworkTab, label: 'Kinship', icon: Users },
    { id: 'requests' as NetworkTab, label: 'Requests', icon: Heart },
    { id: 'stats' as NetworkTab, label: 'Stats', icon: Activity },
  ];

  // Event Handlers
  const handleViewConnectionProfile = (connectionId: string) => {
    console.log('Viewing connection profile:', connectionId);
  };

  const handleSendConnectionMessage = (connectionId: string) => {
    console.log('Sending message to connection:', connectionId);
  };

  const handleRemoveConnection = (connectionId: string) => {
    console.log('Removing connection:', connectionId);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Back Button - ALWAYS VISIBLE */}
      <div className="p-2 md:p-4">
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          {/* Back Button - NO CONDITIONAL */}
          <button
            onClick={() => {
              console.log('🔥 Back button clicked!');
              if (onBack) {
                console.log('✅ Calling onBack handler');
                onBack();
              } else {
                console.warn('⚠️ No onBack handler provided');
              }
            }}
            className={`p-1.5 md:p-2 rounded-lg transition-colors flex-shrink-0 ${
              theme === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
            }`}
            aria-label="Back to profile"
          >
            <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          
          {/* Title */}
          <div className="flex-1 min-w-0">
            <h2 className={`text-xl md:text-3xl font-bold mb-0.5 md:mb-1 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Kinship Network
            </h2>
            <p className={`text-xs md:text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Your professional connections and community
            </p>
          </div>
        </div>
      </div>

      {/* Network Tabs */}
      <div className={`flex gap-2 overflow-x-auto px-2 md:px-4 pb-2 ${
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
        
        {networkTabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeNetworkTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveNetworkTab(tab.id)}
              className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg whitespace-nowrap transition-colors text-sm font-medium ${
                isActive
                  ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                  : theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span className="text-xs md:text-sm">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Network Tab Content */}
      <AnimatePresence mode="wait">
        {/* KINSHIP TAB */}
        {activeNetworkTab === 'kinship' && (
          <motion.div 
            key="kinship" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <div className="space-y-4 md:space-y-6">
              {/* Featured Connection - Detailed View */}
              <div className="p-2 md:p-4">
                <h3 className={`text-base md:text-lg font-bold mb-3 md:mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Featured Connection
                </h3>
                <ConnectionCard
                  connection={sampleConnections[0]}
                  size="detailed"
                  showActions={true}
                  onViewProfile={handleViewConnectionProfile}
                  onSendMessage={handleSendConnectionMessage}
                  onRemove={handleRemoveConnection}
                />
              </div>

              {/* All Connections - Grid View */}
              <div className="p-2 md:p-4">
                <h3 className={`text-base md:text-lg font-bold mb-3 md:mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Your Connections
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {sampleConnections.map((connection) => (
                    <ConnectionCard
                      key={connection.id}
                      connection={connection}
                      size="default"
                      showActions={true}
                      onViewProfile={handleViewConnectionProfile}
                      onSendMessage={handleSendConnectionMessage}
                      onRemove={handleRemoveConnection}
                    />
                  ))}
                </div>
              </div>

              {/* KinshipNetwork Component */}
              <div>
                <KinshipNetwork 
                  userId={currentUserId}
                  userVillage={villageName}
                  connections={[]}
                  pendingRequests={0}
                  isLoading={false}
                  onViewProfile={handleViewConnectionProfile}
                  onSendMessage={handleSendConnectionMessage}
                  onViewRequests={() => setActiveNetworkTab('requests')}
                />
              </div>
            </div>
          </motion.div>
        )}
        
        {/* REQUESTS TAB */}
        {activeNetworkTab === 'requests' && (
          <motion.div 
            key="requests" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="p-2 md:p-4"
          >
            <LinkRequest 
              currentUserId={currentUserId}
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
        
        {/* STATS TAB */}
        {activeNetworkTab === 'stats' && (
          <motion.div 
            key="stats" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="p-2 md:p-4"
          >
            <NetworkStats 
              userId={currentUserId}
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
    </div>
  );
};

export default NetworkView;
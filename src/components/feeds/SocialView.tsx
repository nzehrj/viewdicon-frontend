import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus } from 'lucide-react';
import { useAppSelector } from '@store/hooks';

// Feed Components
import { FeedComposer } from '@components/feeds/FeedComposer';
import { UnifiedFeedView } from '@components/feeds/UnifiedFeedView';
import { CircleHub } from '@components/feeds/CircleHub';
import { RequestWorkFlow } from '@components/discover/RequestWorkFlow';

type FeedType = 'feed' | 'circle';

interface SocialViewProps {
  isNavVisible?: boolean;
}

export const SocialView: React.FC<SocialViewProps> = ({ 
  isNavVisible = true 
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [activeFeedType, setActiveFeedType] = useState<FeedType>('feed');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [showRequestWorkFlow, setShowRequestWorkFlow] = useState(false);

  // ✅ Feed Tab Configuration
  const feedTabs = [
    { id: 'feed' as FeedType, label: 'Soro soke', icon: Users, color: '#10b981' },
    { id: 'circle' as FeedType, label: 'Circle', icon: Users, color: '#8b5cf6' },
  ];

  // Event Handlers
  const handleRequestWork = (professional: any) => {
    setSelectedProfessional({
      id: professional.id,
      name: professional.name,
      role: professional.role,
      village: professional.village,
      villageColor: professional.villageColor,
      priceHint: professional.priceHint,
    });
    setShowRequestWorkFlow(true);
  };

  const handleSubmitWorkRequest = (requestData: any) => {
    console.log('Work Request Submitted:', requestData);
    alert(`Work request sent to ${selectedProfessional?.name}! They will respond soon.`);
    setShowRequestWorkFlow(false);
    setSelectedProfessional(null);
  };

  return (
    <div className="relative">
      {/* Feed Type Tabs */}
      <div className="overflow-x-auto pb-2 hide-scrollbar max-w-4xl mx-auto">
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none !important;
          }
          .hide-scrollbar {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
        `}</style>
        
        <div className="flex items-center gap-2 min-w-max">
          {feedTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFeedType === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFeedType(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                  isActive
                    ? 'text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={isActive ? { backgroundColor: tab.color } : {}}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feed Content */}
      <AnimatePresence mode="wait">
        {activeFeedType === 'feed' && (
          <motion.div 
            key="feed-view" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <UnifiedFeedView onRequestWork={handleRequestWork} />
          </motion.div>
        )}
        
        {activeFeedType === 'circle' && (
          <motion.div 
            key="circle" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <CircleHub />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Request Work Flow Modal */}
      {selectedProfessional && (
        <RequestWorkFlow
          isOpen={showRequestWorkFlow}
          onClose={() => {
            setShowRequestWorkFlow(false);
            setSelectedProfessional(null);
          }}
          professional={selectedProfessional}
          onSubmitRequest={handleSubmitWorkRequest}
        />
      )}

      {/* Floating Create Post Button */}
      <AnimatePresence>
        {isNavVisible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30 
            }}
            onClick={() => setIsComposerOpen(true)}
            className="fixed bottom-24 right-6 outline-none md:right-12 md:bottom-28 w-12 h-12 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Feed Composer Modal */}
      <FeedComposer 
        isOpen={isComposerOpen} 
        onClose={() => setIsComposerOpen(false)}
        defaultFeedType="village"
        onPost={(postData) => {
          console.log('Post created:', postData);
          setIsComposerOpen(false);
          // TODO: Handle post submission
        }}
      />
    </div>
  );
};

export default SocialView;
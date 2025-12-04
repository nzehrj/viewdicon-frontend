import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Video, Image, Mic, Heart, Sparkles } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import { FeedTimeline } from '@components/feed/FeedTimeline';
import { Discover } from '@components/discover/Discover';
import { MotionFeed } from '@components/feeds/MotionFeed';
import { GalleryFeed } from '@components/feeds/GalleryFeed';
import { VoiceFeed } from '@components/feeds/VoiceFeed';
import { FamilyCircle } from '@components/feeds/FamilyCircle';
import { DiscoverySpotlight } from '@components/feeds/DiscoverySpotlight';

type FeedSubType = 'village' | 'discover' | 'motion' | 'gallery' | 'voice' | 'family' | 'spotlight';

interface UnifiedFeedViewProps {
  onRequestWork?: (professional: any) => void;
}

export const UnifiedFeedView: React.FC<UnifiedFeedViewProps> = ({ onRequestWork }) => {
  const [activeFeedSubType, setActiveFeedSubType] = useState<FeedSubType>('village');
  const [showMotionFullScreen, setShowMotionFullScreen] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);

  const feedSubTabs = [
    { id: 'village' as const, label: 'Village', icon: Users },
    { id: 'discover' as const, label: 'Discover', icon: Search },
    { id: 'motion' as const, label: 'Motion', icon: Video },
    { id: 'gallery' as const, label: 'Gallery', icon: Image },
    { id: 'voice' as const, label: 'Voice', icon: Mic },
    { id: 'family' as const, label: 'Family', icon: Heart },
    { id: 'spotlight' as const, label: 'Spotlight', icon: Sparkles },
  ];

  // Handle Motion tab click
  const handleFeedSubTypeChange = (subType: FeedSubType) => {
    setActiveFeedSubType(subType);
    if (subType === 'motion') {
      setShowMotionFullScreen(true);
    }
  };

  // Handle Motion close
  const handleCloseMotion = () => {
    setShowMotionFullScreen(false);
    setActiveFeedSubType('village'); // Return to village feed
  };

  return (
    <div >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Sub-tabs inside Feed */}
      <div className={`flex mt-4 gap-2 overflow-x-auto pb-2 mb-4 ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      } border-b hide-scrollbar`}>
        {feedSubTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFeedSubType === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleFeedSubTypeChange(tab.id)}
              className={`px-4 py-2 rounded-lg outline-none text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                isActive
                  ? theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
                  : theme === 'dark' ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Feed Content */}
      <AnimatePresence mode="wait">
        {activeFeedSubType === 'village' && (
          <motion.div 
            key="village" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <FeedTimeline />
          </motion.div>
        )}
        
        {activeFeedSubType === 'discover' && (
          <motion.div 
            key="discover" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <Discover onRequestWork={onRequestWork} />
          </motion.div>
        )}
        
        {activeFeedSubType === 'gallery' && (
          <motion.div 
            key="gallery" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <GalleryFeed />
          </motion.div>
        )}
        
        {activeFeedSubType === 'voice' && (
          <motion.div 
            key="voice" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <VoiceFeed />
          </motion.div>
        )}
        
        {activeFeedSubType === 'family' && (
          <motion.div 
            key="family" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <FamilyCircle />
          </motion.div>
        )}
        
        {activeFeedSubType === 'spotlight' && (
          <motion.div 
            key="spotlight" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <DiscoverySpotlight />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Motion Full-Screen Overlay */}
      {showMotionFullScreen && (
        <MotionFeed onClose={handleCloseMotion} />
      )}
    </div>
  );
};

export default UnifiedFeedView;
// src/components/tv/TVStatusBar.tsx
// Single TV Icon at Top of Feed (Not spread like Instagram stories)

import React from 'react';
import { motion } from 'framer-motion';
import { Tv, Radio } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { startTV } from '@/store/slices/tvSlice';

interface Channel {
  id: string;
  name: string;
  type: 'village' | 'regional' | 'national' | 'pan-african';
  isLive: boolean;
  viewerCount: number;
  thumbnail?: string;
  color: string;
}

interface TVStatusBarProps {
  channels: Channel[];
  onChannelClick?: (channelId: string) => void;
}

export const TVStatusBar: React.FC<TVStatusBarProps> = ({
  channels,
  onChannelClick,
}) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);

  const liveChannels = channels.filter(c => c.isLive);
  const totalViewers = liveChannels.reduce((sum, ch) => sum + ch.viewerCount, 0);
  const hasLiveContent = liveChannels.length > 0;

  if (!hasLiveContent) return null;

  const handleClick = () => {
    // Open first live channel
    if (liveChannels[0]) {
      dispatch(startTV({ channelId: liveChannels[0].id, mode: 'bubble' }));
      onChannelClick?.(liveChannels[0].id);
    }
  };

  return (
    <div className={`sticky top-0 z-40 ${
      theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'
    } backdrop-blur-sm border-b ${
      theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
    } py-3 px-4`}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="w-full flex items-center gap-3"
      >
        {/* Animated Ring */}
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-purple-600 opacity-75"
            style={{ padding: '3px' }}
          />
          
          {/* TV Avatar */}
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
            <Tv className="w-7 h-7 text-white" />
            
            {/* Live Indicator */}
            <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-md border-2 border-white">
              <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-sm font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Jollof TV
            </h3>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-600/10 rounded-full">
              <Radio className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-semibold text-purple-600">
                {liveChannels.length} Live
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {liveChannels[0]?.name || 'National Broadcast'}
            </p>
            
            {totalViewers > 0 && (
              <>
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  •
                </span>
                <p className={`text-xs font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {totalViewers >= 1000
                    ? `${(totalViewers / 1000).toFixed(1)}K watching`
                    : `${totalViewers} watching`}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Arrow Indicator */}
        <div className={`px-3 py-2 rounded-lg ${
          theme === 'dark' ? 'bg-purple-600/10' : 'bg-purple-50'
        }`}>
          <span className="text-sm font-semibold text-purple-600">
            Tap to Watch
          </span>
        </div>
      </motion.button>
    </div>
  );
};

export default TVStatusBar;
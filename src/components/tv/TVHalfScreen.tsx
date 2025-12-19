// src/components/tv/TVHalfScreen.tsx
// Half-Screen Split View TV

import React from 'react';
import { motion } from 'framer-motion';
import { X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTVMode, stopTV } from '@/store/slices/tvSlice';
import { TVPlayerCore } from './TVPlayerCore';
import type { TVChannel } from '@/types/tv/tv.types';

interface TVHalfScreenProps {
  channel: TVChannel;
  isVisible: boolean;
  position?: 'left' | 'right';
}

export const TVHalfScreen: React.FC<TVHalfScreenProps> = ({
  channel,
  isVisible,
  position = 'right',
}) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const player = useAppSelector((state) => state.tv.player);

  if (!isVisible || !player.isActive || player.mode !== 'half-screen') return null;

  const handleClose = () => {
    dispatch(stopTV());
  };

  const handleFullscreen = () => {
    dispatch(setTVMode('fullscreen'));
  };

  const togglePosition = () => {
    // Could implement position toggle in Redux
    console.log('Toggle position');
  };

  return (
    <motion.div
      initial={{ x: position === 'right' ? '100%' : '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: position === 'right' ? '100%' : '-100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`fixed top-0 ${
        position === 'right' ? 'right-0' : 'left-0'
      } h-screen w-full md:w-1/2 z-[80] ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      } shadow-2xl`}
    >
      {/* Header */}
      <div className={`h-14 flex items-center justify-between px-4 border-b ${
        theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={togglePosition}
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            title="Switch side"
          >
            {position === 'right' ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>

          <div>
            <p className={`text-sm font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {channel.currentProgram?.title || 'Live Stream'}
            </p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {channel.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleFullscreen}
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
            title="Fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>

          <button
            onClick={handleClose}
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'hover:bg-red-600/20 text-red-500' : 'hover:bg-red-50 text-red-600'
            }`}
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="h-[calc(100vh-56px)] bg-black">
        <TVPlayerCore
          channelId={channel.id}
          programTitle={channel.currentProgram?.title || 'Live Stream'}
          programDescription={channel.currentProgram?.description}
          streamerName={channel.name}
          viewerCount={channel.viewerCount || 0}
          isLive={channel.isLive}
          onModeChange={() => {}}
        />
      </div>

      {/* Swipe Indicator - Mobile Only */}
      <div className="md:hidden absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full">
        <motion.div
          animate={{ x: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-8 h-20 bg-gradient-to-r from-transparent to-purple-600/30 rounded-l-full flex items-center justify-center"
        >
          <ChevronLeft className="w-6 h-6 text-purple-500" />
        </motion.div>
      </div>

      {/* Backdrop for closing on mobile */}
      <div
        onClick={handleClose}
        className="md:hidden fixed inset-0 bg-black/50 -z-10"
      />
    </motion.div>
  );
};

export default TVHalfScreen;
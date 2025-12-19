// src/components/tv/TVFloating.tsx
// Medium Draggable Floating TV Window with Snap-to-Corner

import React, { useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTVMode, stopTV, setPlayerPosition } from '@/store/slices/tvSlice';
import { TVPlayerCore } from './TVPlayerCore';
import type { TVChannel } from '@/types/tv/tv.types';

interface TVFloatingProps {
  channel: TVChannel;
  isVisible: boolean;
}

export const TVFloating: React.FC<TVFloatingProps> = ({
  channel,
  isVisible,
}) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const player = useAppSelector((state) => state.tv.player);
  
  const x = useMotionValue(window.innerWidth - 420);
  const y = useMotionValue(100);
  const [isDragging, setIsDragging] = useState(false);

  // Size: 25% of viewport
  const width = Math.min(400, window.innerWidth * 0.25);
  const height = (width * 9) / 16; // 16:9 aspect ratio

  if (!isVisible || !player.isActive || player.mode !== 'floating') return null;

  const handleClose = () => {
    dispatch(stopTV());
  };

  const handleExpand = () => {
    dispatch(setTVMode('fullscreen'));
  };

  const handleMinimize = () => {
    dispatch(setTVMode('bubble'));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    
    // Snap to nearest corner
    const currentX = x.get();
    const currentY = y.get();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let snapX = currentX;
    let snapY = currentY;

    // Determine nearest corner
    if (currentX < viewportWidth / 2) {
      snapX = 20; // Left
    } else {
      snapX = viewportWidth - width - 20; // Right
    }

    if (currentY < viewportHeight / 2) {
      snapY = 80; // Top
    } else {
      snapY = viewportHeight - height - 80; // Bottom
    }

    // Animate to corner
    x.set(snapX);
    y.set(snapY);

    // Update Redux state
    dispatch(setPlayerPosition({
      x: (snapX / viewportWidth) * 100,
      y: (snapY / viewportHeight) * 100,
    }));
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      style={{ x, y, width, touchAction: 'none' }}
      className="fixed z-[90] cursor-move"
    >
      <motion.div
        animate={{
          scale: isDragging ? 0.95 : 1,
          boxShadow: isDragging
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        }}
        className={`rounded-2xl overflow-hidden border-2 ${
          theme === 'dark'
            ? 'bg-gray-900 border-purple-600'
            : 'bg-white border-purple-500'
        }`}
      >
        {/* Drag Handle */}
        <div className={`h-8 flex items-center justify-center ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        } border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className={`w-12 h-1 rounded-full ${
            theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'
          }`} />
        </div>

        {/* Video Container */}
        <div className="relative aspect-video bg-black group">
          {/* Player Core */}
          <TVPlayerCore
            channelId={channel.id}
            programTitle={channel.currentProgram?.title || 'Live Stream'}
            programDescription={channel.currentProgram?.description}
            streamerName={channel.name}
            viewerCount={channel.viewerCount || 0}
            isLive={channel.isLive}
            onModeChange={() => {}}
          />

          {/* Floating Controls - Always visible on mobile */}
          <div className="absolute top-2 right-2 flex items-center gap-2 z-30">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMinimize();
              }}
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-colors"
              title="Minimize"
            >
              <Minimize2 className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleExpand();
              }}
              className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Info Bar */}
        <div className={`px-4 py-3 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        } border-t ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <p className={`text-sm font-bold truncate ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {channel.currentProgram?.title || 'Live Stream'}
          </p>
          <p className={`text-xs truncate mt-1 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {channel.name}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TVFloating;
// src/components/tv/TVBubble.tsx
// TV Bubble - Small Draggable Window - WORKING VERSION

import React, { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Maximize2, Minimize2, Grid3x3, MessageSquare, BarChart3, Calendar } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { TVPlayerCore } from './TVPlayerCore';
import type { TVChannel } from '@/types/tv/tv.types';

interface TVBubbleProps {
  channel: TVChannel;
  isVisible: boolean;
  onClose?: () => void;
  onExpand?: () => void;
  onMinimize?: () => void;
  onChannelGrid?: () => void;
  onSorosoke?: () => void;
  onTelemetry?: () => void;
  onScheduler?: () => void;
}

export const TVBubble: React.FC<TVBubbleProps> = ({
  channel,
  isVisible,
  onClose,
  onExpand,
  onMinimize,
  onChannelGrid,
  onSorosoke,
  onTelemetry,
  onScheduler,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [isHovered, setIsHovered] = useState(false);
  const dragControls = useDragControls(); // ✅ Drag controls for title bar

  if (!isVisible) return null;

  // ✅ Always calculate center position (recalculates on every render)
  const centerX = (window.innerWidth - 440) / 2;
  const centerY = (window.innerHeight - 280) / 2;

  console.log('🎯 TVBubble centered at:', { centerX, centerY });

  // ✅ Handler functions with logging
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('❌ TVBubble: Close button clicked');
    if (onClose) {
      onClose();
      console.log('✅ TVBubble: onClose handler called');
    } else {
      console.error('⚠️ TVBubble: onClose handler is undefined!');
    }
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🔼 TVBubble: Expand button clicked');
    if (onExpand) {
      onExpand();
      console.log('✅ TVBubble: onExpand handler called');
    } else {
      console.error('⚠️ TVBubble: onExpand handler is undefined!');
    }
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🔽 TVBubble: Minimize button clicked');
    if (onMinimize) {
      onMinimize();
      console.log('✅ TVBubble: onMinimize handler called');
    } else {
      console.error('⚠️ TVBubble: onMinimize handler is undefined!');
    }
  };

  return (
    <motion.div
      key="tv-bubble"  // ✅ Forces re-mount and re-center
      drag
      dragControls={dragControls}  // ✅ Use drag controls
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        top: -centerY + 20,  // ✅ Allow drag to top (near navbar)
        left: -centerX + 20,
        right: window.innerWidth - centerX - 460,
        bottom: window.innerHeight - centerY - 300,
      }}
      initial={{
        x: 0,  // ✅ Start at 0,0 (centered by left/top calc)
        y: 0,
        opacity: 0,
        scale: 0.8,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        // ✅ DO NOT animate x/y - let user drag freely
      }}
      exit={{
        opacity: 0,
        scale: 0.8,
      }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 300,
      }}
      className="fixed z-[100]"
      style={{ 
        touchAction: 'none', 
        width: '440px',
        left: `${centerX}px`,  // ✅ Position centered via CSS
        top: `${centerY}px`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`rounded-2xl overflow-hidden shadow-2xl border-2 ${
        theme === 'dark' ? 'bg-gray-900 border-purple-600' : 'bg-white border-purple-500'
      }`}>
        {/* Video Container */}
        <div className="relative aspect-video bg-black">
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

          {/* Mini Controls Overlay - Show when hovered */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-center pb-4 gap-3 pointer-events-auto"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleMinimize}
                className="p-2.5 rounded-full bg-gray-800/90 hover:bg-gray-700 text-white transition-colors backdrop-blur-sm cursor-pointer"
                title="Picture-in-Picture"
                type="button"
              >
                <Minimize2 className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleExpand}
                className="p-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors backdrop-blur-sm cursor-pointer"
                title="Expand to Floating"
                type="button"
              >
                <Maximize2 className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="p-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors backdrop-blur-sm cursor-pointer"
                title="Close"
                type="button"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Title Bar with Drag Handle */}
        <div 
          onPointerDown={(e) => dragControls.start(e)}  // ✅ Enable drag from title bar
          className={`px-3 py-2 flex items-center justify-between cursor-move ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
          }`}
        >
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold truncate ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {channel.currentProgram?.title || 'Live Stream'}
            </p>
            <p className={`text-[10px] truncate ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {channel.name}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Channel Grid Button */}
            {onChannelGrid && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChannelGrid();
                }}
                className={`p-1.5 rounded-md ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                } transition-colors cursor-pointer`}
                title="Channel Grid"
                type="button"
              >
                <Grid3x3 className="w-4 h-4 text-purple-600" />
              </button>
            )}

            {/* TV Scheduler Button */}
            {onScheduler && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onScheduler();
                }}
                className={`p-1.5 rounded-md ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                } transition-colors cursor-pointer`}
                title="TV Guide"
                type="button"
              >
                <Calendar className="w-4 h-4 text-amber-600" />
              </button>
            )}

            {/* DJ Telemetry Button */}
            {onTelemetry && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTelemetry();
                }}
                className={`p-1.5 rounded-md z-50 ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                } transition-colors cursor-pointer`}
                title="DJ Telemetry"
                type="button"
              >
                <BarChart3 className="w-4 h-4 text-green-600" />
              </button>
            )}

            {/* Sorosoke Button */}
            {onSorosoke && channel.isLive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSorosoke();
                }}
                className="px-2 py-1 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-colors cursor-pointer"
                title="Call In"
                type="button"
              >
                <MessageSquare className="w-3.5 h-3.5 text-white" />
              </button>
            )}
            
            {/* Drag Handle Indicator */}
            <div className="flex flex-col gap-0.5 px-2">
              <div className={`w-5 h-0.5 rounded-full ${
                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'
              }`} />
              <div className={`w-5 h-0.5 rounded-full ${
                theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400'
              }`} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TVBubble;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tv, 
  X, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  DollarSign,
  MessageCircle,
  Users,
  Play,
  Pause
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface JollofTVBubbleProps {
  // Stream data
  isLive?: boolean;
  streamTitle?: string;
  streamerName?: string;
  viewerCount?: number;
  
  // Positioning
  initialPosition?: { x: number; y: number };
  
  // Callbacks
  onClose?: () => void;
  onMaximize?: () => void;
  onSprayCowrie?: () => void;
}

/**
 * JOLLOF TV FLOATING BUBBLE
 * 
 * Always-on-top livestream component that floats on all screens.
 * 
 * Features:
 * - Draggable anywhere on screen
 * - Minimize to small bubble
 * - Expand to full screen
 * - Cowrie spray (tipping)
 * - Live chat overlay
 * - Viewer count
 * 
 * Used globally across all 5 tabs
 */
export const JollofTVBubble: React.FC<JollofTVBubbleProps> = ({
  isLive = false,
  streamTitle = 'Jollof TV',
  streamerName = 'Live Broadcast',
  viewerCount = 0,
  initialPosition = { x: window.innerWidth - 120, y: window.innerHeight - 200 },
  onClose,
  onMaximize,
  onSprayCowrie,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [isMinimized, setIsMinimized] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  
  // Don't render if not live
  if (!isLive) return null;
  
  // Minimized bubble (small circle)
  if (isMinimized) {
    return (
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={{
          left: 0,
          right: window.innerWidth - 80,
          top: 0,
          bottom: window.innerHeight - 80,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed z-[100] cursor-move"
        style={{ x: position.x, y: position.y }}
        onDragEnd={(_, info) => {
          setPosition({ x: info.point.x, y: info.point.y });
        }}
      >
        <button
          onClick={() => setIsMinimized(false)}
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-2xl border-2 ${
            theme === 'dark' ? 'border-red-500' : 'border-red-600'
          }`}
        >
          {/* Live indicator pulse */}
          <div className="absolute inset-0 bg-red-500 animate-pulse"></div>
          
          {/* TV icon */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Tv className="w-8 h-8 text-white" />
          </div>
          
          {/* LIVE badge */}
          <div className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            LIVE
          </div>
          
          {/* Viewer count */}
          {viewerCount > 0 && (
            <div className="absolute bottom-1 left-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
              <Users className="w-2.5 h-2.5" />
              {viewerCount > 1000 ? `${(viewerCount / 1000).toFixed(1)}k` : viewerCount}
            </div>
          )}
        </button>
      </motion.div>
    );
  }
  
  // Expanded bubble (picture-in-picture)
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        left: 0,
        right: window.innerWidth - 320,
        top: 0,
        bottom: window.innerHeight - 200,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="fixed z-[100] cursor-move"
      style={{ x: position.x - 120, y: position.y - 100 }}
      onDragEnd={(_, info) => {
        setPosition({ x: info.point.x + 120, y: info.point.y + 100 });
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className={`w-72 sm:w-80 rounded-2xl overflow-hidden shadow-2xl border-2 ${
        theme === 'dark' ? 'border-red-500 bg-gray-900' : 'border-red-600 bg-white'
      }`}>
        {/* Video Area */}
        <div className="relative aspect-video bg-black">
          {/* Placeholder - replace with actual video stream */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
            <Tv className="w-16 h-16 text-white/30" />
          </div>
          
          {/* LIVE badge */}
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            LIVE
          </div>
          
          {/* Viewer count */}
          <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {viewerCount > 1000 ? `${(viewerCount / 1000).toFixed(1)}k` : viewerCount}
          </div>
          
          {/* Controls Overlay */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4"
              >
                {/* Play/Pause */}
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  {isPaused ? (
                    <Play className="w-6 h-6 text-white" fill="white" />
                  ) : (
                    <Pause className="w-6 h-6 text-white" />
                  )}
                </button>
                
                {/* Mute */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Info Bar */}
        <div className={`p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <p className={`text-sm font-semibold truncate mb-1 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {streamTitle}
          </p>
          <p className={`text-xs truncate ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {streamerName}
          </p>
        </div>
        
        {/* Action Bar */}
        <div className={`p-2 flex items-center justify-between gap-2 border-t ${
          theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          {/* Cowrie Spray */}
          <button
            onClick={onSprayCowrie}
            className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold flex items-center justify-center gap-1 hover:from-amber-600 hover:to-orange-600 transition-colors"
          >
            <DollarSign className="w-3.5 h-3.5" />
            Spray
          </button>
          
          {/* Chat */}
          <button
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors`}
          >
            <MessageCircle className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
          </button>
          
          {/* Minimize */}
          <button
            onClick={() => setIsMinimized(true)}
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors`}
          >
            <Minimize2 className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
          </button>
          
          {/* Maximize */}
          <button
            onClick={onMaximize}
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors`}
          >
            <Maximize2 className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
          </button>
          
          {/* Close */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JollofTVBubble;
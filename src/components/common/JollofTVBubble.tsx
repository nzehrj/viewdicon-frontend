import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tv, 
  X, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Users,
  Play,
  Pause,
  Coins
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface JollofTVBubbleProps {
  isLive?: boolean;
  streamTitle?: string;
  streamerName?: string;
  viewerCount?: number;
  onClose?: () => void;
  onMaximize?: () => void;
  onSprayCowrie?: (amount: number) => void;
}

/**
 * JOLLOF TV FLOATING BUBBLE
 * 
 * Always-on-top livestream component that floats on all screens.
 * 
 * Features:
 * - Fixed floating button in bottom-right
 * - Centered modal when expanded
 * - Cowrie spray (tipping)
 * - Live viewer count
 * - Mute/unmute controls
 * 
 * Used globally across all tabs
 */
export const JollofTVBubble: React.FC<JollofTVBubbleProps> = ({
  isLive = false,
  streamTitle = 'Jollof TV Live',
  streamerName = 'Live Broadcast',
  viewerCount = 0,
  onClose,
  onMaximize,
  onSprayCowrie,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [isMinimized, setIsMinimized] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showCowrieMenu, setShowCowrieMenu] = useState(false);
  
  // Don't render if not live
  if (!isLive) return null;
  
  const cowrieAmounts = [10, 50, 100, 500, 1000];
  
  const handleCowrieSpray = (amount: number) => {
    if (onSprayCowrie) {
      onSprayCowrie(amount);
    }
    setShowCowrieMenu(false);
    console.log(`Sprayed ${amount} Cowries! 💰`);
  };
  
  // Minimized bubble (floating button above create post button)
  // Create button is at bottom-24 (96px), button height is 56px
  // Jollof TV position: 96px + 56px + 8px gap = 160px
  if (isMinimized) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        onClick={() => setIsMinimized(false)}
        className={`fixed bottom-[160px] right-6 md:right-12 md:bottom-48 z-[100] w-14 h-14 rounded-md overflow-hidden shadow-lg border-2 ${
          theme === 'dark' ? 'border-red-500 shadow-red-500/20' : 'border-red-600 shadow-red-600/20'
        }`}
      >
        {/* Live indicator pulse */}
        <div className="absolute inset-0 bg-red-500 animate-pulse"></div>
        
        {/* TV icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <Tv className="w-6 h-6 text-white" />
        </div>
        
        {/* LIVE badge */}
        <div className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[9px] font-bold px-1 py-0.5 rounded">
          LIVE
        </div>
        
        {/* Viewer count */}
        {viewerCount > 0 && (
          <div className="absolute bottom-0.5 left-0.5 bg-black/80 text-white text-[9px] px-1 py-0.5 rounded flex items-center gap-0.5">
            <Users className="w-2.5 h-2.5" />
            {viewerCount > 1000 ? `${(viewerCount / 1000).toFixed(1)}k` : viewerCount}
          </div>
        )}
      </motion.button>
    );
  }
  
  // Expanded modal (centered on screen)
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsMinimized(true)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
      />

      {/* Modal - Centered and Draggable */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        className="fixed z-[101] cursor-move"
        style={{
          left: '50%',
          top: '50%',
          x: '-50%',
          y: '-50%',
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div className={`w-[90vw] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl rounded-2xl overflow-hidden shadow-2xl border-2 ${
          theme === 'dark' ? 'border-red-500 bg-gray-900' : 'border-red-600 bg-white'
        }`}>
          {/* Video Area */}
          <div className="relative aspect-video bg-black">
            {/* Placeholder - replace with actual video stream */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
              <Tv className="w-16 h-16 text-white/30" />
            </div>
            
            {/* LIVE badge */}
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 z-10">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              LIVE
            </div>
            
            {/* Viewer count */}
            <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-10">
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
                  className="absolute inset-0 bg-black/50 flex items-center justify-center gap-4 z-10"
                >
                  {/* Play/Pause */}
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    {isPaused ? (
                      <Play className="w-6 h-6 text-white" />
                    ) : (
                      <Pause className="w-6 h-6 text-white" />
                    )}
                  </button>
                  
                  {/* Mute/Unmute */}
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
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-sm truncate ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {streamTitle}
                </h3>
                <p className={`text-xs truncate ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {streamerName}
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Cowrie Spray Button */}
              <div className="relative flex-1">
                <button
                  onClick={() => setShowCowrieMenu(!showCowrieMenu)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white text-sm font-semibold transition-colors"
                >
                  <Coins className="w-4 h-4" />
                  Spray Cowries
                </button>
                
                {/* Cowrie Amount Menu */}
                <AnimatePresence>
                  {showCowrieMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute bottom-full left-0 right-0 mb-2 p-2 rounded-lg shadow-lg ${
                        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                      }`}
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {cowrieAmounts.map((amount) => (
                          <button
                            key={amount}
                            onClick={() => handleCowrieSpray(amount)}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                              theme === 'dark'
                                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                            }`}
                          >
                            {amount} 🪙
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
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
        </div>
      </motion.div>
    </>
  );
};

export default JollofTVBubble;
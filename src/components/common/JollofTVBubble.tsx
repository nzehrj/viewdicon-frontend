import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tv, 
  X, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  Users,
  Play,
  Pause,
  Coins,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface JollofTVProps {
  isLive?: boolean;
  streamTitle?: string;
  streamerName?: string;
  viewerCount?: number;
  onClose?: () => void;
  onMaximize?: () => void;
  onSprayCowrie?: (amount: number) => void;
}

type ViewMode = 'theater' | 'minimized' | 'closed';

/**
 * JOLLOF TV - CENTERED, RESPONSIVE, DRAGGABLE, MINIMIZABLE
 */
export const JollofTVBubble: React.FC<JollofTVProps> = ({
  isLive: _isLive = true, // Prefix with _ to silence warning (it IS used in JSX)
  streamTitle = 'Jollof TV Live: Community Talk',
  streamerName = 'Adeola Williams',
  viewerCount = 1247,
  onClose,
  onMaximize: _onMaximize, // Prefix with _ to indicate intentionally unused
  onSprayCowrie,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [viewMode, setViewMode] = useState<ViewMode>('theater');
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showControls] = useState(true); // Removed setter since it's not used
  const [showCowrieMenu, setShowCowrieMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [quality, setQuality] = useState<'auto' | '1080p' | '720p' | '480p'>('auto');
  
  const cowrieAmounts = [10, 50, 100, 500, 1000, 5000];
  
  const handleCowrieSpray = (amount: number) => {
    onSprayCowrie?.(amount);
    setShowCowrieMenu(false);
    console.log(`Sprayed ${amount} Cowries! 💰`);
  };
  
  const handleClose = () => {
    setViewMode('closed');
    onClose?.();
  };
  
  // Don't render if closed
  if (viewMode === 'closed') return null;
  
  // MINIMIZED MODE - Very small draggable window
  if (viewMode === 'minimized') {
    return (
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0}
        initial={{ x: window.innerWidth - 250, y: window.innerHeight - 250 }}
        animate={{ x: window.innerWidth - 250, y: window.innerHeight - 250 }}
        className="fixed z-[100] cursor-move"
        style={{ touchAction: 'none', left: 0, top: 0 }}
      >
        <div className="w-[220px] rounded-lg overflow-hidden shadow-2xl border-2 border-red-600 bg-gray-900">
          {/* Video Area */}
          <div className="relative aspect-video bg-gray-800 group">
            <div className="absolute inset-0 flex items-center justify-center">
              <Tv className="w-8 h-8 text-white/30" />
            </div>
            
            {/* LIVE badge */}
            <div className="absolute top-1 left-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
              <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
              LIVE
            </div>
            
            {/* Controls overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 flex items-center justify-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMode('theater');
                }}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                title="Expand"
              >
                <Maximize2 className="w-4 h-4 text-white" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
                title="Close"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          
          {/* Title bar */}
          <div className="px-2 py-1 bg-gray-900">
            <p className="text-white text-[10px] font-semibold truncate">{streamTitle}</p>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // THEATER MODE - Medium size, centered, draggable
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none">
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        className="w-11/12 md:w-3/4 lg:w-1/2 max-w-3xl pointer-events-auto"
        style={{ touchAction: 'none' }}
      >
        <div className={`rounded-xl overflow-hidden shadow-2xl border-2 border-red-600 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Video Area */}
          <div className="relative aspect-video bg-gray-800">
            {/* Drag handle at top - LOWER z-index, doesn't block buttons */}
            <div className="absolute top-0 left-0 right-0 h-10 z-[5] flex items-center justify-center group pointer-events-none">
              <div className="w-12 h-1 bg-white/30 group-hover:bg-white/50 rounded-full transition-colors cursor-move pointer-events-auto"></div>
            </div>
            
            {/* Video placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Tv className="w-16 h-16 text-white/30" />
            </div>
            
            {/* Top Bar - HIGHER z-index to be clickable */}
            <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent z-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* LIVE badge */}
                  <div className="bg-black/40 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
                    LIVE
                  </div>
                  
                  {/* Viewer count */}
                  <div className="bg-black/40 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {viewerCount > 1000 ? `${(viewerCount / 1000).toFixed(1)}k` : viewerCount}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Minimize button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewMode('minimized');
                    }}
                    className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
                    title="Minimize to small window"
                  >
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>
                  
                  {/* Close button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClose();
                    }}
                    className="w-8 h-8 rounded-full bg-black/40 hover:bg-red-600 flex items-center justify-center transition-colors"
                    title="Close TV"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Center Play Button */}
            <AnimatePresence>
              {showControls && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setIsPaused(!isPaused); 
                    }} 
                    className="w-14 h-14 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                  >
                    {isPaused ? (
                      <Play className="w-7 h-7 text-white ml-1" />
                    ) : (
                      <Pause className="w-7 h-7 text-white" />
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
              {/* Progress Bar */}
              <div className="mb-2">
                <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-red-600" 
                    initial={{ width: '0%' }} 
                    animate={{ width: '35%' }} 
                  />
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setIsPaused(!isPaused); 
                    }} 
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    {isPaused ? (
                      <Play className="w-4 h-4 text-white" />
                    ) : (
                      <Pause className="w-4 h-4 text-white" />
                    )}
                  </button>
                  
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setIsMuted(!isMuted); 
                    }} 
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                  
                  <div className="text-white text-xs font-medium">LIVE</div>
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Settings Menu */}
                  <div className="relative">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setShowQualityMenu(!showQualityMenu); 
                      }} 
                      className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                      <Settings className="w-4 h-4 text-white" />
                    </button>
                    
                    <AnimatePresence>
                      {showQualityMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: 10 }} 
                          className={`absolute bottom-full right-0 mb-2 p-2 rounded-lg shadow-xl min-w-[100px] ${
                            theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                          }`}
                        >
                          {['auto', '1080p', '720p', '480p'].map((q) => (
                            <button 
                              key={q} 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setQuality(q as any); 
                                setShowQualityMenu(false); 
                              }} 
                              className={`w-full text-left px-3 py-2 rounded text-xs font-medium transition-colors ${
                                quality === q
                                  ? 'bg-red-600 text-white'
                                  : theme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {q}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Info Section */}
          <div className={`p-3 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <h2 className={`text-base font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {streamTitle}
            </h2>
            <p className={`text-xs mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {streamerName}
            </p>
            
            {/* Cowrie Spray */}
            <div className="relative inline-block">
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setShowCowrieMenu(!showCowrieMenu); 
                }} 
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white text-xs font-semibold transition-colors"
              >
                <Coins className="w-4 h-4" />
                Spray Cowries
              </button>
              
              <AnimatePresence>
                {showCowrieMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: 10 }} 
                    className={`absolute bottom-full left-0 mb-2 p-2 rounded-lg shadow-xl ${
                      theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <p className={`text-xs font-semibold mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Choose amount
                    </p>
                    <div className="grid grid-cols-3 gap-1">
                      {cowrieAmounts.map((amount) => (
                        <button 
                          key={amount} 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            handleCowrieSpray(amount); 
                          }} 
                          className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                            theme === 'dark'
                              ? 'bg-gray-700 hover:bg-gray-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                          }`}
                        >
                          {amount >= 1000 ? `${amount / 1000}k` : amount} 🪙
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JollofTVBubble;
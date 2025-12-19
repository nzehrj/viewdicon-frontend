// src/components/tv/TVPlayerCore.tsx
// Core TV Player - Handles playback, controls, and mode switching

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Settings, 
  Maximize2,
  Minimize2,
  Users,
  Coins,
  MessageSquare,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { 
  setTVMode, 
  togglePlay, 
  toggleMute, 
  setVolume, 
  setQuality,
  recordViewerInteraction,
  triggerTVCowrieRain,
  hideTVCowrieRain,
} from '@/store/slices/tvSlice';
import type { TVMode, StreamQuality } from '@/types/tv/tv.types';
import { LiveIndicator } from './LiveIndicator';
import { SorosokeOverlay } from './SorosokeOverlay';
import { CowrieRainOverlay } from './CowrieRainOverlay';

interface TVPlayerCoreProps {
  channelId: string;
  programTitle: string;
  programDescription?: string;
  streamerName?: string;
  viewerCount: number;
  isLive: boolean;
  onModeChange?: (mode: TVMode) => void;
  onClose?: () => void;
}

export const TVPlayerCore: React.FC<TVPlayerCoreProps> = ({
  channelId: _channelId,
  programTitle,
  programDescription,
  streamerName,
  viewerCount,
  isLive,
  onModeChange,
  onClose: _onClose,
}) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const player = useAppSelector((state) => state.tv.player);
  const sorosoke = useAppSelector((state) => state.tv.sorosoke);
  
  const [showControls, setShowControls] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [showCowrieMenu, setShowCowrieMenu] = useState(false);
  const [showSorosokeOverlay, setShowSorosokeOverlay] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  
  const qualityOptions: StreamQuality[] = ['auto', '1080p', '720p', '480p', '360p'];
  const cowrieAmounts = [10, 50, 100, 500, 1000, 5000];

  // Auto-hide controls
  useEffect(() => {
    if (showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (player.isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, player.isPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
    dispatch(recordViewerInteraction());
  };

  const handlePlayPause = () => {
    dispatch(togglePlay());
    dispatch(recordViewerInteraction());
  };

  const handleMuteToggle = () => {
    dispatch(toggleMute());
    dispatch(recordViewerInteraction());
  };

  const handleVolumeChange = (newVolume: number) => {
    dispatch(setVolume(newVolume));
    dispatch(recordViewerInteraction());
  };

  const handleQualityChange = (quality: StreamQuality) => {
    dispatch(setQuality(quality));
    setShowQualityMenu(false);
    dispatch(recordViewerInteraction());
  };

  const handleModeChange = (mode: TVMode) => {
    dispatch(setTVMode(mode));
    onModeChange?.(mode);
    dispatch(recordViewerInteraction());
  };

  const handleCowrieSpray = (amount: number) => {
    console.log(`🪙 Sprayed ${amount} Cowries!`);
    setShowCowrieMenu(false);
    dispatch(recordViewerInteraction());
    
    // ✅ Trigger cowrie rain animation
    dispatch(triggerTVCowrieRain(amount));
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      dispatch(hideTVCowrieRain());
    }, 5000);
  };

  return (
    <div 
      className="relative w-full h-full bg-black group"
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
    >
      {/* Video Player Area */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Placeholder for actual video stream */}
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <Play className="w-12 h-12 text-white/50" />
            </div>
            <p className="text-white/50 text-sm">Stream Loading...</p>
          </div>
        </div>
      </div>

      {/* Live Indicator */}
      {isLive && (
        <div className="absolute top-4 left-4 z-30">
          <LiveIndicator viewerCount={viewerCount} />
        </div>
      )}

      {/* Sorosoke Active Indicator */}
      {sorosoke.isActive && (
        <div className="absolute top-4 right-4 z-30">
          <button
            onClick={() => setShowSorosokeOverlay(true)}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white text-sm font-semibold transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Call In Active
          </button>
        </div>
      )}

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20"
          >
            {/* Top Gradient */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
            
            {/* Bottom Gradient with Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
              {/* Progress Bar */}
              {isLive && (
                <div className="mb-4">
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-red-600"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3600, ease: 'linear' }}
                    />
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Play/Pause */}
                  <button
                    onClick={handlePlayPause}
                    className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  >
                    {player.isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" />
                    )}
                  </button>

                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleMuteToggle}
                      className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                      {player.isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={player.isMuted ? 0 : player.volume}
                      onChange={(e) => handleVolumeChange(Number(e.target.value))}
                      className="w-24 accent-white"
                    />
                  </div>

                  {/* Live Badge */}
                  {isLive && (
                    <div className="px-3 py-1 bg-red-600 rounded text-white text-sm font-bold">
                      LIVE
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Quality Settings */}
                  <div className="relative">
                    <button
                      onClick={() => setShowQualityMenu(!showQualityMenu)}
                      className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                      <Settings className="w-5 h-5 text-white" />
                    </button>

                    <AnimatePresence>
                      {showQualityMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className={`absolute bottom-full right-0 mb-2 p-2 rounded-lg shadow-xl min-w-[120px] ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                          }`}
                        >
                          {qualityOptions.map((quality) => (
                            <button
                              key={quality}
                              onClick={() => handleQualityChange(quality)}
                              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                player.quality === quality
                                  ? 'bg-red-600 text-white'
                                  : theme === 'dark'
                                  ? 'text-gray-300 hover:bg-gray-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {quality}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mode Buttons */}
                  {player.mode === 'fullscreen' && (
                    <button
                      onClick={() => handleModeChange('bubble')}
                      className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                      <Minimize2 className="w-5 h-5 text-white" />
                    </button>
                  )}
                  {player.mode !== 'fullscreen' && (
                    <button
                      onClick={() => handleModeChange('fullscreen')}
                      className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                    >
                      <Maximize2 className="w-5 h-5 text-white" />
                    </button>
                  )}
                </div>
              </div>

              {/* Program Info */}
              <div className="mb-4">
                <h3 className="text-white font-bold text-lg mb-1">{programTitle}</h3>
                {programDescription && (
                  <p className="text-white/70 text-sm mb-2">{programDescription}</p>
                )}
                {streamerName && (
                  <p className="text-white/60 text-sm">{streamerName}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Cowrie Spray */}
                <div className="relative">
                  <button
                    onClick={() => setShowCowrieMenu(!showCowrieMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 rounded-lg text-white font-semibold transition-colors"
                  >
                    <Coins className="w-5 h-5" />
                    Spray Cowries
                  </button>

                  <AnimatePresence>
                    {showCowrieMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`absolute bottom-full left-0 mb-2 p-3 rounded-lg shadow-xl ${
                          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}
                      >
                        <p className={`text-sm font-semibold mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Choose amount
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {cowrieAmounts.map((amount) => (
                            <button
                              key={amount}
                              onClick={() => handleCowrieSpray(amount)}
                              className={`px-3 py-2 rounded text-sm font-semibold transition-colors ${
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

                {/* Viewer Count */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">
                    {viewerCount > 1000 ? `${(viewerCount / 1000).toFixed(1)}k` : viewerCount}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sorosoke Overlay */}
      <SorosokeOverlay
        isOpen={showSorosokeOverlay}
        onClose={() => setShowSorosokeOverlay(false)}
      />

      {/* Cowrie Rain Effect */}
      <CowrieRainOverlay />
    </div>
  );
};

export default TVPlayerCore;
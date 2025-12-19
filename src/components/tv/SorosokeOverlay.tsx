// src/components/tv/SorosokeOverlay.tsx
// Sorosoke Call-In System Overlay - Simplified Version

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Video, MessageSquare, Users } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface SorosokeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onCallIn?: (callType: 'voice' | 'video' | 'text') => void;
}

export const SorosokeOverlay: React.FC<SorosokeOverlayProps> = ({
  isOpen,
  onClose,
  onCallIn,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [selectedCallType, setSelectedCallType] = useState<'voice' | 'video' | 'text'>('voice');
  const [isInQueue, setIsInQueue] = useState(false);
  const queuePosition = 5; // Mock queue position

  const handleCallIn = () => {
    console.log('🎙️ Calling in with type:', selectedCallType);
    setIsInQueue(true);
    onCallIn?.(selectedCallType);
  };

  const handleLeaveQueue = () => {
    console.log('👋 Leaving queue');
    setIsInQueue(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Panel */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full md:w-[500px] max-h-[80vh] overflow-y-auto rounded-t-3xl md:rounded-2xl ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          } shadow-2xl`}
        >
          {/* Header */}
          <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div>
              <h2 className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Sọ̀rọ̀ Sókè 📣
              </h2>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Call in to share your voice
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Queue Stats */}
            <div className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  <span className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Queue Status
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Active
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    In Queue
                  </p>
                  <p className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    12
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Avg. Wait
                  </p>
                  <p className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    8m
                  </p>
                </div>
              </div>
            </div>

            {/* User's Current Call Status */}
            {isInQueue && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`p-4 rounded-xl border-2 border-purple-500 bg-purple-500/10`}
              >
                <p className="font-semibold text-lg mb-2">
                  ⏳ You&apos;re in the queue!
                </p>
                <p className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Position: <span className="font-bold">#{queuePosition}</span>
                </p>
                <p className={`text-sm mb-3 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Estimated wait: <span className="font-bold">~{queuePosition * 2}m</span>
                </p>
                <button 
                  onClick={handleLeaveQueue}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Leave Queue
                </button>
              </motion.div>
            )}

            {/* Call Type Selection */}
            {!isInQueue && (
              <>
                <div>
                  <p className={`text-sm font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Choose Call Type
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setSelectedCallType('voice')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                        selectedCallType === 'voice'
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                          : theme === 'dark'
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Phone className="w-6 h-6" />
                      <span className="text-xs font-semibold">Voice</span>
                    </button>
                    <button
                      onClick={() => setSelectedCallType('video')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                        selectedCallType === 'video'
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                          : theme === 'dark'
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Video className="w-6 h-6" />
                      <span className="text-xs font-semibold">Video</span>
                    </button>
                    <button
                      onClick={() => setSelectedCallType('text')}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                        selectedCallType === 'text'
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                          : theme === 'dark'
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <MessageSquare className="w-6 h-6" />
                      <span className="text-xs font-semibold">Text</span>
                    </button>
                  </div>
                </div>

                {/* Call In Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCallIn}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg"
                >
                  🎙️ Call In Now
                </motion.button>
              </>
            )}

            {/* Info */}
            <div className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
            }`}>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                💡 <span className="font-semibold">Tips:</span> Be respectful, stay on topic, and keep your points concise. The Respect Filter is active.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SorosokeOverlay;
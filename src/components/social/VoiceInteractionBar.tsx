// src/components/social/VoiceInteractionBar.tsx
// Voice Interaction Bar - Voice-Specific Engagement

import React from 'react';
import { Mic, Volume2, Headphones, Radio } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface VoiceInteractionBarProps {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  listeners: number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onListen: () => void;
  compact?: boolean;
}

export const VoiceInteractionBar: React.FC<VoiceInteractionBarProps> = ({
  isPlaying,
  duration,
  currentTime,
  listeners,
  onPlay,
  onPause,
  onSeek,
  onListen,
  compact = false,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`
      ${compact ? 'p-3' : 'p-4'} rounded-xl
      ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'}
    `}>
      {/* Voice Type Indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-500/20">
          <Mic className="w-3 h-3 text-purple-500" />
          <span className="text-xs font-semibold text-purple-500">Voice Post</span>
        </div>
        {listeners > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20">
            <Headphones className="w-3 h-3 text-blue-500" />
            <span className="text-xs font-semibold text-blue-500">{listeners}</span>
          </div>
        )}
      </div>

      {/* Waveform/Progress Bar */}
      <div className="mb-3">
        <div
          className={`h-12 rounded-lg overflow-hidden cursor-pointer ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
            onSeek(duration * percentage);
          }}
        >
          {/* Animated Waveform Effect */}
          <div className="h-full flex items-center justify-around px-1 gap-0.5">
            {Array.from({ length: 40 }).map((_, i) => {
              const height = Math.random() * 60 + 20;
              const isActive = (i / 40) * 100 < progress;
              
              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all ${
                    isActive
                      ? 'bg-purple-500'
                      : theme === 'dark'
                      ? 'bg-gray-600'
                      : 'bg-gray-300'
                  }`}
                  style={{
                    height: `${height}%`,
                    animation: isPlaying ? `pulse ${Math.random() * 0.5 + 0.5}s infinite` : 'none',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Time Display */}
        <div className={`flex items-center justify-between mt-2 text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Play/Pause */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 flex items-center justify-center transition-all shadow-lg"
        >
          {isPlaying ? (
            <div className="flex gap-1">
              <div className="w-1 h-4 bg-white rounded-full" />
              <div className="w-1 h-4 bg-white rounded-full" />
            </div>
          ) : (
            <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent ml-1" />
          )}
        </button>

        {/* Listen Count Button */}
        <button
          onClick={onListen}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl transition-all
            ${theme === 'dark'
              ? 'bg-gray-700 hover:bg-gray-600 text-white'
              : 'bg-white hover:bg-gray-50 text-gray-900'
            }
          `}
        >
          <Volume2 className="w-4 h-4" />
          <span className="text-sm font-semibold">Listen</span>
        </button>

        {/* Live Indicator (if applicable) */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20">
          <Radio className="w-4 h-4 text-red-500 animate-pulse" />
          <span className="text-xs font-bold text-red-500">LIVE</span>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default VoiceInteractionBar;
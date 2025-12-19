// src/components/tv/ProgramCard.tsx
// Program Card - Individual TV Program Display

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Bell, Play } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface Program {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  channelName: string;
  channelColor: string;
  thumbnail?: string;
  isLive: boolean;
  isUpcoming: boolean;
  viewerCount?: number;
  duration: number; // in minutes
}

interface ProgramCardProps {
  program: Program;
  onWatch?: (programId: string) => void;
  onSetReminder?: (programId: string) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onWatch,
  onSetReminder,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-xl overflow-hidden border ${
        program.isLive
          ? 'border-red-500 bg-red-500/5'
          : theme === 'dark'
          ? 'border-gray-800 bg-gray-800/50'
          : 'border-gray-200 bg-white'
      } shadow-lg hover:shadow-xl transition-all`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-black overflow-hidden">
        {program.thumbnail ? (
          <img
            src={program.thumbnail}
            alt={program.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-white text-4xl font-bold"
            style={{ backgroundColor: program.channelColor }}
          >
            {program.title.substring(0, 2).toUpperCase()}
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {program.isLive ? (
            <div className="bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE NOW
            </div>
          ) : program.isUpcoming ? (
            <div className="bg-purple-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-lg">
              Upcoming
            </div>
          ) : (
            <div className={`${
              theme === 'dark' ? 'bg-gray-800' : 'bg-black/60'
            } text-white text-sm font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm`}>
              Scheduled
            </div>
          )}
        </div>

        {/* Viewer Count (if live) */}
        {program.isLive && program.viewerCount && (
          <div className="absolute top-3 right-3 bg-black/80 text-white text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
            <Users className="w-4 h-4" />
            {program.viewerCount >= 1000
              ? `${(program.viewerCount / 1000).toFixed(1)}K`
              : program.viewerCount}
          </div>
        )}

        {/* Play Overlay (for live programs) */}
        {program.isLive && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onWatch?.(program.id)}
              className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center shadow-2xl"
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Channel Badge */}
        <div className="mb-3">
          <span 
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: program.channelColor }}
          >
            {program.channelName}
          </span>
        </div>

        {/* Title */}
        <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {program.title}
        </h3>

        {/* Description */}
        <p className={`text-sm mb-3 line-clamp-2 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {program.description}
        </p>

        {/* Time & Duration */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className={`w-4 h-4 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {formatTime(program.startTime)} - {formatTime(program.endTime)}
            </span>
          </div>
          <span className={`text-sm ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            •
          </span>
          <span className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {formatDuration(program.duration)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {program.isLive ? (
            <button
              onClick={() => onWatch?.(program.id)}
              className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4" />
              Watch Now
            </button>
          ) : program.isUpcoming ? (
            <>
              <button
                onClick={() => onWatch?.(program.id)}
                className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Preview
              </button>
              <button
                onClick={() => onSetReminder?.(program.id)}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-all"
              >
                <Bell className="w-4 h-4" />
                Remind Me
              </button>
            </>
          ) : (
            <button
              onClick={() => onSetReminder?.(program.id)}
              className={`flex-1 py-2.5 rounded-lg font-semibold transition-all ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              More Info
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProgramCard;
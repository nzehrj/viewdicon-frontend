// src/components/tv/TVScheduler.tsx
// TV Scheduler - 7-Day Electronic Program Guide (EPG)

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { ProgramCard } from './ProgramCard';

interface Program {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  channelName: string;
  channelId: string;
  channelColor: string;
  thumbnail?: string;
  isLive: boolean;
  isUpcoming: boolean;
  viewerCount?: number;
  duration: number;
}

interface TVSchedulerProps {
  programs: Program[];
  isOpen: boolean;
  onClose: () => void;
  onWatchProgram?: (programId: string) => void;
  onSetReminder?: (programId: string) => void;
}

export const TVScheduler: React.FC<TVSchedulerProps> = ({
  programs,
  isOpen,
  onClose,
  onWatchProgram,
  onSetReminder,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterChannel, setFilterChannel] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Generate 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Get unique channels
  const channels = [...new Set(programs.map(p => ({ id: p.channelId, name: p.channelName, color: p.channelColor })))];

  // Filter programs
  const filteredPrograms = programs.filter(p => {
    const programDate = new Date(p.startTime).toDateString();
    const matchesDate = programDate === selectedDate.toDateString();
    const matchesChannel = !filterChannel || p.channelId === filterChannel;
    return matchesDate && matchesChannel;
  });

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center pb-20 md:pb-0">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`relative w-full md:max-w-6xl max-h-[90vh] overflow-hidden rounded-t-3xl md:rounded-2xl ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        } shadow-2xl`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              TV Guide
            </h2>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {filteredPrograms.length} programs • {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg ${
                showFilters
                  ? 'bg-purple-600 text-white'
                  : theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Date Navigation */}
        <div className={`sticky top-[88px] z-10 flex items-center gap-2 p-4 border-b ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <button
            onClick={() => navigateDate('prev')}
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 flex gap-2 overflow-x-auto">
            {dates.map((date) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-xs">{date.getDate()}</div>
                    {isToday && <div className="text-xs opacity-80">Today</div>}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => navigateDate('next')}
            className={`p-2 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Filter */}
        {showFilters && (
          <div className={`sticky top-[176px] z-10 p-4 border-b ${
            theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setFilterChannel(null)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  !filterChannel
                    ? 'bg-purple-600 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Channels
              </button>
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setFilterChannel(channel.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                    filterChannel === channel.id
                      ? 'text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={filterChannel === channel.id ? { backgroundColor: channel.color } : {}}
                >
                  {channel.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Program Grid */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: showFilters ? 'calc(90vh - 280px)' : 'calc(90vh - 240px)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onWatch={onWatchProgram}
                onSetReminder={onSetReminder}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredPrograms.length === 0 && (
            <div className="text-center py-12">
              <Calendar className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-700' : 'text-gray-300'
              }`} />
              <p className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                No programs scheduled
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Try selecting a different date or channel
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TVScheduler;
// src/components/tv/ChannelGrid.tsx
// TV Channel Grid - All Available Channels

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Users, Globe, MapPin, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { startTV } from '@/store/slices/tvSlice';

interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'village' | 'regional' | 'national' | 'pan-african';
  isLive: boolean;
  viewerCount: number;
  thumbnail?: string;
  color: string;
  currentProgram?: {
    title: string;
    startTime: string;
  };
}

interface ChannelGridProps {
  channels: Channel[];
  isOpen: boolean;
  onClose: () => void;
  onChannelSelect?: (channelId: string) => void;
}

export const ChannelGrid: React.FC<ChannelGridProps> = ({
  channels,
  isOpen,
  onClose,
  onChannelSelect,
}) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const [filter, setFilter] = useState<'all' | 'village' | 'regional' | 'national' | 'pan-african'>('all');

  const filteredChannels = filter === 'all' 
    ? channels 
    : channels.filter(ch => ch.type === filter);

  const liveCount = filteredChannels.filter(ch => ch.isLive).length;

  const handleChannelClick = (channelId: string) => {
    if (onChannelSelect) {
      onChannelSelect(channelId);
    } else {
      dispatch(startTV({ channelId, mode: 'bubble' }));
    }
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'village': return MapPin;
      case 'regional': return Radio;
      case 'national': return Globe;
      case 'pan-african': return Globe;
      default: return Radio;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'village': return '#10b981';
      case 'regional': return '#3b82f6';
      case 'national': return '#8b5cf6';
      case 'pan-african': return '#ec4899';
      default: return '#6b7280';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
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
        className={`relative w-full md:max-w-4xl max-h-[90vh] overflow-hidden rounded-t-3xl md:rounded-2xl ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        } shadow-2xl`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div>
            <h2 className={`text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent`}>
              Jollof TV Channels
            </h2>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {liveCount} channels live now • {filteredChannels.length} total
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

        {/* Filter Tabs */}
        <div className={`sticky top-[88px] z-10 flex gap-2 px-6 py-3 overflow-x-auto border-b ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          {['all', 'village', 'regional', 'national', 'pan-african'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                filter === type
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'All Channels' : type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Channel Grid */}
        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 160px)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChannels.map((channel) => {
              const TypeIcon = getTypeIcon(channel.type);
              const typeColor = getTypeColor(channel.type);

              return (
                <motion.button
                  key={channel.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleChannelClick(channel.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    channel.isLive
                      ? 'border-purple-600 bg-purple-600/5'
                      : theme === 'dark'
                      ? 'border-gray-800 bg-gray-800/50 hover:border-gray-700'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative mb-3 aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-black">
                    {channel.thumbnail ? (
                      <img
                        src={channel.thumbnail}
                        alt={channel.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center text-white text-3xl font-bold"
                        style={{ backgroundColor: channel.color }}
                      >
                        {channel.name.substring(0, 2)}
                      </div>
                    )}

                    {/* Live Badge */}
                    {channel.isLive && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        LIVE
                      </div>
                    )}

                    {/* Type Badge */}
                    <div 
                      className="absolute top-2 right-2 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"
                      style={{ backgroundColor: typeColor }}
                    >
                      <TypeIcon className="w-3 h-3" />
                      {channel.type.split('-')[0].toUpperCase()}
                    </div>

                    {/* Viewer Count */}
                    {channel.viewerCount > 0 && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {channel.viewerCount >= 1000
                          ? `${(channel.viewerCount / 1000).toFixed(1)}K`
                          : channel.viewerCount}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className={`font-bold mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {channel.name}
                  </h3>
                  
                  <p className={`text-xs mb-2 line-clamp-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {channel.description}
                  </p>

                  {/* Current Program */}
                  {channel.currentProgram && (
                    <div className={`text-xs font-medium ${
                      channel.isLive ? 'text-purple-600' : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {channel.isLive ? '📡 ' : '⏰ '}
                      {channel.currentProgram.title}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredChannels.length === 0 && (
            <div className="text-center py-12">
              <Radio className={`w-16 h-16 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-700' : 'text-gray-300'
              }`} />
              <p className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                No channels found
              </p>
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Try selecting a different filter
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ChannelGrid;
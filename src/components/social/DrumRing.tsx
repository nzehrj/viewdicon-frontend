// src/components/social/DrumRing.tsx
// Drum Ring - Share System with 17 Real Villages + Feed Types

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, X } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface DrumRingProps {
  postId: string;
  postUrl: string;
  onDrumToVillage?: (villageId: string) => void;
  onDrumToFeed?: (feedType: string) => void;
  onCopyLink?: () => void;
  onClose: () => void;
}

export const DrumRing: React.FC<DrumRingProps> = ({
  postId: _postId,
  postUrl,
  onDrumToVillage,
  onDrumToFeed,
  onCopyLink,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      onCopyLink?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  // Real 17 Villages from Viewdicon
  const villages = [
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', members: 24567, color: '#3b82f6' },
    { id: 'construction', name: 'Construction', icon: '🏗️', members: 18234, color: '#10b981' },
    { id: 'agriculture', name: 'Agriculture', icon: '🌾', members: 15432, color: '#22c55e' },
    { id: 'technology', name: 'Technology', icon: '💻', members: 32145, color: '#8b5cf6' },
    { id: 'education', name: 'Education', icon: '📚', members: 28765, color: '#f59e0b' },
    { id: 'finance', name: 'Finance', icon: '💰', members: 19876, color: '#10b981' },
    { id: 'logistics', name: 'Logistics', icon: '🚚', members: 14567, color: '#ef4444' },
    { id: 'hospitality', name: 'Hospitality', icon: '🍽️', members: 12453, color: '#f97316' },
    { id: 'creative', name: 'Creative', icon: '🎨', members: 21098, color: '#ec4899' },
    { id: 'legal', name: 'Legal', icon: '⚖️', members: 9876, color: '#6366f1' },
    { id: 'governance', name: 'Governance', icon: '🏛️', members: 16543, color: '#dc2626' },
    { id: 'spiritual', name: 'Spiritual', icon: '🕯️', members: 13245, color: '#6366f1' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎭', members: 25678, color: '#8b5cf6' },
    { id: 'sports', name: 'Sports', icon: '⚽', members: 19234, color: '#10b981' },
    { id: 'crafts', name: 'Crafts', icon: '🪡', members: 11234, color: '#f59e0b' },
    { id: 'security', name: 'Security', icon: '🛡️', members: 8765, color: '#ef4444' },
    { id: 'transport', name: 'Transport', icon: '🚗', members: 13456, color: '#3b82f6' },
  ];

  // Feed Types
  const feedTypes = [
    { id: 'village', name: 'Village Feed', icon: '🏘️', description: 'Professional village' },
    { id: 'family', name: 'Family Circle', icon: '👨‍👩‍👧‍👦', description: 'Family & clan' },
    { id: 'motion', name: 'Motion', icon: '🎬', description: 'Short videos' },
    { id: 'gallery', name: 'Gallery', icon: '🖼️', description: 'Photo showcase' },
    { id: 'voice', name: 'Voice Square', icon: '🎤', description: 'Voice discussions' },
    { id: 'spotlight', name: 'Spotlight', icon: '✨', description: 'Trending content' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full max-w-md rounded-2xl overflow-hidden shadow-2xl max-h-[80vh] overflow-y-auto
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
        `}
      >
        {/* Header */}
        <div className={`sticky top-0 p-4 border-b flex items-center justify-between ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-green-500" />
            <h3 className={`font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Drum the Word
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className={`
              w-full p-4 rounded-xl flex items-center justify-between transition-all
              ${theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
              }
            `}
          >
            <div className="flex items-center gap-3">
              {copied ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
              <span className={`font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {copied ? 'Link Copied!' : 'Copy Link'}
              </span>
            </div>
          </button>

          {/* Drum to Villages */}
          <div>
            <h4 className={`text-sm font-bold mb-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Drum to Villages
            </h4>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
              {villages.map((village) => (
                <button
                  key={village.id}
                  onClick={() => onDrumToVillage?.(village.id)}
                  className={`
                    p-3 rounded-xl text-left transition-all
                    ${theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-50 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{village.icon}</span>
                    <span className={`font-semibold text-xs ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {village.name}
                    </span>
                  </div>
                  <span className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {village.members.toLocaleString()} members
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Drum to Feeds */}
          <div>
            <h4 className={`text-sm font-bold mb-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Drum to Feeds
            </h4>
            <div className="space-y-2">
              {feedTypes.map((feed) => (
                <button
                  key={feed.id}
                  onClick={() => onDrumToFeed?.(feed.id)}
                  className={`
                    w-full p-3 rounded-xl flex items-center gap-3 text-left transition-all
                    ${theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-50 hover:bg-gray-100'
                    }
                  `}
                >
                  <span className="text-2xl">{feed.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feed.name}
                    </p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {feed.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DrumRing;
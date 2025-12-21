// src/components/cultural/StoryCircle.tsx
// Story Circle - Interactive Storytelling Platform

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Mic,
  Play,
  Pause,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Clock,
  Volume2,
  Sparkles
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface Story {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  storyteller: {
    name: string;
    avatar?: string;
    title: string;
    storiesShared: number;
  };
  category: 'folklore' | 'history' | 'personal' | 'myth' | 'legend';
  audioUrl?: string;
  duration?: number;
  listeners: number;
  hearts: number;
  comments: number;
  isLive: boolean;
  tags: string[];
  createdAt: string;
}

interface StoryCircleProps {
  onJoinCircle?: () => void;
  onShareStory?: () => void;
}

export const StoryCircle: React.FC<StoryCircleProps> = ({
  onJoinCircle,
  onShareStory,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filter, setFilter] = useState<'all' | 'folklore' | 'history' | 'personal' | 'myth' | 'legend'>('all');

  // Mock data - replace with API
  const stories: Story[] = [
    {
      id: '1',
      title: 'The Tale of Anansi the Spider',
      excerpt: 'How Anansi brought wisdom to the world and scattered it across the lands...',
      content: 'Long ago, when the world was young, Anansi the Spider went to Nyame, the Sky God, and asked for all the wisdom in the world. Nyame agreed, but warned that wisdom is meant to be shared...',
      storyteller: {
        name: 'Mama Adwoa',
        title: 'Keeper of Stories',
        storiesShared: 247,
      },
      category: 'folklore',
      duration: 840, // 14 minutes in seconds
      listeners: 1234,
      hearts: 456,
      comments: 89,
      isLive: false,
      tags: ['anansi', 'wisdom', 'ghana', 'akan'],
      createdAt: '2025-01-10',
    },
    {
      id: '2',
      title: 'The Great Walls of Benin',
      excerpt: 'The engineering marvel that protected a kingdom for centuries...',
      content: 'In the heart of West Africa stood the mighty Kingdom of Benin, protected by walls that stretched further than the Great Wall of China...',
      storyteller: {
        name: 'Elder Osagie',
        title: 'History Guardian',
        storiesShared: 189,
      },
      category: 'history',
      duration: 1020, // 17 minutes
      listeners: 892,
      hearts: 234,
      comments: 45,
      isLive: true,
      tags: ['benin', 'kingdom', 'architecture', 'heritage'],
      createdAt: '2025-01-15',
    },
    {
      id: '3',
      title: 'Queen Amina of Zazzau',
      excerpt: 'The warrior queen who expanded her kingdom through strength and wisdom...',
      content: 'In the 16th century, a young princess named Amina rose to become one of the greatest military leaders West Africa has ever known...',
      storyteller: {
        name: 'Aisha Musa',
        title: 'Legend Keeper',
        storiesShared: 156,
      },
      category: 'legend',
      duration: 960,
      listeners: 2341,
      hearts: 678,
      comments: 112,
      isLive: false,
      tags: ['warrior', 'queen', 'nigeria', 'hausa'],
      createdAt: '2025-01-12',
    },
  ];

  const filteredStories = filter === 'all' 
    ? stories 
    : stories.filter(s => s.category === filter);

  const getCategoryColor = (category: string) => {
    const colors = {
      folklore: 'from-purple-600 to-pink-600',
      history: 'from-amber-600 to-orange-600',
      personal: 'from-green-600 to-emerald-600',
      myth: 'from-blue-600 to-indigo-600',
      legend: 'from-red-600 to-rose-600',
    };
    return colors[category as keyof typeof colors] || 'from-gray-600 to-gray-700';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-90" />
        
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-48 h-48 border-4 border-white rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-32 h-32 border-4 border-white rounded-full"
          />
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 text-white" />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="w-10 h-10 text-white" />
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  Story Circle
                </h1>
              </div>
              <p className="text-lg text-white/90 mb-6">
                Where ancient tales meet modern voices
              </p>

              {/* Live Circle Indicator */}
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                  </div>
                  <span className="font-semibold">2 Live Stories</span>
                </div>
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {stories.reduce((sum, s) => sum + s.listeners, 0).toLocaleString()} Listeners
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onJoinCircle}
            className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
          >
            <Mic className="w-6 h-6" />
            Join Live Circle
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onShareStory}
            className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
          >
            <BookOpen className="w-6 h-6" />
            Share Your Story
          </motion.button>
        </div>

        {/* Category Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {['all', 'folklore', 'history', 'personal', 'myth', 'legend'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat as any)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  filter === cat
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story, index) => {
            const categoryGradient = getCategoryColor(story.category);

            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedStory(story)}
                className={`rounded-2xl overflow-hidden cursor-pointer ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-lg hover:shadow-2xl transition-all border ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                {/* Header with Category Gradient */}
                <div className={`h-32 bg-gradient-to-br ${categoryGradient} relative overflow-hidden p-4 flex flex-col justify-between`}>
                  <div className="absolute inset-0 opacity-20">
                    <BookOpen className="w-full h-full" />
                  </div>

                  <div className="relative z-10 flex justify-between">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold">
                      {story.category.toUpperCase()}
                    </span>
                    {story.isLive && (
                      <div className="flex items-center gap-1 bg-red-500 px-2 py-1 rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-white text-xs font-bold">LIVE</span>
                      </div>
                    )}
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-white text-xl font-bold line-clamp-2">
                      {story.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Storyteller */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                      {story.storyteller.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {story.storyteller.name}
                      </p>
                      <p className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {story.storyteller.title} • {story.storyteller.storiesShared} stories
                      </p>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <p className={`text-sm mb-4 line-clamp-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {story.excerpt}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {story.listeners}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {story.hearts}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {story.comments}
                        </span>
                      </div>
                    </div>
                    {story.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className={`font-semibold ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {formatDuration(story.duration)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {story.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          theme === 'dark' ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Listen Button */}
                  <button
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Volume2 className="w-5 h-5" />
                    Listen Now
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Story Detail Modal */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 pb-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStory(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } shadow-2xl`}
            >
              {/* Header */}
              <div className={`p-6 border-b ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <h2 className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {selectedStory.title}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                    {selectedStory.storyteller.name.charAt(0)}
                  </div>
                  <div>
                    <p className={`font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {selectedStory.storyteller.name}
                    </p>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {selectedStory.storyteller.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className={`text-base leading-relaxed mb-6 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {selectedStory.content}
                </p>

                {/* Audio Player */}
                <div className={`p-4 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                } mb-6`}>
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white hover:scale-105 transition-transform"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1 mx-4">
                      <div className={`h-2 rounded-full ${
                        theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                      }`}>
                        <div className="h-full w-1/3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                      </div>
                    </div>

                    <span className={`text-sm font-semibold ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {selectedStory.duration && formatDuration(selectedStory.duration)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    } transition-colors`}
                  >
                    <Heart className="w-5 h-5" />
                    {selectedStory.hearts}
                  </button>

                  <button
                    className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    } transition-colors`}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Comment
                  </button>

                  <button
                    className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    } transition-colors`}
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoryCircle;
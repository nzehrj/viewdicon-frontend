// src/components/cultural/ChallengeBoard.tsx
// Cultural Challenge Board - Main Dashboard

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Users, 
  Plus,
  Award,
  Sparkles
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'art' | 'music' | 'dance' | 'cuisine' | 'storytelling' | 'fashion';
  difficulty: 'beginner' | 'intermediate' | 'expert';
  heat: number;
  participants: number;
  deadline: string;
  prize: number;
  image?: string;
  creator: {
    name: string;
    avatar?: string;
  };
}

interface ChallengeBoardProps {
  onCreateChallenge?: () => void;
  onViewChallenge?: (challengeId: string) => void;
}

export const ChallengeBoard: React.FC<ChallengeBoardProps> = ({
  onCreateChallenge,
  onViewChallenge,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [filter, setFilter] = useState<'all' | 'art' | 'music' | 'dance' | 'cuisine' | 'storytelling' | 'fashion'>('all');
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'ending'>('hot');

  // Mock data - replace with API
  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Adire Pattern Design Challenge',
      description: 'Create a modern twist on traditional Yoruba Adire fabric patterns',
      category: 'art',
      difficulty: 'intermediate',
      heat: 1250,
      participants: 47,
      deadline: '2025-01-15',
      prize: 50000,
      creator: {
        name: 'Amara Okafor',
      },
    },
    {
      id: '2',
      title: 'Afrobeats Fusion Competition',
      description: 'Blend traditional African rhythms with modern electronic music',
      category: 'music',
      difficulty: 'expert',
      heat: 2100,
      participants: 89,
      deadline: '2025-01-20',
      prize: 100000,
      creator: {
        name: 'Kwame Mensah',
      },
    },
    {
      id: '3',
      title: 'Jollof Rice Recipe Showdown',
      description: 'Show us your best Jollof rice recipe and technique',
      category: 'cuisine',
      difficulty: 'beginner',
      heat: 890,
      participants: 156,
      deadline: '2025-01-10',
      prize: 25000,
      creator: {
        name: 'Fatima Hassan',
      },
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      art: 'from-purple-600 to-pink-600',
      music: 'from-amber-600 to-orange-600',
      dance: 'from-green-600 to-emerald-600',
      cuisine: 'from-red-600 to-rose-600',
      storytelling: 'from-blue-600 to-indigo-600',
      fashion: 'from-yellow-600 to-amber-600',
    };
    return colors[category as keyof typeof colors] || 'from-gray-600 to-gray-700';
  };

  const getDifficultyBadge = (difficulty: string) => {
    const badges = {
      beginner: { label: 'Beginner', color: 'bg-green-500' },
      intermediate: { label: 'Intermediate', color: 'bg-amber-500' },
      expert: { label: 'Expert', color: 'bg-red-500' },
    };
    return badges[difficulty as keyof typeof badges];
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Ended';
    if (days === 0) return 'Ending today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header with African Pattern */}
      <div className="relative overflow-hidden">
        <div className={`absolute inset-0 opacity-10 ${
          theme === 'dark' ? 'opacity-5' : 'opacity-10'
        }`}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-64 h-64 border-4 border-amber-500 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-48 h-48 border-4 border-green-500 rounded-full"
          />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Title Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-2`}>
                  Cultural Challenges
                </h1>
                <p className={`text-sm sm:text-base ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Showcase your skills, celebrate African culture
                </p>
              </div>

              {onCreateChallenge && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCreateChallenge}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Create Challenge
                </motion.button>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'
              } backdrop-blur-sm border ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span className={`text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Active
                  </span>
                </div>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {challenges.length}
                </p>
              </div>

              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'
              } backdrop-blur-sm border ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-green-500" />
                  <span className={`text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Participants
                  </span>
                </div>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {challenges.reduce((sum, c) => sum + c.participants, 0)}
                </p>
              </div>

              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'
              } backdrop-blur-sm border ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-5 h-5 text-red-500" />
                  <span className={`text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Total Heat
                  </span>
                </div>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {(challenges.reduce((sum, c) => sum + c.heat, 0) / 1000).toFixed(1)}K
                </p>
              </div>

              <div className={`p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'
              } backdrop-blur-sm border ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span className={`text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Prizes
                  </span>
                </div>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {(challenges.reduce((sum, c) => sum + c.prize, 0) / 1000).toFixed(0)}K ₵
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters and Content */}
      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        {/* Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex-1">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {['all', 'art', 'music', 'dance', 'cuisine', 'storytelling', 'fashion'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                    filter === cat
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
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

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
              theme === 'dark'
                ? 'bg-gray-800 text-white border-gray-700'
                : 'bg-white text-gray-900 border-gray-200'
            } border`}
          >
            <option value="hot">🔥 Hottest</option>
            <option value="new">✨ Newest</option>
            <option value="ending">⏰ Ending Soon</option>
          </select>
        </div>

        {/* Challenge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => {
            const difficultyBadge = getDifficultyBadge(challenge.difficulty);
            const categoryGradient = getCategoryColor(challenge.category);

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => onViewChallenge?.(challenge.id)}
                className={`rounded-2xl overflow-hidden cursor-pointer ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                } shadow-lg hover:shadow-2xl transition-all border ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                {/* Image/Pattern Header */}
                <div className={`h-40 bg-gradient-to-br ${categoryGradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20">
                    <Sparkles className="w-full h-full" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${difficultyBadge.color}`}>
                      {difficultyBadge.label}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="text-white text-sm font-bold">{challenge.heat}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {challenge.title}
                  </h3>

                  <p className={`text-sm mb-4 line-clamp-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {challenge.description}
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {challenge.participants}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className={`font-semibold ${
                          formatDeadline(challenge.deadline) === 'Ending today' 
                            ? 'text-red-500' 
                            : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {formatDeadline(challenge.deadline)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Prize */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Prize Pool
                    </span>
                    <span className="text-lg font-bold text-amber-500">
                      {challenge.prize.toLocaleString()} ₵
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChallengeBoard;
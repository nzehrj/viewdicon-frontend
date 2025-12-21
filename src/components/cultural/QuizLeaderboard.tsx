// src/components/cultural/QuizLeaderboard.tsx
// Quiz Leaderboard - Top Cultural Knowledge Champions

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy,
  Crown,
  Medal,
  Flame,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar?: string;
  score: number;
  heat: number;
  quizzesCompleted: number;
  accuracy: number;
  streak: number;
  lastActive: string;
  badges: string[];
}

interface QuizLeaderboardProps {
  onViewProfile?: (userId: string) => void;
}

export const QuizLeaderboard: React.FC<QuizLeaderboardProps> = ({ onViewProfile }) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'alltime'>('weekly');
  const [category, setCategory] = useState<'all' | 'history' | 'language' | 'culture'>('all');

  // Mock leaderboard data
  const leaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      userId: '1',
      userName: 'Amara Okafor',
      score: 15420,
      heat: 30840,
      quizzesCompleted: 156,
      accuracy: 94,
      streak: 28,
      lastActive: '2025-01-15T10:00:00Z',
      badges: ['Scholar', 'Streak Master', 'Culture Expert'],
    },
    {
      rank: 2,
      userId: '2',
      userName: 'Kwame Mensah',
      score: 14890,
      heat: 29780,
      quizzesCompleted: 142,
      accuracy: 91,
      streak: 21,
      lastActive: '2025-01-15T09:30:00Z',
      badges: ['History Buff', 'Quick Thinker'],
    },
    {
      rank: 3,
      userId: '3',
      userName: 'Fatima Hassan',
      score: 14320,
      heat: 28640,
      quizzesCompleted: 138,
      accuracy: 89,
      streak: 19,
      lastActive: '2025-01-15T11:00:00Z',
      badges: ['Language Master', 'Dedicated Learner'],
    },
    {
      rank: 4,
      userId: '4',
      userName: 'Chioma Eze',
      score: 13750,
      heat: 27500,
      quizzesCompleted: 125,
      accuracy: 88,
      streak: 15,
      lastActive: '2025-01-14T18:00:00Z',
      badges: ['Rising Star'],
    },
    {
      rank: 5,
      userId: '5',
      userName: 'Tunde Williams',
      score: 13200,
      heat: 26400,
      quizzesCompleted: 119,
      accuracy: 87,
      streak: 12,
      lastActive: '2025-01-15T08:00:00Z',
      badges: ['Consistent Performer'],
    },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-8 h-8 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-7 h-7 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-700" />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-600 to-amber-600';
    if (rank === 2) return 'from-gray-500 to-gray-600';
    if (rank === 3) return 'from-amber-700 to-orange-700';
    return 'from-purple-600 to-pink-600';
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    } pb-20`}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 via-amber-600 to-orange-600 opacity-90" />
        
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-32 h-32 border-4 border-white rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-24 h-24 border-4 border-white rounded-full"
          />
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 text-white" />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                <h1 className="text-2xl sm:text-4xl font-bold text-white">
                  Knowledge Champions
                </h1>
              </div>
              <p className="text-base sm:text-lg text-white/90 mb-6">
                Celebrating those who master African cultural knowledge
              </p>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex gap-2">
                  {(['daily', 'weekly', 'monthly', 'alltime'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        timeframe === tf
                          ? 'bg-white text-amber-600'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {tf.charAt(0).toUpperCase() + tf.slice(1)}
                    </button>
                  ))}
                </div>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="px-4 py-2 rounded-lg bg-white/20 text-white font-semibold border-2 border-white/30"
                >
                  <option value="all">All Categories</option>
                  <option value="history">History</option>
                  <option value="language">Language</option>
                  <option value="culture">Culture</option>
                </select>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 sm:p-8">
        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {leaderboard.slice(0, 3).map((_, index) => {
            const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd
            const actualEntry = leaderboard[podiumOrder[index]];
            const height = podiumOrder[index] === 0 ? 'h-48' : podiumOrder[index] === 1 ? 'h-40' : 'h-32';

            return (
              <motion.div
                key={actualEntry.userId}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-4">
                  <div className={`w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-br ${getRankColor(actualEntry.rank)} flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-xl`}>
                    {actualEntry.userName.charAt(0)}
                  </div>
                  <div className="flex justify-center mb-2">
                    {getRankIcon(actualEntry.rank)}
                  </div>
                  <p className={`font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {actualEntry.userName}
                  </p>
                  <p className="text-sm text-amber-600 font-bold">
                    {actualEntry.score.toLocaleString()} pts
                  </p>
                </div>

                <div className={`${height} rounded-t-xl bg-gradient-to-t ${getRankColor(actualEntry.rank)} flex items-center justify-center text-white font-bold text-4xl shadow-xl`}>
                  {actualEntry.rank}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onViewProfile?.(entry.userId)}
              className={`p-4 sm:p-5 rounded-xl cursor-pointer ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } border-2 ${
                entry.rank <= 3
                  ? `border-gradient bg-gradient-to-r ${getRankColor(entry.rank)} border-transparent`
                  : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } hover:border-amber-600 transition-all shadow-lg hover:shadow-xl`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex-shrink-0 w-12 text-center">
                  {entry.rank <= 3 ? (
                    getRankIcon(entry.rank)
                  ) : (
                    <span className={`text-2xl font-bold ${
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {entry.rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${getRankColor(entry.rank)} flex items-center justify-center text-white font-bold text-xl`}>
                  {entry.userName.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-bold text-lg truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {entry.userName}
                    </p>
                    {entry.streak > 10 && (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-500/20 rounded-full">
                        <Flame className="w-3 h-3 text-orange-500" />
                        <span className="text-xs font-bold text-orange-500">{entry.streak}</span>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {entry.badges.slice(0, 2).map((badge) => (
                      <span
                        key={badge}
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          theme === 'dark' ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-500" />
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {entry.score.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-green-500" />
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {entry.accuracy}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-blue-500" />
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {entry.quizzesCompleted} quizzes
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        {entry.heat.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score - Desktop */}
                <div className="hidden sm:block text-right">
                  <p className="text-2xl font-bold text-amber-600">
                    {entry.score.toLocaleString()}
                  </p>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    points
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full mt-6 py-4 rounded-xl font-semibold transition-all ${
            theme === 'dark'
              ? 'bg-gray-800 hover:bg-gray-700 text-white'
              : 'bg-white hover:bg-gray-50 text-gray-900'
          } border-2 ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          Load More Champions
        </motion.button>
      </div>
    </div>
  );
};

export default QuizLeaderboard;
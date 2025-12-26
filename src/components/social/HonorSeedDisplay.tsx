// src/components/social/HonorSeedDisplay.tsx
// Honor Seed Display - Achievement & Contribution Showcase

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, TrendingUp, Award, Heart, Zap } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface HonorSeed {
  id: string;
  type: 'contribution' | 'achievement' | 'blessing' | 'milestone';
  title: string;
  description: string;
  points: number;
  earnedAt: Date;
  icon?: string;
}

interface HonorSeedDisplayProps {
  seeds: HonorSeed[];
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  showProgress?: boolean;
  compact?: boolean;
}

export const HonorSeedDisplay: React.FC<HonorSeedDisplayProps> = ({
  seeds,
  totalPoints,
  level,
  nextLevelPoints,
  showProgress = true,
  compact = false,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const progress = (totalPoints / nextLevelPoints) * 100;

  const getSeedIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return <Heart className="w-4 h-4 text-red-500" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-yellow-500" />;
      case 'blessing':
        return <Leaf className="w-4 h-4 text-green-500" />;
      case 'milestone':
        return <Zap className="w-4 h-4 text-purple-500" />;
      default:
        return <Leaf className="w-4 h-4 text-green-500" />;
    }
  };

  const getSeedColor = (type: string) => {
    switch (type) {
      case 'contribution':
        return 'from-red-600 to-rose-600';
      case 'achievement':
        return 'from-yellow-600 to-amber-600';
      case 'blessing':
        return 'from-green-600 to-emerald-600';
      case 'milestone':
        return 'from-purple-600 to-pink-600';
      default:
        return 'from-green-600 to-emerald-600';
    }
  };

  if (compact) {
    return (
      <div className={`
        flex items-center gap-3 p-3 rounded-xl
        ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-green-50'}
      `}>
        <div className="relative">
          <Leaf className="w-8 h-8 text-green-500" />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center">
            {level}
          </span>
        </div>
        <div className="flex-1">
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Honor Seeds
          </p>
          <p className={`font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {totalPoints.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-green-600 font-semibold">{seeds.length} earned</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      p-4 sm:p-6 rounded-2xl
      ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Leaf className="w-10 h-10 text-green-500" />
            </motion.div>
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold flex items-center justify-center">
              {level}
            </span>
          </div>
          <div>
            <h3 className={`font-bold text-lg ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Honor Seeds
            </h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Level {level} Growth
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">
            {totalPoints.toLocaleString()}
          </p>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Total Points
          </p>
        </div>
      </div>

      {/* Progress to Next Level */}
      {showProgress && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Progress to Level {level + 1}
            </span>
            <span className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-green-600 to-emerald-600"
            />
          </div>
          <p className={`text-xs mt-1 text-right ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
          }`}>
            {nextLevelPoints - totalPoints} points to next level
          </p>
        </div>
      )}

      {/* Recent Seeds */}
      <div>
        <h4 className={`text-sm font-semibold mb-3 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Recent Seeds ({seeds.length})
        </h4>
        <div className="space-y-2">
          {seeds.slice(0, 5).map((seed, index) => (
            <motion.div
              key={seed.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-3 rounded-xl flex items-start gap-3
                ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
              `}
            >
              <div className={`
                p-2 rounded-lg bg-gradient-to-r ${getSeedColor(seed.type)}
              `}>
                {getSeedIcon(seed.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {seed.title}
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {seed.description}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs font-bold text-green-600">
                  +{seed.points}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* View All Button */}
      {seeds.length > 5 && (
        <button className={`
          w-full mt-4 py-2 rounded-xl text-sm font-semibold transition-colors
          ${theme === 'dark'
            ? 'bg-gray-700 hover:bg-gray-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
          }
        `}>
          View All {seeds.length} Seeds
        </button>
      )}
    </div>
  );
};

export default HonorSeedDisplay;
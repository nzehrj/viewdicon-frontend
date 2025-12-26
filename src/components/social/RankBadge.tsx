// src/components/social/RankBadge.tsx
// Rank Badge - User Level & Achievement Display

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Shield, Award, Zap } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface RankBadgeProps {
  rank: number;
  rankTitle?: string;
  showProgress?: boolean;
  progress?: number; // 0-100
  animated?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const RankBadge: React.FC<RankBadgeProps> = ({
  rank,
  rankTitle,
  showProgress = false,
  progress = 0,
  animated = true,
  size = 'md',
  showTooltip = false,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  // Determine rank tier and styling
  const getRankTier = (rank: number) => {
    if (rank >= 90) return {
      tier: 'Legend',
      icon: Crown,
      gradient: 'from-purple-600 to-pink-600',
      glow: 'shadow-purple-500/50',
    };
    if (rank >= 75) return {
      tier: 'Master',
      icon: Star,
      gradient: 'from-amber-600 to-orange-600',
      glow: 'shadow-amber-500/50',
    };
    if (rank >= 50) return {
      tier: 'Expert',
      icon: Shield,
      gradient: 'from-blue-600 to-indigo-600',
      glow: 'shadow-blue-500/50',
    };
    if (rank >= 25) return {
      tier: 'Advanced',
      icon: Award,
      gradient: 'from-green-600 to-emerald-600',
      glow: 'shadow-green-500/50',
    };
    return {
      tier: 'Apprentice',
      icon: Zap,
      gradient: 'from-gray-600 to-gray-700',
      glow: 'shadow-gray-500/50',
    };
  };

  const tierData = getRankTier(rank);
  const Icon = tierData.icon;

  const sizeClasses = {
    xs: {
      container: 'w-6 h-6',
      icon: 'w-3 h-3',
      text: 'text-xs',
      badge: 'px-1.5 py-0.5',
    },
    sm: {
      container: 'w-8 h-8',
      icon: 'w-4 h-4',
      text: 'text-sm',
      badge: 'px-2 py-1',
    },
    md: {
      container: 'w-10 h-10',
      icon: 'w-5 h-5',
      text: 'text-base',
      badge: 'px-3 py-1.5',
    },
    lg: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      text: 'text-lg',
      badge: 'px-4 py-2',
    },
  };

  const sizeConfig = sizeClasses[size];

  return (
    <div className="relative inline-block" title={showTooltip ? `${tierData.tier} - Rank ${rank}` : undefined}>
      {/* Rank Badge */}
      <motion.div
        animate={animated ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
        }}
        className={`
          ${sizeConfig.container} rounded-full flex items-center justify-center
          bg-gradient-to-br ${tierData.gradient}
          ${animated ? `shadow-lg ${tierData.glow}` : ''}
          border-2 border-white/20
        `}
      >
        <Icon className={`${sizeConfig.icon} text-white`} />
      </motion.div>

      {/* Rank Number */}
      <div className={`
        absolute -bottom-1 -right-1 ${sizeConfig.badge} rounded-full
        bg-gradient-to-br ${tierData.gradient}
        border-2 ${theme === 'dark' ? 'border-gray-800' : 'border-white'}
        font-bold ${sizeConfig.text} text-white
        flex items-center justify-center
      `}>
        {rank}
      </div>

      {/* Rank Title (Optional) */}
      {rankTitle && size !== 'xs' && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <span className={`
            px-2 py-0.5 rounded-full text-xs font-semibold
            bg-gradient-to-r ${tierData.gradient} text-white
          `}>
            {rankTitle}
          </span>
        </div>
      )}

      {/* Progress Ring (Optional) */}
      {showProgress && size !== 'xs' && (
        <svg
          className="absolute inset-0 -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke={theme === 'dark' ? '#374151' : '#E5E7EB'}
            strokeWidth="4"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="url(#rankGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 48}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - progress / 100) }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="rankGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className={tierData.gradient.split(' ')[0].replace('from-', '')} />
              <stop offset="100%" className={tierData.gradient.split(' ')[2].replace('to-', '')} />
            </linearGradient>
          </defs>
        </svg>
      )}
    </div>
  );
};

export default RankBadge;
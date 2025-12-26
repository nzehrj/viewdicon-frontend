// src/components/social/HeatIndicator.tsx
// Heat Indicator - Visual Engagement Display

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import type { PotHeatLevel } from '@/types/feed.types';

interface HeatIndicatorProps {
  heatLevel: PotHeatLevel;
  heatScore: number;
  totalPots: number;
  animated?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const HeatIndicator: React.FC<HeatIndicatorProps> = ({
  heatLevel,
  heatScore,
  totalPots,
  animated = true,
  showLabel = false,
  size = 'md',
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const getHeatConfig = () => {
    switch (heatLevel) {
      case 'cold':
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/20',
          icon: Flame,
          label: 'Cold',
          flame: '❄️',
        };
      case 'warming':
        return {
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/20',
          icon: Flame,
          label: 'Warming',
          flame: '🔥',
        };
      case 'cooking':
        return {
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/20',
          icon: Flame,
          label: 'Cooking',
          flame: '🔥🔥',
        };
      case 'boiling':
        return {
          color: 'text-red-500',
          bgColor: 'bg-red-500/20',
          icon: Flame,
          label: 'Boiling',
          flame: '🔥🔥🔥',
        };
      case 'ready':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-500/20',
          icon: Sparkles,
          label: 'Ready!',
          flame: '✨',
        };
      default:
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/20',
          icon: Flame,
          label: 'Cold',
          flame: '❄️',
        };
    }
  };

  const config = getHeatConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      icon: 'w-3 h-3',
      text: 'text-xs',
      padding: 'px-2 py-1',
    },
    md: {
      icon: 'w-4 h-4',
      text: 'text-sm',
      padding: 'px-3 py-1.5',
    },
    lg: {
      icon: 'w-5 h-5',
      text: 'text-base',
      padding: 'px-4 py-2',
    },
  };

  const sizeConfig = sizeClasses[size];

  const animationClasses = animated ? {
    cold: '',
    warming: 'animate-pulse-slow',
    cooking: 'animate-pulse',
    boiling: 'animate-bounce-subtle',
    ready: 'animate-sparkle',
  }[heatLevel] : '';

  return (
    <div className="flex items-center gap-2">
      {/* Heat Icon */}
      <motion.div
        animate={animated ? {
          scale: heatLevel === 'boiling' || heatLevel === 'ready' ? [1, 1.1, 1] : 1,
        } : {}}
        transition={{
          duration: 1,
          repeat: animated && (heatLevel === 'boiling' || heatLevel === 'ready') ? Infinity : 0,
        }}
        className={`
          flex items-center gap-1.5 ${sizeConfig.padding} rounded-full
          ${config.bgColor} ${config.color}
          ${animationClasses}
        `}
      >
        <Icon className={sizeConfig.icon} />
        <span className={`font-bold ${sizeConfig.text}`}>
          {heatScore}
        </span>
        {showLabel && (
          <span className={`font-semibold ${sizeConfig.text} hidden sm:inline`}>
            {config.label}
          </span>
        )}
      </motion.div>

      {/* Pot Count Badge */}
      {totalPots > 0 && (
        <div className={`
          flex items-center gap-1 px-2 py-1 rounded-full
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}
        `}>
          <span className="text-xl leading-none">{config.flame}</span>
          <span className={`text-xs font-bold ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {totalPots}
          </span>
        </div>
      )}
    </div>
  );
};

export default HeatIndicator;
// src/components/social/CouncilSealBadge.tsx
// Council Seal Badge - Authority & Verification

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Award, Star, Crown } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

type SealTier = 'verified' | 'elder' | 'council' | 'chief' | 'ancestor';

interface CouncilSealBadgeProps {
  tier: SealTier;
  showLabel?: boolean;
  animated?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export const CouncilSealBadge: React.FC<CouncilSealBadgeProps> = ({
  tier,
  showLabel = false,
  animated = true,
  size = 'md',
  showTooltip = false,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const getSealConfig = () => {
    switch (tier) {
      case 'verified':
        return {
          icon: CheckCircle,
          label: 'Verified',
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500',
          description: 'Identity verified member',
        };
      case 'elder':
        return {
          icon: Award,
          label: 'Elder',
          color: 'text-purple-500',
          bgColor: 'bg-purple-500/20',
          borderColor: 'border-purple-500',
          description: 'Respected community elder',
        };
      case 'council':
        return {
          icon: Shield,
          label: 'Council',
          color: 'text-amber-500',
          bgColor: 'bg-amber-500/20',
          borderColor: 'border-amber-500',
          description: 'Council member',
        };
      case 'chief':
        return {
          icon: Star,
          label: 'Chief',
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/20',
          borderColor: 'border-orange-500',
          description: 'Village chief',
        };
      case 'ancestor':
        return {
          icon: Crown,
          label: 'Ancestor',
          color: 'text-gold-500',
          bgColor: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20',
          borderColor: 'border-gold-500',
          description: 'Founding ancestor',
        };
    }
  };

  const config = getSealConfig();
  const Icon = config.icon;

  const sizeClasses = {
    xs: {
      container: 'w-4 h-4',
      icon: 'w-3 h-3',
      text: 'text-xs',
      padding: 'px-1.5 py-0.5',
    },
    sm: {
      container: 'w-5 h-5',
      icon: 'w-4 h-4',
      text: 'text-xs',
      padding: 'px-2 py-1',
    },
    md: {
      container: 'w-6 h-6',
      icon: 'w-5 h-5',
      text: 'text-sm',
      padding: 'px-2.5 py-1',
    },
    lg: {
      container: 'w-8 h-8',
      icon: 'w-6 h-6',
      text: 'text-base',
      padding: 'px-3 py-1.5',
    },
  };

  const sizeConfig = sizeClasses[size];

  return (
    <div
      className="inline-flex items-center gap-1.5"
      title={showTooltip ? config.description : undefined}
    >
      {/* Badge Icon */}
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
          ${config.bgColor} ${config.borderColor} border-2
          ${animated ? 'shadow-lg' : ''}
        `}
      >
        <Icon className={`${sizeConfig.icon} ${config.color}`} />
      </motion.div>

      {/* Label */}
      {showLabel && (
        <span className={`
          ${sizeConfig.text} font-semibold
          ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
        `}>
          {config.label}
        </span>
      )}
    </div>
  );
};

export default CouncilSealBadge;
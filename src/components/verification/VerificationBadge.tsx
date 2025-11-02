import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import type { VerificationTier } from '@/types/verification.types';
import { 
  getVerificationTierName, 
  getVerificationTierColor,
  getVerificationTierIcon 
} from '@/types/verification.types';
import * as Icons from 'lucide-react';

interface VerificationBadgeProps {
  tier: VerificationTier;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showTooltip?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  tier,
  size = 'md',
  showLabel = false,
  showTooltip = true,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const tierColor = getVerificationTierColor(tier);
  const tierName = getVerificationTierName(tier);
  const iconName = getVerificationTierIcon(tier);
  const IconComponent = (Icons as any)[iconName] || Shield;

  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const badgeSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      {/* Badge Circle */}
      <motion.div
        whileHover={showTooltip ? { scale: 1.1 } : {}}
        className={`
          ${badgeSizes[size]} rounded-full flex items-center justify-center
          shadow-sm relative group
        `}
        style={{ backgroundColor: tierColor }}
        title={showTooltip ? tierName : undefined}
      >
        <IconComponent 
          className={`${sizeClasses[size]} text-white`}
          fill="white"
        />

        {/* Tooltip */}
        {showTooltip && (
          <div className={`
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1
            rounded-lg text-xs font-semibold whitespace-nowrap
            opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none
            ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'}
          `}>
            {tierName}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
          </div>
        )}
      </motion.div>

      {/* Label (optional) */}
      {showLabel && (
        <span 
          className={`font-semibold ${textSizes[size]}`}
          style={{ color: tierColor }}
        >
          {tierName}
        </span>
      )}
    </div>
  );
};

export default VerificationBadge;
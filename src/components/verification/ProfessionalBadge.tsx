import React from 'react';
import { motion } from 'framer-motion';
import type { ProfessionalBadge as ProfessionalBadgeType } from '@/types/verification.types';
import { getProfessionIcon, getProfessionColor } from '@/types/verification.types';
import * as Icons from 'lucide-react';

interface ProfessionalBadgeProps {
  badge: ProfessionalBadgeType;
  size?: 'sm' | 'md' | 'lg';
  showVerifier?: boolean;
}

export const ProfessionalBadge: React.FC<ProfessionalBadgeProps> = ({
  badge,
  size = 'md',
  showVerifier = true,
}) => {
  // ❌ REMOVED: const theme = useAppSelector((state) => state.theme.theme);

  const iconName = getProfessionIcon(badge.category);
  const color = getProfessionColor(badge.category);
  const IconComponent = (Icons as any)[iconName];

  // Size classes
  const containerSizes = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold
        ${containerSizes[size]}
      `}
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `1.5px solid ${color}40`,
      }}
    >
      {/* Icon */}
      <IconComponent className={iconSizes[size]} />

      {/* Title */}
      <span>{badge.title}</span>

      {/* Verifier (optional) */}
      {showVerifier && size !== 'sm' && (
        <span 
          className={`
            text-xs opacity-70 border-l pl-1.5 ml-0.5
          `}
          style={{ borderColor: `${color}40` }}
        >
          {badge.verified_by}
        </span>
      )}
    </motion.div>
  );
};

export default ProfessionalBadge;
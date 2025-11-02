import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Soup, Flame, Sparkles, Loader2 } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import type { PotStatus } from '@/types/feed.types';
import { 
  getPotColor, 
  formatPotCount,
} from '@/types/feed.types';

interface PotButtonProps {
  // postId: string; // ❌ REMOVED - not used in component
  potStatus: PotStatus;
  hasUserStirred: boolean;
  onPot: () => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const PotButton: React.FC<PotButtonProps> = ({
  // postId, // ❌ REMOVED from destructure
  potStatus,
  hasUserStirred,
  onPot,
  size = 'md',
  showLabel = true,
}) => {
  const [isStirring, setIsStirring] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);

  const handlePot = async () => {
    if (isStirring || hasUserStirred) return;
    
    setIsStirring(true);
    
    try {
      await onPot();
      
      // Show celebration if pot reaches a milestone
      if (potStatus.heat_score >= 90) {
        setShowFireworks(true);
        setTimeout(() => setShowFireworks(false), 2000);
      }
    } catch (error) {
      console.error('Failed to stir pot:', error);
    } finally {
      setIsStirring(false);
    }
  };

  // Icon based on heat level
  const IconComponent = potStatus.heat_level === 'ready' 
    ? Sparkles 
    : potStatus.heat_level === 'boiling' || potStatus.heat_level === 'cooking'
    ? Flame
    : Soup;

  const potColor = getPotColor(potStatus.heat_level);
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={handlePot}
        disabled={hasUserStirred || isStirring}
        whileHover={!hasUserStirred ? { scale: 1.05 } : {}}
        whileTap={!hasUserStirred ? { scale: 0.95 } : {}}
        className={`
          relative inline-flex items-center justify-center rounded-xl font-semibold
          transition-all ${sizeClasses[size]}
          ${hasUserStirred
            ? theme === 'dark'
              ? 'bg-gray-800 border-2 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 border-2 text-gray-500 cursor-not-allowed'
            : theme === 'dark'
            ? 'bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-gray-500 text-white'
            : 'bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-900'
          }
        `}
        style={hasUserStirred ? { borderColor: potColor } : {}}
      >
        {/* Icon with animation */}
        <motion.div
          animate={
            hasUserStirred && potStatus.heat_level !== 'cold'
              ? {
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1.1, 1.1, 1.1, 1],
                }
              : {}
          }
          transition={{
            duration: 0.5,
            repeat: potStatus.heat_level === 'boiling' ? Infinity : 0,
            repeatDelay: 2,
          }}
          style={{ color: hasUserStirred ? potColor : undefined }}
        >
          {isStirring ? (
            <Loader2 className={`${iconSizes[size]} animate-spin`} />
          ) : (
            <IconComponent className={iconSizes[size]} />
          )}
        </motion.div>

        {/* Label */}
        {showLabel && (
          <span className="font-semibold">
            {hasUserStirred ? 'Stirred' : 'Stir Pot'}
          </span>
        )}

        {/* Count badge */}
        {potStatus.total_pots > 0 && (
          <span
            className={`
              ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold
              ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}
            `}
            style={{ color: potColor }}
          >
            {formatPotCount(potStatus.total_pots)}
          </span>
        )}

        {/* Heat indicator (small flame for stirred posts) */}
        {hasUserStirred && potStatus.heat_level !== 'cold' && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute -top-1 -right-1"
          >
            <Flame 
              className="w-3 h-3" 
              style={{ color: potColor }}
              fill={potColor}
            />
          </motion.div>
        )}
      </motion.button>

      {/* Fireworks celebration (when pot reaches "ready") */}
      <AnimatePresence>
        {showFireworks && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 1,
                  scale: 0.5
                }}
                animate={{ 
                  x: Math.cos(i * Math.PI / 4) * 40,
                  y: Math.sin(i * Math.PI / 4) * 40,
                  opacity: 0,
                  scale: 1
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                style={{ backgroundColor: potColor }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PotButton;
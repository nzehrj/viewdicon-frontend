import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, Snowflake } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import type { PotStatus } from '@/types/feed.types';
import { 
  getPotColor, 
  //getHeatLevel, 
  getPotStatusMessage,
  getHeatLevelDetails 
} from '@/types/feed.types';

interface PotHeatBarProps {
  potStatus: PotStatus;
  showMessage?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PotHeatBar: React.FC<PotHeatBarProps> = ({
  potStatus,
  showMessage = true,
  animated = true,
  size = 'md',
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const heatColor = getPotColor(potStatus.heat_level);
  const statusMessage = getPotStatusMessage(potStatus);
  const heatDetails = getHeatLevelDetails(potStatus.heat_level);

  // Size classes
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  // Icon based on heat level
  const IconComponent = 
    potStatus.heat_level === 'ready' ? Sparkles :
    potStatus.heat_level === 'cold' ? Snowflake :
    Flame;

  return (
    <div className="w-full space-y-1.5">
      {/* Status message */}
      {showMessage && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={
                animated && potStatus.heat_level !== 'cold'
                  ? {
                      scale: [1, 1.2, 1],
                      rotate: potStatus.heat_level === 'boiling' ? [0, 5, -5, 0] : 0,
                    }
                  : {}
              }
              transition={{
                duration: 1,
                repeat: potStatus.heat_level === 'boiling' ? Infinity : 0,
              }}
            >
              <IconComponent 
                className={iconSizes[size]}
                style={{ color: heatColor }}
                fill={potStatus.heat_level === 'ready' ? heatColor : 'none'}
              />
            </motion.div>
            <span 
              className={`font-semibold ${textSizes[size]}`}
              style={{ color: heatColor }}
            >
              {heatDetails.label}
            </span>
          </div>
          
          <span className={`${textSizes[size]} ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {potStatus.heat_score}°
          </span>
        </div>
      )}

      {/* Heat progress bar */}
      <div 
        className={`w-full ${heightClasses[size]} rounded-full overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
        }`}
      >
        <motion.div
          className={`${heightClasses[size]} rounded-full relative overflow-hidden`}
          style={{ 
            background: `linear-gradient(90deg, ${heatColor}dd, ${heatColor})`,
            width: `${potStatus.heat_score}%`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${potStatus.heat_score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Animated shine effect */}
          {animated && potStatus.heat_score > 20 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
          
          {/* Bubbling effect for boiling */}
          {animated && potStatus.heat_level === 'boiling' && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/50 rounded-full"
                  style={{ left: `${20 + i * 30}%` }}
                  animate={{
                    y: ['100%', '-100%'],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      </div>

      {/* Small status text */}
      {showMessage && (
        <p className={`${textSizes[size]} ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
        }`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default PotHeatBar;
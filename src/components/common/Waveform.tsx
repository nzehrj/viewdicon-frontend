import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

interface WaveformProps {
  isActive?: boolean;
  bars?: number;
  className?: string;
}

export const Waveform: React.FC<WaveformProps> = ({
  isActive = false,
  bars = 40,
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-center gap-1 h-20', className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-afro-green-600 to-afro-red-600 rounded-full"
          animate={
            isActive
              ? {
                  height: [8, Math.random() * 60 + 20, 8],
                }
              : {
                  height: 8,
                }
          }
          transition={{
            duration: 0.5,
            repeat: isActive ? Infinity : 0,
            delay: i * 0.05,
          }}
        />
      ))}
    </div>
  );
};

interface AudioVisualizerProps {
  audioLevel: number; // 0-100
  className?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioLevel,
  className,
}) => {
  const bars = 20;
  const activeBarCount = Math.floor((audioLevel / 100) * bars);

  return (
    <div className={cn('flex items-end justify-center gap-1 h-16', className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-2 rounded-t-lg transition-all duration-150',
            i < activeBarCount
              ? 'bg-gradient-to-t from-afro-green-500 to-afro-red-500'
              : 'bg-gray-300 dark:bg-gray-700'
          )}
          style={{
            height: i < activeBarCount ? `${(i + 1) * 4}px` : '4px',
          }}
        />
      ))}
    </div>
  );
};
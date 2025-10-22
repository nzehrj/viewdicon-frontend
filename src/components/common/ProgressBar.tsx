import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@utils/cn';

interface ProgressBarProps {
  progress: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showLabel = false,
  size = 'md',
  className,
}) => {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
      
      <div className={cn('w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden', sizes[size])}>
        <motion.div
          className="h-full bg-gradient-to-r from-afro-green-500 to-afro-red-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export const StepProgress: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            index < currentStep
              ? 'bg-gradient-to-r from-afro-green-500 to-afro-red-500 w-8'
              : index === currentStep
              ? 'bg-gradient-to-r from-afro-green-500 to-afro-red-500 w-12'
              : 'bg-gray-300 dark:bg-gray-600 w-8'
          )}
          initial={{ scale: 0.8 }}
          animate={{ scale: index === currentStep ? 1.1 : 1 }}
        />
      ))}
    </div>
  );
};
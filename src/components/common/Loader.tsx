import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', text }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizes[size]} relative`}>
        <motion.div
          className="absolute inset-0 border-4 border-gray-300 dark:border-gray-700 rounded-full"
        />
        <motion.div
          className="absolute inset-0 border-4 border-t-afro-green-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
      
      {text && (
        <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

export const SpinnerIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => {
  return (
    <motion.div
      className={`border-2 border-t-current border-r-transparent border-b-transparent border-l-transparent rounded-full ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
};
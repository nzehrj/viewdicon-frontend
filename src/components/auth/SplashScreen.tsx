import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { useAppSelector } from '@store/hooks';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(true);
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Complete after 3 seconds
    const timer = setTimeout(onComplete, 3000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <GradientBackground>
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center"
          >
            {/* Logo Container */}
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: 'easeOut',
                delay: 0.2 
              }}
              className="relative mb-12"
            >
              {/* Logo Image */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 mx-auto">
                <motion.div
                  animate={{ 
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-full h-full flex items-center justify-center"
                >
                  {imageLoaded ? (
                    <img
                      src="/assets/viewdicon.png"
                      alt="ViewDicon Logo"
                      className="w-full h-full object-contain"
                      onError={() => setImageLoaded(false)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-7xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-br from-green-500 to-emerald-600 bg-clip-text text-transparent">
                        Vi
                      </span>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        {/* Loading Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Progress Bar */}
          <div className={`h-1.5 rounded-full overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-200/50'
          }`}>
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>
    </GradientBackground>
  );
};
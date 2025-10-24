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
            {/* Logo Container with Glow Effect */}
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: 'easeOut',
                delay: 0.2 
              }}
              className="relative mb-8"
            >
              {/* Glow Effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 -m-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 blur-2xl"
              />

              {/* Logo Image */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className={`w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 ${
                    theme === 'dark' 
                      ? 'border-gray-700 bg-gray-800' 
                      : 'border-white bg-white'
                  }`}
                >
                  {imageLoaded ? (
                    <img
                      src="/assets/vi.jpg"
                      alt="ViewDicon Logo"
                      className="w-full h-full object-cover"
                      onError={() => setImageLoaded(false)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <span className="text-5xl sm:text-6xl font-bold text-white">Vi</span>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
            
            {/* App Name with Gradient */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3">
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">
                  ViewDicon
                </span>
              </h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className={`text-base sm:text-lg lg:text-xl mb-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                The Digital Motherland
              </motion.p>

              {/* Ubuntu Quote */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className={`text-sm sm:text-base italic ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}
              >
                "I am because we are"
              </motion.p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        
        {/* Loading Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-12 w-full max-w-xs"
        >
          {/* Progress Bar */}
          <div className={`h-2 rounded-full overflow-hidden mb-4 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
          }`}>
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Loading Text */}
          <div className="flex items-center justify-center">
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Loading your experience...
            </span>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-20 right-20 w-32 h-32 opacity-10"
        >
          <div className="w-full h-full border-8 border-green-500 rounded-full border-t-transparent" />
        </motion.div>

        <motion.div
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-20 left-20 w-24 h-24 opacity-10"
        >
          <div className="w-full h-full border-8 border-emerald-500 rounded-full border-b-transparent" />
        </motion.div>
      </div>
    </GradientBackground>
  );
};
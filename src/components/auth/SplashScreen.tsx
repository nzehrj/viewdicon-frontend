import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { Loader } from '@components/common/Loader';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <GradientBackground>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Logo */}
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-afro-green-400 to-afro-red-600 rounded-full flex items-center justify-center shadow-afro-lg">
            <span className="text-5xl font-bold text-white">Vi</span>
          </div>
          
          {/* App Name */}
          <h1 className="text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-afro-green-600 to-afro-red-600 bg-clip-text text-transparent">
              viewdicon
            </span>
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            The Digital Motherland
          </p>
        </motion.div>
        
        <div className="mt-8">
          <Loader />
        </div>
      </div>
    </GradientBackground>
  );
};
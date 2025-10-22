import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { Button } from '@components/common/Button';
import { useAppSelector } from '@store/hooks';
import { getGreeting } from '@utils/helpers';

interface GreetingProps {
  onNext: () => void;
}

export const Greeting: React.FC<GreetingProps> = ({ onNext }) => {
  const [greeting, setGreeting] = useState('');
  const theme = useAppSelector((state) => state.theme.theme);
  const language = useAppSelector((state) => state.i18n.language);

  useEffect(() => {
    const greetingText = getGreeting(language);
    setGreeting(greetingText);
  }, [language]);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const getTimeEmoji = () => {
    const timeOfDay = getTimeOfDay();
    if (timeOfDay === 'morning') return '🌅';
    if (timeOfDay === 'afternoon') return '☀️';
    return '🌙';
  };

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          {/* Time Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-8xl mb-6"
          >
            {getTimeEmoji()}
          </motion.div>

          {/* Greeting */}
          <h1 className={`text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {greeting}
          </h1>

          {/* Subtext */}
          <p className={`text-xl mb-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Welcome to the Digital Motherland
          </p>

          {/* Begin Button */}
          <Button onClick={onNext} size="lg" fullWidth>
            Begin My Journey
          </Button>
        </motion.div>
      </div>
    </GradientBackground>
  );
};
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { Button } from '@components/common/Button';
import { useAppSelector } from '@store/hooks';
import { getGreeting } from '@utils/helpers';
import { Sunrise, Sun, Moon } from 'lucide-react'; // Lucide icons

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

  const getTimeIcon = () => {
    const timeOfDay = getTimeOfDay();

    if (timeOfDay === 'morning') {
      return (
        <div className="p-6 rounded-full bg-gradient-to-br from-amber-100 via-orange-200 to-yellow-300 shadow-lg flex items-center justify-center">
          <Sunrise className="w-16 h-16 text-amber-700" />
        </div>
      );
    }

    if (timeOfDay === 'afternoon') {
      return (
        <div className="p-6 rounded-full bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-400 shadow-lg flex items-center justify-center">
          <Sun className="w-16 h-16 text-yellow-700" />
        </div>
      );
    }

    return (
      <div className="p-6 rounded-full bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-700 shadow-lg flex items-center justify-center">
        <Moon className="w-16 h-16 text-indigo-200" />
      </div>
    );
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
            className="mb-6 flex justify-center"
          >
            {getTimeIcon()}
          </motion.div>

          {/* Greeting */}
          <h1
            className={`text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {greeting}
          </h1>

          {/* Subtext */}
          <p
            className={`text-xl mb-12 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
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

export default Greeting;

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { Button } from '@components/common/Button';
import { useAppSelector } from '@store/hooks';
import { getGreeting } from '@utils/helpers';
import { 
  Sunrise, 
  Sun, 
  Moon, 
  Sparkles,
  Globe,
  Users,
  Heart,
  Zap
} from 'lucide-react';

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

  const timeOfDay = getTimeOfDay();

  const getTimeIcon = () => {
    if (timeOfDay === 'morning') {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="p-8 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-400 shadow-2xl flex items-center justify-center relative"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300/50 to-transparent animate-pulse" />
          <Sunrise className="w-20 h-20 text-white relative z-10" strokeWidth={1.5} />
        </motion.div>
      );
    }

    if (timeOfDay === 'afternoon') {
      return (
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="p-8 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-2xl flex items-center justify-center relative"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300/50 to-transparent animate-pulse" />
          <Sun className="w-20 h-20 text-white relative z-10" strokeWidth={1.5} />
        </motion.div>
      );
    }

    return (
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="p-8 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 shadow-2xl flex items-center justify-center relative"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400/50 to-transparent animate-pulse" />
        <Moon className="w-20 h-20 text-white relative z-10" strokeWidth={1.5} />
      </motion.div>
    );
  };

  const getTimeMessage = () => {
    if (timeOfDay === 'morning') return "A new day begins in the Motherland";
    if (timeOfDay === 'afternoon') return "The sun shines bright on our journey";
    return "The stars guide us through the night";
  };

  const getAfricanQuote = () => {
    const quotes = [
      { text: "Ubuntu: I am because we are", author: "African Proverb" },
      { text: "If you want to go fast, go alone. If you want to go far, go together", author: "African Proverb" },
      { text: "Wisdom is like a baobab tree; no one individual can embrace it", author: "Akan Proverb" },
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const [quote] = useState(getAfricanQuote());

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-10 w-32 h-32 border-4 border-amber-500 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 right-10 w-40 h-40 border-4 border-green-500 rounded-full"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-40 right-20 w-24 h-24 bg-red-500 rounded-full opacity-20"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`relative z-10 text-center max-w-2xl w-full ${
            theme === 'dark' ? 'bg-gray-900/40' : 'bg-white/60'
          } backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border ${
            theme === 'dark' ? 'border-gray-700/50' : 'border-white/20'
          }`}
        >
          {/* Floating Sparkles */}
          <motion.div
            animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6"
          >
            <Sparkles className="w-8 h-8 text-amber-400" />
          </motion.div>

          <motion.div
            animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-6"
          >
            <Sparkles className="w-8 h-8 text-green-400" />
          </motion.div>

          {/* Time Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.2, 
              type: 'spring',
              stiffness: 200,
              damping: 15
            }}
            className="mb-8 flex justify-center"
          >
            {getTimeIcon()}
          </motion.div>

          {/* Main Greeting */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-4xl md:text-6xl font-bold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {greeting}
          </motion.h1>

          {/* Time Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`text-sm md:text-base mb-6 italic ${
              theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            }`}
          >
            {getTimeMessage()}
          </motion.p>

          {/* Main Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className={`text-xl md:text-2xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
            }`}
          >
            Welcome to the Digital Motherland
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`text-base md:text-lg mb-8 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Where African identity meets digital innovation
          </motion.p>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <div className={`p-4 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80'
            } backdrop-blur-sm`}>
              <Globe className={`w-8 h-8 mx-auto mb-2 ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`} />
              <p className={`text-xs md:text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Connect
              </p>
            </div>

            <div className={`p-4 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80'
            } backdrop-blur-sm`}>
              <Users className={`w-8 h-8 mx-auto mb-2 ${
                theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
              }`} />
              <p className={`text-xs md:text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Collaborate
              </p>
            </div>

            <div className={`p-4 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/80'
            } backdrop-blur-sm`}>
              <Heart className={`w-8 h-8 mx-auto mb-2 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`} />
              <p className={`text-xs md:text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Celebrate
              </p>
            </div>
          </motion.div>

          {/* African Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0 }}
            className={`p-6 rounded-2xl mb-8 border-l-4 ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border-amber-500' 
                : 'bg-amber-50 border-amber-600'
            }`}
          >
            <p className={`text-sm md:text-base italic mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              "{quote.text}"
            </p>
            <p className={`text-xs md:text-sm font-medium ${
              theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            }`}>
              — {quote.author}
            </p>
          </motion.div>

          {/* Begin Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Button 
              onClick={onNext} 
              size="lg" 
              fullWidth
              className="relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Begin My Journey
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-200, 200] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </Button>
          </motion.div>

          {/* Stats or Counters (Optional) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 flex justify-center gap-8"
          >
            <div className="text-center">
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-green-400' : 'text-green-600'
              }`}>
                54+
              </p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Countries
              </p>
            </div>
            
            <div className="text-center">
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
              }`}>
                1M+
              </p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Community
              </p>
            </div>
            
            <div className="text-center">
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}>
                ∞
              </p>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Possibilities
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Decoration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className={`mt-6 text-center text-xs ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
          }`}
        >
          <p>Powered by Viewdicon LLC © 2025</p>
        </motion.div>
      </div>
    </GradientBackground>
  );
};

export default Greeting;

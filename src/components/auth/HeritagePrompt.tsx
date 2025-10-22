import React from 'react';
import { Award, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { Button } from '@components/common/Button';
import { useAppSelector } from '@store/hooks';

interface HeritagePromptProps {
  onStart: () => void;
  onSkip: () => void;
}

export const HeritagePrompt: React.FC<HeritagePromptProps> = ({ onStart, onSkip }) => {
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center">
              <Award className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className={`text-3xl font-bold mb-3 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Heritage Challenge
          </h1>

          {/* Description */}
          <p className={`text-center mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Share what your family passed down—proverbs, foods, festivals, traditions.
            This helps us verify your cultural connection.
          </p>

          {/* Features */}
          <div className="space-y-4 mb-8">
            <div className={`flex items-start gap-4 p-4 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800/30' : 'bg-white'
            }`}>
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎭</span>
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Cultural Knowledge
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Answer questions about your heritage, traditions, and ancestral wisdom
                </p>
              </div>
            </div>

            <div className={`flex items-start gap-4 p-4 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800/30' : 'bg-white'
            }`}>
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Unlock Features
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Completing this challenge unlocks premium platform features
                </p>
              </div>
            </div>

            <div className={`flex items-start gap-4 p-4 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-800/30' : 'bg-white'
            }`}>
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Take Your Time
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  You can start now or complete this challenge later from your dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button onClick={onStart} fullWidth size="lg">
              Start Challenge Now
            </Button>
            <Button onClick={onSkip} variant="outline" fullWidth>
              I'll Do This Later
            </Button>
          </div>

          {/* Time estimate */}
          <p className={`text-center text-sm mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            Estimated time: 5-10 minutes
          </p>
        </motion.div>
      </div>
    </GradientBackground>
  );
};
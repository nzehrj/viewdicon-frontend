{/* import React from 'react';
import { Users, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { Button } from '@components/common/Button';
import { useAppSelector } from '@store/hooks';

type CircleGate = 'C1' | 'C2' | 'C3';

interface CircleRouterProps {
  gate: CircleGate;
  onContinue: () => void;
}

export const CircleRouter: React.FC<CircleRouterProps> = ({ gate, onContinue }) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const getGateInfo = () => {
    switch (gate) {
      case 'C1':
        return {
          icon: <Users className="w-12 h-12 text-white" />,
          color: 'from-blue-500 to-blue-600',
          title: 'Family Circle Required',
          description: 'Complete your Family Tree by connecting with 3 relatives to unlock all features.',
          action: 'Complete Family Tree',
          subtext: 'This helps build your digital lineage and unlocks community features',
        };
      case 'C2':
        return {
          icon: <Award className="w-12 h-12 text-white" />,
          color: 'from-amber-500 to-orange-600',
          title: 'Heritage Challenge Available',
          description: 'Share your cultural knowledge to verify your connection to the motherland.',
          action: 'Start Heritage Challenge',
          subtext: 'You can start now or complete this later from your dashboard',
        };
      case 'C3':
        return {
          icon: <Zap className="w-12 h-12 text-white" />,
          color: 'from-green-500 to-green-600',
          title: 'Quick Path Ready',
          description: 'You have immediate access to all platform features. Welcome home!',
          action: 'Enter Dashboard',
          subtext: 'Your profile is complete and verified',
        };
    }
  };

  const info = getGateInfo();

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          
          <div className="flex justify-center mb-6">
            <div className={`w-24 h-24 bg-gradient-to-br ${info.color} rounded-full flex items-center justify-center shadow-lg`}>
              {info.icon}
            </div>
          </div>

          
          <h1 className={`text-3xl font-bold mb-3 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {info.title}
          </h1>

          <p className={`text-center mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {info.description}
          </p>

          <div className={`p-6 rounded-3xl mb-8 ${
            theme === 'dark' ? 'bg-gray-800/30 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'
          }`}>
            {gate === 'C1' && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                  </div>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    Add 3 family members
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
                  </div>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    Verify relationships
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">3</span>
                  </div>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    Unlock full access
                  </p>
                </div>
              </div>
            )}

            {gate === 'C2' && (
              <div className="text-center">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Answer cultural questions about your heritage to verify your connection.
                  This unlocks premium features and builds trust in the community.
                </p>
              </div>
            )}

            {gate === 'C3' && (
              <div className="text-center">
                <p className={`text-lg font-medium ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  ✓ Full Access Granted
                </p>
                <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  All features are now available to you
                </p>
              </div>
            )}
          </div>

          
          <Button onClick={onContinue} fullWidth size="lg">
            {info.action}
          </Button>

          
          <p className={`text-center text-sm mt-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
            {info.subtext}
          </p>
        </motion.div>
      </div>
    </GradientBackground>
  );
}; */}
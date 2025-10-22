import React, { useState } from 'react';
import { Globe, Users, Heart, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientBackground } from '../common/GradientBackground';
import { Button } from '../common/Button';
import { useAppSelector } from '../../store/hooks';

interface ThreeCirclesProps {
  detectedLocation: 'africa' | 'diaspora' | 'other';
  onContinue: (circle: 'C1' | 'C2' | 'C3') => void;
}

type Circle = 'C1' | 'C2' | 'C3';

export const ThreeCircles: React.FC<ThreeCirclesProps> = ({ detectedLocation, onContinue }) => {
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const theme = useAppSelector((state) => state.theme.theme);

  const circles = {
    C1: {
      title: 'Circle 1: Continental Africans',
      subtitle: 'Children of the Soil',
      icon: MapPin,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500',
      description: 'You live on African soil, breathing the air of your ancestors',
      features: [
        '🌍 Currently residing in Africa',
        '🏘️ Direct tribal and ethnic knowledge',
        '🗣️ Native languages and local dialects',
        '👥 Community verification options',
        '🎭 Deep cultural immersion',
      ],
      recommended: detectedLocation === 'africa',
    },
    C2: {
      title: 'Circle 2: Diaspora Africans',
      subtitle: 'Children of the Journey',
      icon: Users,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500',
      description: 'Your roots are African, though you walk distant lands',
      features: [
        '✈️ African heritage, living abroad',
        '👨‍👩‍👧‍👦 Family stories and ancestral knowledge',
        '🌳 Ancestral homeland connection',
        '🌐 Heritage languages preserved',
        '🏆 Heritage Challenge to prove roots',
      ],
      recommended: detectedLocation === 'diaspora',
    },
    C3: {
      title: 'Circle 3: Cultural Allies',
      subtitle: 'Children of the Heart',
      icon: Heart,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500',
      description: 'Though not born of Africa, you carry her in your spirit',
      features: [
        '❤️ Deep respect for African culture',
        '📚 Cultural learning and appreciation',
        '🤝 Community endorsement pathway',
        '🌍 Cultural integration journey',
        '🎓 Language learning support',
      ],
      recommended: detectedLocation === 'other',
    },
  };

  const handleSelect = (circle: Circle) => {
    setSelectedCircle(circle);
  };

  const handleContinue = () => {
    if (selectedCircle) {
      onContinue(selectedCircle);
    }
  };

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {/* Header */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Globe className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              The Three Circles of Belonging
            </h1>

            <p className={`text-lg md:text-xl mb-2 italic ${
              theme === 'dark' ? 'text-amber-300' : 'text-amber-600'
            }`}>
              "Ubuntu: I am because we are"
            </p>

            <p className={`text-base ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Choose the circle that reflects your journey to Africa
            </p>
          </motion.div>

          {/* Circles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {(Object.keys(circles) as Circle[]).map((circleKey, index) => {
              const circle = circles[circleKey];
              const IconComponent = circle.icon;
              const isSelected = selectedCircle === circleKey;
              const isRecommended = circle.recommended;

              return (
                <motion.div
                  key={circleKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Recommended Badge */}
                  {isRecommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <div className={`px-4 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${circle.color}`}>
                        Recommended for You
                      </div>
                    </div>
                  )}

                  <motion.button
                    onClick={() => handleSelect(circleKey)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-6 rounded-3xl border-4 transition-all ${
                      isSelected
                        ? `${circle.borderColor} ${circle.bgColor}`
                        : theme === 'dark'
                        ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    } ${isRecommended ? 'ring-4 ring-amber-400/30' : ''}`}
                  >
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${circle.color} flex items-center justify-center`}>
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className={`text-xl font-bold mb-2 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {circle.title}
                    </h3>

                    <p className={`text-sm font-medium mb-3 ${
                      theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
                    }`}>
                      {circle.subtitle}
                    </p>

                    {/* Description */}
                    <p className={`text-sm mb-4 italic ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      "{circle.description}"
                    </p>

                    {/* Features */}
                    <div className={`text-left space-y-2 p-4 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
                    }`}>
                      {circle.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className={`text-sm flex items-start gap-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-4 flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-semibold"
                      >
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        Selected
                      </motion.div>
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>

          {/* Info Box */}
          <div className={`p-6 rounded-2xl mb-8 ${
            theme === 'dark' ? 'bg-blue-900/20 border-2 border-blue-500/30' : 'bg-blue-50 border-2 border-blue-200'
          }`}>
            <p className={`text-sm text-center ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>
              <strong>Note:</strong> Your selection determines your verification pathway, 
              language support, and community connections. 
              {selectedCircle === 'C2' && (
                <span className="block mt-2 font-semibold text-amber-600 dark:text-amber-400">
                  ⚠️ Diaspora members must complete the Heritage Challenge to verify their African roots.
                </span>
              )}
            </p>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleContinue}
              disabled={!selectedCircle}
              className="px-12"
              size="lg"
            >
              {selectedCircle ? (
                <>
                  {selectedCircle === 'C2' 
                    ? 'Continue to Heritage Challenge'
                    : `Continue with ${circles[selectedCircle].title.split(':')[0]}`
                  }
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                'Select a Circle to Continue'
              )}
            </Button>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};
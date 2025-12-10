import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  Users,
  Shield,
  MessageCircle,
  Briefcase,
  Target,
  Award,
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface OnboardingTourProps {
  isOpen?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
  steps?: TourStep[];
}

/**
 * ONBOARDING TOUR COMPONENT
 * 
 * Interactive first-time user guide with step-by-step walkthrough
 * Features: Multi-step tour, progress tracking, skip option
 * Premium professional design with smooth animations
 * 
 * Location: src/components/onboarding/OnboardingTour.tsx
 */
export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen = false,
  onComplete,
  onSkip,
  steps: customSteps,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  // Add shimmer animation CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      .animate-shimmer {
        animation: shimmer 2s infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const defaultSteps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Viewdicon',
      description: 'The premier African professional networking platform. Let us guide you through the key features that will elevate your professional journey.',
      icon: Sparkles,
      position: 'center',
    },
    {
      id: 'villages',
      title: 'Professional Villages',
      description: 'Join industry-specific communities designed for collaboration. Access specialized tools and connect with experts in your field.',
      icon: Users,
      position: 'center',
    },
    {
      id: 'security',
      title: 'Nkisi Shield Protection',
      description: 'Enterprise-grade security powered by advanced verification systems. Your data and identity are protected at every level.',
      icon: Shield,
      position: 'center',
    },
    {
      id: 'networking',
      title: 'Strategic Networking',
      description: 'Build meaningful professional relationships with verified kinsfolk. Collaborate, communicate, and grow your network strategically.',
      icon: MessageCircle,
      position: 'center',
    },
    {
      id: 'business',
      title: 'Business Operations',
      description: 'Comprehensive suite of professional tools including escrow services, session management, and real-time analytics.',
      icon: Briefcase,
      position: 'center',
    },
    {
      id: 'achievements',
      title: 'Professional Recognition',
      description: 'Build your reputation through verified achievements, peer ratings, and milestone completions that showcase your expertise.',
      icon: Award,
      position: 'center',
    },
    {
      id: 'complete',
      title: 'Ready to Begin',
      description: 'Your professional journey starts now. Explore the platform, connect with peers, and unlock opportunities in the digital Motherland.',
      icon: Target,
      position: 'center',
    },
  ];

  const steps = customSteps || defaultSteps;
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip?.();
  };

  const handleComplete = () => {
    setIsVisible(false);
    onComplete?.();
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];
  const StepIcon = currentStepData.icon;
  const isLastStep = currentStep === steps.length - 1;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        {/* Professional Backdrop with Gradient */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/85 to-gray-900/90 backdrop-blur-md"
        />

        {/* Professional Tour Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          transition={{ 
            type: 'spring',
            stiffness: 300,
            damping: 30,
            duration: 0.4
          }}
          className={`relative w-full max-w-lg mx-4 rounded-3xl overflow-hidden ${
            theme === 'dark' 
              ? 'bg-gradient-to-b from-gray-900 to-gray-900/95 shadow-2xl shadow-black/40 border border-gray-800/50' 
              : 'bg-white shadow-2xl shadow-gray-900/20 border border-gray-100'
          }`}
        >
          {/* Premium Progress Bar */}
          <div className={`h-1.5 ${
            theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100'
          }`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 shadow-lg shadow-green-500/30 relative"
            >
              {/* Progress glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </motion.div>
          </div>

          {/* Header Section */}
          <div className="p-8 pb-6">
            <div className="flex items-start justify-between mb-6">
              {/* Premium Icon Container */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className={`relative flex items-center justify-center w-16 h-16 rounded-2xl ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30' 
                    : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200'
                }`}
              >
                <StepIcon className={`w-8 h-8 ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`} />
                
                {/* Icon glow effect */}
                <div className={`absolute inset-0 rounded-2xl blur-xl opacity-50 ${
                  theme === 'dark' ? 'bg-green-500/30' : 'bg-green-500/20'
                }`} />
              </motion.div>

              {/* Professional Skip Button */}
              {!isLastStep && (
                <button
                  onClick={handleSkip}
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-all hover:scale-105 ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800/50' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Skip Tour
                </button>
              )}
            </div>

            {/* Step Counter with Professional Styling */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 border border-gray-700/50' 
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className={`text-xs font-semibold tracking-wide ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                STEP {currentStep + 1} OF {steps.length}
              </span>
            </motion.div>

            {/* Professional Title */}
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-3xl font-bold mb-4 leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {currentStepData.title}
            </motion.h2>

            {/* Professional Description */}
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`text-base leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {currentStepData.description}
            </motion.p>
          </div>

          {/* Professional Step Indicators */}
          <div className="px-8 pb-6">
            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentStep
                      ? 'flex-1 bg-gradient-to-r from-green-500 to-emerald-500 shadow-md shadow-green-500/50'
                      : index < currentStep
                      ? 'w-2 bg-green-500'
                      : theme === 'dark'
                      ? 'w-2 bg-gray-700/50'
                      : 'w-2 bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Professional Navigation Buttons */}
          <div className={`flex items-center gap-3 p-8 pt-6 border-t ${
            theme === 'dark' ? 'border-gray-800/50' : 'border-gray-100'
          }`}>
            {/* Premium Previous Button */}
            {currentStep > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handlePrevious}
                className={`group flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 text-white'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900'
                }`}
              >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
                <span>Back</span>
              </motion.button>
            )}

            {/* Premium Next/Complete Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleNext}
              className={`group flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 relative overflow-hidden ${
                isLastStep
                  ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white shadow-lg shadow-green-500/40'
                  : theme === 'dark'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md shadow-green-500/30'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md shadow-green-500/30'
              }`}
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              
              {isLastStep ? (
                <>
                  <Check className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>Get Started</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Premium Floating Decoration Elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{ opacity: 0.15, scale: 1, rotate: 180 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="absolute top-20 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 blur-3xl pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{ opacity: 0.12, scale: 1, rotate: -180 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 blur-3xl pointer-events-none"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-green-400 blur-3xl pointer-events-none"
        />
      </div>
    </AnimatePresence>
  );
};

export default OnboardingTour;
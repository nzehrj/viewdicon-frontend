import React, { useState, useEffect } from 'react';
import { Fingerprint, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { ProgressBar } from '@components/common/ProgressBar';
import { useAppSelector } from '@store/hooks';

interface FingerprintSetupProps {
  onNext: () => void;
}

export const FingerprintSetup: React.FC<FingerprintSetupProps> = ({ onNext }) => {
  const [step, setStep] = useState<'idle' | 'scanning' | 'success'>('idle');
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    if (step === 'idle') {
      const timer = setTimeout(() => setStep('scanning'), 1000);
      return () => clearTimeout(timer);
    }
    if (step === 'scanning') {
      const timer = setTimeout(() => setStep('success'), 2500);
      return () => clearTimeout(timer);
    }
    if (step === 'success') {
      const timer = setTimeout(onNext, 1500);
      return () => clearTimeout(timer);
    }
  }, [step, onNext]);

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Account Security Binding
          </h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <ProgressBar progress={50} size="lg" className="flex-1 w-full" />
            <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Step 1 of 2: Fingerprint Setup
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-2">
          <div className={`w-full max-w-[380px] p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl ${
            theme === 'dark' ? 'bg-gray-800/30 backdrop-blur-sm' : 'bg-gray-100'
          }`}>
            <h2 className={`text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Secure with Fingerprint ID
            </h2>
            <p className={`mb-6 sm:mb-8 text-xs sm:text-sm md:text-base leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Place your registered finger on your device's sensor to bind it to your account.
            </p>

            {/* Fingerprint Circle Container - Responsive sizing */}
            <div className="flex items-center justify-center py-6 sm:py-8 md:py-12">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 flex items-center justify-center">
                
                {/* Animated Rings - Expand outward from center */}
                {step === 'scanning' && (
                  <>
                    {/* Ring 1 */}
                    <motion.div
                      className="absolute rounded-full border-2"
                      style={{
                        borderColor: 'rgba(16, 185, 129, 0.6)',
                      }}
                      initial={{ width: 140, height: 140, opacity: 0 }}
                      animate={{
                        width: [140, 160, 180, 200, 220, 240],
                        height: [140, 160, 180, 200, 220, 240],
                        opacity: [0.8, 0.7, 0.5, 0.3, 0.1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />

                    {/* Ring 2 */}
                    <motion.div
                      className="absolute rounded-full border-2"
                      style={{
                        borderColor: 'rgba(16, 185, 129, 0.6)',
                      }}
                      initial={{ width: 140, height: 140, opacity: 0 }}
                      animate={{
                        width: [140, 160, 180, 200, 220, 240],
                        height: [140, 160, 180, 200, 220, 240],
                        opacity: [0.8, 0.7, 0.5, 0.3, 0.1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: 0.5,
                      }}
                    />

                    {/* Ring 3 */}
                    <motion.div
                      className="absolute rounded-full border-2"
                      style={{
                        borderColor: 'rgba(16, 185, 129, 0.6)',
                      }}
                      initial={{ width: 140, height: 140, opacity: 0 }}
                      animate={{
                        width: [140, 160, 180, 200, 220, 240],
                        height: [140, 160, 180, 200, 220, 240],
                        opacity: [0.8, 0.7, 0.5, 0.3, 0.1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: 1.0,
                      }}
                    />

                    {/* Ring 4 */}
                    <motion.div
                      className="absolute rounded-full border-2"
                      style={{
                        borderColor: 'rgba(16, 185, 129, 0.6)',
                      }}
                      initial={{ width: 140, height: 140, opacity: 0 }}
                      animate={{
                        width: [140, 160, 180, 200, 220, 240],
                        height: [140, 160, 180, 200, 220, 240],
                        opacity: [0.8, 0.7, 0.5, 0.3, 0.1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeOut',
                        delay: 1.5,
                      }}
                    />
                  </>
                )}

                {/* Main Circle with Border - Responsive */}
                <motion.div
                  className={`relative w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-full border-4 flex items-center justify-center shadow-2xl ${
                    step === 'success'
                      ? 'border-green-500 bg-white dark:bg-gray-800'
                      : step === 'scanning'
                      ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                  }`}
                  animate={
                    step === 'scanning'
                      ? {
                          scale: [1, 1.02, 1],
                        }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat: step === 'scanning' ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                >
                  {step === 'success' ? (
                    // Success Check Icon - Responsive
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 200, 
                        damping: 15,
                        duration: 0.6 
                      }}
                    >
                      <Check 
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 text-green-500" 
                        strokeWidth={3} 
                      />
                    </motion.div>
                  ) : (
                    // Fingerprint Icon - Responsive
                    <motion.div
                      animate={
                        step === 'scanning'
                          ? {
                              scale: [1, 1.05, 1],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: step === 'scanning' ? Infinity : 0,
                        ease: 'easeInOut',
                      }}
                    >
                      <Fingerprint
                        className={`w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 ${
                          step === 'scanning'
                            ? 'text-green-500'
                            : theme === 'dark'
                            ? 'text-gray-400'
                            : 'text-gray-500'
                        }`}
                        strokeWidth={1.5}
                      />
                    </motion.div>
                  )}
                </motion.div>

                {/* Success expanding ring - Responsive */}
                {step === 'success' && (
                  <>
                    <motion.div
                      className="absolute rounded-full border-4 border-green-500"
                      initial={{ width: 176, height: 176, opacity: 1 }}
                      animate={{
                        width: 240,
                        height: 240,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.6,
                        ease: 'easeOut',
                      }}
                    />
                    <motion.div
                      className="absolute rounded-full border-4 border-green-400"
                      initial={{ width: 176, height: 176, opacity: 0.8 }}
                      animate={{
                        width: 260,
                        height: 260,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.8,
                        ease: 'easeOut',
                        delay: 0.1,
                      }}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Status Text - Responsive */}
            <p
              className={`text-center font-medium text-sm sm:text-base md:text-lg ${
                step === 'success'
                  ? 'text-green-600 dark:text-green-400'
                  : theme === 'dark'
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
              aria-live="polite"
            >
              {step === 'idle' && 'Place your finger on the sensor'}
              {step === 'scanning' && 'Scanning fingerprint...'}
              {step === 'success' && '✓ Fingerprint verified!'}
            </p>

            {/* Subtitle during scanning */}
            {step === 'scanning' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-center text-xs sm:text-sm mt-2 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                }`}
              >
                Please hold still...
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default FingerprintSetup;




















































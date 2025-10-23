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

  const scanLineVariants = (delay: number) => ({
    scanning: {
      y: ['-100%', '100%'],
      opacity: [0.6, 0.6],
      transition: {
        y: { duration: 1, repeat: Infinity, ease: 'linear', delay },
        opacity: { duration: 1, repeat: Infinity, ease: 'linear', delay },
      },
    },
    idle: { y: '-100%', opacity: 0 },
    success: { y: '100%', opacity: 0, transition: { duration: 0.3 } },
  });

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col p-4 sm:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Account Security Binding
          </h1>
          <div className="flex items-center gap-4">
            <ProgressBar progress={50} size="lg" className="flex-1" />
            <span className={`text-sm whitespace-nowrap ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Step 1 of 2: Fingerprint Setup
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className={`w-full max-w-[320px] p-6 sm:p-8 rounded-3xl ${
            theme === 'dark' ? 'bg-gray-800/30 backdrop-blur-sm' : 'bg-gray-100'
          }`}>
            <h2 className={`text-xl sm:text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Secure with Fingerprint ID
            </h2>
            <p className={`mb-8 text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Place your registered finger on your device's sensor to bind it to your account.
            </p>

            {/* Fingerprint Icon */}
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="relative w-24 sm:w-28 h-32 sm:h-36">
                <div className={`absolute inset-0 rounded-t-3xl rounded-b-xl flex items-center justify-center shadow-lg ${
                  step === 'success'
                    ? 'bg-gradient-to-br from-blue-500 to-teal-400 shadow-teal-500/25'
                    : 'bg-gradient-to-br from-blue-600 to-cyan-500 shadow-cyan-500/25'
                }`}>
                  {step === 'success' ? (
                    <Check className="w-20 h-20 sm:w-24 sm:h-24 text-teal-900" />
                  ) : (
                    <Fingerprint className="w-20 h-20 sm:w-24 sm:h-24 text-teal-100" />
                  )}
                </div>

                {/* Scanning Lines */}
                {step === 'scanning' && (
                  <>
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-blue-400"
                      variants={scanLineVariants(0)}
                      animate={step}
                    />
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-teal-500"
                      variants={scanLineVariants(0.3)}
                      animate={step}
                    />
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-cyan-400"
                      variants={scanLineVariants(0.6)}
                      animate={step}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Status Text */}
            <p
              className={`text-center font-medium text-sm sm:text-base ${
                step === 'success'
                  ? 'text-teal-600 dark:text-teal-400'
                  : theme === 'dark'
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
              aria-live="polite"
            >
              {step === 'idle' && 'Place your finger on the sensor'}
              {step === 'scanning' && 'Scanning...'}
              {step === 'success' && 'Fingerprint verified!'}
            </p>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};
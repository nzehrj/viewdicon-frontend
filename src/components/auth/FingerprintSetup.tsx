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
      <div className="min-h-screen flex flex-col p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
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
          <div className={`w-full max-w-md p-8 rounded-3xl ${
            theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-100'
          }`}>
            <h2 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Secure with Fingerprint ID
            </h2>
            <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Place your registered finger on your device's sensor to bind it to your account.
            </p>

            {/* Fingerprint Icon */}
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{
                  scale: step === 'scanning' ? [1, 1.1, 1] : 1,
                  rotate: step === 'scanning' ? [0, 5, -5, 0] : 0,
                }}
                transition={{ duration: 0.5, repeat: step === 'scanning' ? Infinity : 0 }}
                className="relative"
              >
                <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                  step === 'success'
                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                    : 'bg-gradient-to-br from-green-900 to-gray-900'
                }`}>
                  {step === 'success' ? (
                    <Check className="w-16 h-16 text-white" />
                  ) : (
                    <Fingerprint className="w-16 h-16 text-green-400" />
                  )}
                </div>

                {/* Scanning Animation */}
                {step === 'scanning' && (
                  <>
                    <motion.div
                      className="absolute inset-0 border-4 border-green-500 rounded-full"
                      animate={{ scale: [1, 1.3], opacity: [1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-0 border-4 border-green-400 rounded-full"
                      animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                    />
                  </>
                )}
              </motion.div>
            </div>

            {/* Status Text */}
            <p className={`text-center font-medium ${
              step === 'success'
                ? 'text-green-600 dark:text-green-400'
                : theme === 'dark'
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}>
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
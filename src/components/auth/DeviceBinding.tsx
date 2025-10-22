import React, { useState, useEffect } from 'react';
import { Smartphone, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientBackground } from '@components/common/GradientBackground';
import { ProgressBar } from '@components/common/ProgressBar';
import { useAppSelector } from '@store/hooks';

interface DeviceBindingProps {
  onComplete: () => void;
}

export const DeviceBinding: React.FC<DeviceBindingProps> = ({ onComplete }) => {
  const [status, setStatus] = useState<'generating' | 'binding' | 'success'>('generating');
  const [progress, setProgress] = useState(0);
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    // Simulate key generation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setStatus('binding');
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (status === 'binding') {
      setTimeout(() => {
        setStatus('success');
        setTimeout(onComplete, 1500);
      }, 2000);
    }
  }, [status, onComplete]);

  return (
    <GradientBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-white'}`}
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{
                  rotate: status === 'generating' ? 360 : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: status === 'generating' ? Infinity : 0,
                  ease: 'linear',
                }}
                className={`w-24 h-24 rounded-full flex items-center justify-center ${
                  status === 'success'
                    ? 'bg-gradient-to-br from-green-500 to-green-600'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                }`}
              >
                {status === 'success' ? (
                  <Check className="w-12 h-12 text-white" />
                ) : (
                  <Smartphone className="w-12 h-12 text-white" />
                )}
              </motion.div>
            </div>

            {/* Title */}
            <h2 className={`text-2xl font-bold text-center mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {status === 'generating' && 'Generating Security Keys'}
              {status === 'binding' && 'Binding Device'}
              {status === 'success' && 'Device Bound Successfully!'}
            </h2>

            {/* Description */}
            <p className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {status === 'generating' && 'Creating cryptographic keys to secure your account...'}
              {status === 'binding' && 'Registering this device with your Afro-ID...'}
              {status === 'success' && 'Your device is now securely bound to your account.'}
            </p>

            {/* Progress Bar */}
            {status === 'generating' && (
              <ProgressBar progress={progress} showLabel size="lg" />
            )}

            {/* Info */}
            {status !== 'success' && (
              <div className={`mt-6 p-4 rounded-xl ${
                theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'
              }`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <strong className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    Device Limit:
                  </strong>{' '}
                  You can use up to 3 devices (elders up to 4)
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </GradientBackground>
  );
};
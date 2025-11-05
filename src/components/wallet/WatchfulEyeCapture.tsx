import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Camera } from 'lucide-react'; // ✅ REMOVED: Shield, AlertCircle
import { useAppSelector } from '@store/hooks';
import { captureWatchfulEye, isFaceCaptureSupported } from '@/utils/faceCapture';
import type { FinancialIntent } from '@/types/security.types';

interface WatchfulEyeCaptureProps {
  intent: FinancialIntent;
  amount: number;
  currency: string;
  onCapture: (faceHash: string) => void;
  onError: (error: string) => void;
  onSkip?: () => void;
}

export const WatchfulEyeCapture: React.FC<WatchfulEyeCaptureProps> = ({
  intent,
  amount,
  currency,
  onCapture,
  onError,
  onSkip,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [capturing, setCapturing] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    // Auto-start capture after brief info display
    const timer = setTimeout(() => {
      setShowInfo(false);
      startCapture();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const startCapture = async () => {
    if (!isFaceCaptureSupported()) {
      onError('Face capture not supported on this device');
      return;
    }

    setCapturing(true);

    try {
      const result = await captureWatchfulEye();

      if (result.success && result.face_hash) {
        onCapture(result.face_hash);
      } else {
        onError(result.error || 'Failed to capture face');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setCapturing(false);
    }
  };

  const getIntentMessage = () => {
    switch (intent) {
      case 'WALLET_TRANSFER':
        return 'Sending money';
      case 'ESCROW_RELEASE':
        return 'Releasing escrow';
      case 'LIVE_STREAM_GIFT':
        return 'Sending gift';
      case 'CROSS_BORDER_TRANSFER':
        return 'Cross-border transfer';
      case 'CASH_OUT':
        return 'Cashing out';
      case 'CRYPTO_MOVE':
        return 'Crypto transaction';
      default:
        return 'Financial transaction';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`w-full max-w-sm p-6 rounded-2xl ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        } shadow-2xl`}
      >
        {showInfo ? (
          /* Info Screen */
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center"
            >
              <Eye className="w-8 h-8 text-white" />
            </motion.div>

            <h3 className={`text-xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              The Watchful Eye
            </h3>

            <p className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {getIntentMessage()} • {currency} {amount.toLocaleString()}
            </p>

            <div className={`p-4 rounded-xl ${
              theme === 'dark' ? 'bg-purple-900/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
            }`}>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
              }`}>
                For your protection, we'll verify it's really you before this transaction proceeds.
              </p>
            </div>
          </div>
        ) : capturing ? (
          /* Capturing Screen */
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
            >
              <Camera className="w-8 h-8 text-white" />
            </motion.div>

            <h3 className={`text-xl font-bold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Verifying...
            </h3>

            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Please look at the camera
            </p>

            <motion.div
              className={`mt-4 h-1 rounded-full overflow-hidden ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
              />
            </motion.div>
          </div>
        ) : null}

        {/* Skip option (if allowed) */}
        {onSkip && showInfo && (
          <button
            onClick={onSkip}
            className={`w-full mt-4 text-sm ${
              theme === 'dark' ? 'text-gray-500 hover:text-gray-400' : 'text-gray-600 hover:text-gray-700'
            }`}
          >
            Skip verification (not recommended)
          </button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WatchfulEyeCapture;
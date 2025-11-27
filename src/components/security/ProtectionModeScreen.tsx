import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, AlertTriangle } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import type { ProtectionMode } from '@/types/security.types';
import { Button } from '@components/common/Button';

interface ProtectionModeScreenProps {
  protectionMode: ProtectionMode;
  onRequestCircle: () => void;
  onContactSupport: () => void;
}

export const ProtectionModeScreen: React.FC<ProtectionModeScreenProps> = ({
  protectionMode,
  onRequestCircle,
  onContactSupport,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const getReasonMessage = (): string => {
    switch (protectionMode.reason) {
      case 'face_mismatch':
        return 'We detected a face that doesn\'t match your blessing';
      case 'new_device':
        return 'This drum (device) is not yet blessed for your account';
      case 'suspicious_behavior':
        return 'Unusual activity was detected on your account';
      case 'location_mismatch':
        return 'Your location appears different from where you usually are';
      case 'limit_exceeded':
        return 'This action exceeds your current blessing limits';
      default:
        return 'Something unusual was detected';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-800/95'
          : 'bg-gradient-to-br from-purple-600/95 via-indigo-600/95 to-purple-500/95'
      } backdrop-blur-sm`}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`w-full max-w-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl my-auto shadow-2xl ${
          theme === 'dark' 
            ? 'bg-gray-900/90 border border-gray-800' 
            : 'bg-white/90 border border-white/20'
        } backdrop-blur-xl`}
      >
        {/* Animated Shield Icon */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            {/* Pulsing aura */}
            <motion.div
              className="absolute inset-0 rounded-full bg-purple-500/30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            
            {/* Shield icon */}
            <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-purple-600 to-indigo-700'
                : 'bg-gradient-to-br from-purple-500 to-indigo-600'
            }`}>
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <h2 className={`text-2xl sm:text-3xl font-bold text-center mb-3 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          You Are Under Protection
        </h2>

        {/* Subtitle */}
        <p className={`text-center text-sm sm:text-base mb-6 ${
          theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
        }`}>
          Your ancestral shield has been activated
        </p>

        {/* Reason Box */}
        <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border-2 ${
          theme === 'dark' 
            ? 'bg-amber-900/20 border-amber-500/30' 
            : 'bg-amber-50 border-amber-200'
        }`}>
          <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          }`} />
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-semibold mb-1 ${
              theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
            }`}>
              Why This Happened
            </p>
            <p className={`text-sm leading-relaxed ${
              theme === 'dark' ? 'text-amber-200' : 'text-amber-700'
            }`}>
              {getReasonMessage()}
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className={`p-4 rounded-xl mb-6 ${
          theme === 'dark' 
            ? 'bg-purple-900/20 border border-purple-800/30' 
            : 'bg-purple-50 border border-purple-200'
        }`}>
          <div className="flex items-start gap-3 mb-3">
            <Users className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold mb-1 ${
                theme === 'dark' ? 'text-purple-300' : 'text-purple-800'
              }`}>
                Your Circle Will Be Called
              </p>
              <p className={`text-sm leading-relaxed ${
                theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
              }`}>
                We'll ask your trusted family and friends to confirm this is really you. They'll receive a message shortly.
              </p>
            </div>
          </div>

          {/* Restrictions */}
          {protectionMode.restrictions.length > 0 && (
            <div className={`pt-3 border-t ${
              theme === 'dark' ? 'border-purple-800/30' : 'border-purple-200'
            }`}>
              <p className={`text-xs sm:text-sm font-semibold mb-2 ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-700'
              }`}>
                Temporarily Protected:
              </p>
              <ul className={`text-xs sm:text-sm space-y-1 ${
                theme === 'dark' ? 'text-purple-300' : 'text-purple-600'
              }`}>
                {protectionMode.restrictions.map((restriction, idx) => (
                  <li key={idx} className="break-words">
                    • {restriction.replace(/_/g, ' ')}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={onRequestCircle}
            fullWidth
            size="lg"
            className={`min-h-[48px] font-semibold ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white'
            }`}
          >
            Call My Circle Now
          </Button>

          <Button
            onClick={onContactSupport}
            variant="outline"
            fullWidth
            size="lg"
            className={`min-h-[48px] font-semibold ${
              theme === 'dark'
                ? 'border-2 border-purple-500/50 text-purple-300 hover:bg-purple-900/30 hover:border-purple-400'
                : 'border-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400'
            }`}
          >
            Contact Support
          </Button>
        </div>

        {/* Help Text */}
        <p className={`text-center text-xs sm:text-sm mt-4 px-2 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          This is for your protection. Your funds are safe.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ProtectionModeScreen;
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-800/95 backdrop-blur-sm overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`w-full max-w-md p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl my-auto ${
          theme === 'dark' ? 'bg-gray-900/90' : 'bg-white/90'
        } backdrop-blur-xl shadow-2xl`}
      >
        {/* Animated Shield Icon - Responsive sizing */}
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
          className="flex justify-center mb-4 sm:mb-6"
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
            
            {/* Shield icon - Responsive */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Title - Responsive */}
        <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold text-center mb-2 sm:mb-3 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          You Are Under Protection
        </h2>

        {/* Subtitle - Responsive */}
        <p className={`text-center text-xs sm:text-sm md:text-base mb-4 sm:mb-6 ${
          theme === 'dark' ? 'text-purple-300' : 'text-purple-700'
        }`}>
          Your ancestral shield has been activated
        </p>

        {/* Reason Box - Responsive padding */}
        <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3 ${
          theme === 'dark' 
            ? 'bg-amber-900/20 border-2 border-amber-500/30' 
            : 'bg-amber-50 border-2 border-amber-200'
        }`}>
          <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${
            theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
          }`} />
          <div className="flex-1 min-w-0">
            <p className={`text-xs sm:text-sm font-semibold mb-1 ${
              theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
            }`}>
              Why This Happened
            </p>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              theme === 'dark' ? 'text-amber-200' : 'text-amber-700'
            }`}>
              {getReasonMessage()}
            </p>
          </div>
        </div>

        {/* Info Box - Responsive padding */}
        <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl mb-4 sm:mb-6 ${
          theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-50'
        }`}>
          <div className="flex items-start gap-2 sm:gap-3 mb-3">
            <Users className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`} />
            <div className="flex-1 min-w-0">
              <p className={`text-xs sm:text-sm font-semibold mb-1 ${
                theme === 'dark' ? 'text-purple-300' : 'text-purple-800'
              }`}>
                Your Circle Will Be Called
              </p>
              <p className={`text-xs sm:text-sm leading-relaxed ${
                theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
              }`}>
                We'll ask your trusted family and friends to confirm this is really you. They'll receive a message shortly.
              </p>
            </div>
          </div>

          {/* Restrictions - Responsive */}
          {protectionMode.restrictions.length > 0 && (
            <div className="pt-3 border-t border-purple-500/20">
              <p className={`text-xs font-semibold mb-2 ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-700'
              }`}>
                Temporarily Protected:
              </p>
              <ul className={`text-xs space-y-1 ${
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

        {/* Actions - Stack on mobile */}
        <div className="space-y-3">
          <Button
            onClick={onRequestCircle}
            fullWidth
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 min-h-[48px]"
          >
            Call My Circle Now
          </Button>

          <Button
            onClick={onContactSupport}
            variant="outline"
            fullWidth
            size="lg"
            className="min-h-[48px]"
          >
            Contact Support
          </Button>
        </div>

        {/* Help Text - Responsive */}
        <p className={`text-center text-xs sm:text-sm mt-3 sm:mt-4 px-2 ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
        }`}>
          This is for your protection. Your funds are safe.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ProtectionModeScreen;
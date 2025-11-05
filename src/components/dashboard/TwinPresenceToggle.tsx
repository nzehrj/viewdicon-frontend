import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Ghost, Lock, Eye, EyeOff } from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface TwinPresenceToggleProps {
  spiritAvatar: string; // URL to spirit form avatar (used by parent component for display)
  fleshPhoto?: string; // URL to real photo (only if user has access)
  hasFleshAccess: boolean; // Does current viewer have permission to see flesh form?
  currentMode: 'spirit' | 'flesh';
  onToggle: (mode: 'spirit' | 'flesh') => void;
  photoStatus?: 'verified_real' | 'flagged_filtered' | 'rejected_ai' | 'not_uploaded';
}

export const TwinPresenceToggle: React.FC<TwinPresenceToggleProps> = ({
  // spiritAvatar is used by parent component, not directly in this toggle button
  fleshPhoto,
  hasFleshAccess,
  currentMode,
  onToggle,
  photoStatus = 'not_uploaded',
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [showAccessMessage, setShowAccessMessage] = useState(false);

  const handleToggle = () => {
    if (!hasFleshAccess) {
      setShowAccessMessage(true);
      setTimeout(() => setShowAccessMessage(false), 3000);
      return;
    }

    onToggle(currentMode === 'spirit' ? 'flesh' : 'spirit');
  };

  const canShowFlesh = hasFleshAccess && fleshPhoto && photoStatus === 'verified_real';

  return (
    <div className="relative">
      {/* Toggle Button */}
      <motion.button
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-medium text-sm
          transition-all shadow-lg
          ${currentMode === 'spirit'
            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
            : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
          }
          ${!canShowFlesh && 'opacity-60'}
        `}
        disabled={!canShowFlesh && currentMode === 'spirit'}
      >
        {/* Icon */}
        {currentMode === 'spirit' ? (
          <Ghost className="w-4 h-4" />
        ) : (
          <User className="w-4 h-4" />
        )}

        {/* Label */}
        <span className="hidden sm:inline">
          {currentMode === 'spirit' ? 'Ancestral Form' : 'Living Face'}
        </span>

        {/* Mobile short label */}
        <span className="sm:hidden">
          {currentMode === 'spirit' ? 'Mask' : 'Face'}
        </span>

        {/* Toggle indicator */}
        {canShowFlesh && (
          <motion.div
            className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center"
            layout
          >
            {currentMode === 'spirit' ? (
              <Eye className="w-3 h-3" />
            ) : (
              <EyeOff className="w-3 h-3" />
            )}
          </motion.div>
        )}

        {/* Lock icon if no access */}
        {!canShowFlesh && (
          <Lock className="w-4 h-4" />
        )}
      </motion.button>

      {/* Access Denied Message */}
      <AnimatePresence>
        {showAccessMessage && !hasFleshAccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              absolute top-full left-0 right-0 mt-2 p-3 rounded-xl shadow-xl z-50
              ${theme === 'dark' 
                ? 'bg-gray-800 border border-gray-700' 
                : 'bg-white border border-gray-200'
              }
            `}
          >
            <div className="flex items-start gap-2">
              <Lock className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
              }`} />
              <div>
                <p className={`text-xs font-semibold mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Face Shared Within Inner Fire Only
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Build trust to see their living face
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Status Badge (for profile owner only) */}
      {photoStatus !== 'not_uploaded' && photoStatus !== 'verified_real' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`
            absolute -top-1 -right-1 w-3 h-3 rounded-full border-2
            ${theme === 'dark' ? 'border-gray-900' : 'border-white'}
            ${photoStatus === 'flagged_filtered' ? 'bg-yellow-500' : 'bg-red-500'}
          `}
          title={
            photoStatus === 'flagged_filtered' 
              ? 'Photo flagged for heavy filtering' 
              : 'AI-generated photo rejected'
          }
        />
      )}
    </div>
  );
};

export default TwinPresenceToggle;
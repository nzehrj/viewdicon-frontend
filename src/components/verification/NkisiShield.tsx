import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '@store/hooks';
import type { ShieldState } from '@/types/verification.types';
import { getShieldStateColor, getShieldStateMessage } from '@/types/verification.types';

interface NkisiShieldProps {
  state: ShieldState;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  children: React.ReactNode; // Avatar or content to wrap
}

export const NkisiShield: React.FC<NkisiShieldProps> = ({
  state,
  size = 'md',
  showTooltip = true,
  children,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const shieldColor = getShieldStateColor(state);
  const shieldMessage = getShieldStateMessage(state);

  // Size-based dimensions
  const ringWidths = {
    sm: '2px',
    md: '3px',
    lg: '4px',
  };

  const ringPadding = {
    sm: 'p-0.5',
    md: 'p-1',
    lg: 'p-1.5',
  };

  // Animation variants based on state
  const getAnimation = () => {
    switch (state) {
      case 'calm':
        return {
          boxShadow: [
            `0 0 8px ${shieldColor}40`,
            `0 0 12px ${shieldColor}60`,
            `0 0 8px ${shieldColor}40`,
          ],
        };
      case 'unsettled':
        return {
          boxShadow: [
            `0 0 8px ${shieldColor}60`,
            `0 0 4px ${shieldColor}20`,
            `0 0 8px ${shieldColor}60`,
          ],
        };
      case 'under_protection':
        return {
          boxShadow: [
            `0 0 12px ${shieldColor}80`,
            `0 0 16px ${shieldColor}40`,
            `0 0 12px ${shieldColor}80`,
          ],
        };
    }
  };

  return (
    <div className="relative inline-block group">
      {/* Shield Ring */}
      <motion.div
        className={`relative ${ringPadding[size]} rounded-full`}
        style={{
          border: `${ringWidths[size]} solid ${shieldColor}`,
        }}
        animate={getAnimation()}
        transition={{
          duration: state === 'calm' ? 3 : state === 'unsettled' ? 1 : 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {children}

        {/* Cracked effect for unsettled */}
        {state === 'unsettled' && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(45deg, transparent 40%, ${shieldColor}30 50%, transparent 60%)`,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </>
        )}

        {/* Ward effect for under_protection */}
        {state === 'under_protection' && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, transparent 50%, ${shieldColor}20 70%, transparent 90%)`,
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Tooltip */}
      {showTooltip && (
        <div className={`
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5
          rounded-lg text-xs font-semibold whitespace-nowrap
          opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50
          ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'}
        `}>
          {shieldMessage}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
};

export default NkisiShield;
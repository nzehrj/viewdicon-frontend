import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import type { NkisiShield, GuardianStatus } from '@/types/verification.types';
import { 
  getGuardianIcon, 
  getGuardianName,
  getShieldStateColor,
  getShieldStateMessage 
} from '@/types/verification.types';
import * as Icons from 'lucide-react';

interface GuardianDashboardProps {
  shield: NkisiShield;
  showDetails?: boolean;
}

export const GuardianDashboard: React.FC<GuardianDashboardProps> = ({
  shield,
  showDetails = true,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const shieldColor = getShieldStateColor(shield.overall_state);
  const shieldMessage = getShieldStateMessage(shield.overall_state);

  const getStatusIcon = (status: GuardianStatus) => {
    switch (status) {
      case 'ok':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'alert':
        return AlertCircle;
    }
  };

  const getStatusColor = (status: GuardianStatus) => {
    switch (status) {
      case 'ok':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'alert':
        return '#ef4444';
    }
  };

  // ✅ FIXED: Proper type for guardians entries
  type GuardianKey = keyof typeof shield.guardians;
  type GuardianValue = typeof shield.guardians[GuardianKey];
  
  const guardians = Object.entries(shield.guardians) as [GuardianKey, GuardianValue][];

  return (
    <div
      className={`
      rounded-2xl p-6 border-2
      ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white shadow-sm'}
    `}
      style={{ borderColor: `${shieldColor}40` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${shieldColor}20` }}
            animate={{
              boxShadow: [
                `0 0 8px ${shieldColor}40`,
                `0 0 16px ${shieldColor}60`,
                `0 0 8px ${shieldColor}40`,
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-6 h-6" style={{ color: shieldColor }} />
          </motion.div>

          <div>
            <h3
              className={`text-lg font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Your Nkisi Shield
            </h3>
            <p
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {shieldMessage}
            </p>
          </div>
        </div>

        {/* Overall State Badge */}
        <div
          className="px-3 py-1.5 rounded-full text-xs font-bold uppercase"
          style={{
            backgroundColor: `${shieldColor}20`,
            color: shieldColor,
            border: `2px solid ${shieldColor}40`,
          }}
        >
          {shield.overall_state.replace('_', ' ')}
        </div>
      </div>

      {/* 4 Guardians Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {guardians.map(([key, guardian]) => {
          const GuardianIcon = Icons[
            getGuardianIcon(key) as keyof typeof Icons
          ] as React.FC<any>;
          const StatusIcon = getStatusIcon(guardian.status);
          const statusColor = getStatusColor(guardian.status);
          const guardianName = getGuardianName(key);

          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              className={`
                p-4 rounded-xl border transition-all
                ${
                  theme === 'dark'
                    ? 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {/* Guardian Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <GuardianIcon
                    className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  />
                  <span
                    className={`font-semibold text-sm ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {guardianName}
                  </span>
                </div>

                <StatusIcon
                  className="w-5 h-5"
                  style={{ color: statusColor }}
                />
              </div>

              {/* Message */}
              {showDetails && (
                <p
                  className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }`}
                >
                  {guardian.message}
                </p>
              )}

              {/* Extra Info */}
              {showDetails && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p
                    className={`text-xs ${
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                    }`}
                  >
                    Last check:{' '}
                    {new Date(guardian.last_check).toLocaleDateString()}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Warnings/Restrictions */}
      {shield.recommended_restrictions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            mt-4 p-4 rounded-xl flex items-start gap-3
            ${
              theme === 'dark'
                ? 'bg-amber-900/20 border border-amber-500/30'
                : 'bg-amber-50 border border-amber-200'
            }
          `}
        >
          <AlertTriangle
            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            }`}
          />
          <div className="flex-1">
            <p
              className={`font-semibold text-sm mb-1 ${
                theme === 'dark' ? 'text-amber-300' : 'text-amber-800'
              }`}
            >
              Active Protections
            </p>
            <ul
              className={`text-xs space-y-0.5 ${
                theme === 'dark' ? 'text-amber-200' : 'text-amber-700'
              }`}
            >
              {shield.recommended_restrictions.map((restriction, idx) => (
                <li key={idx}>• {restriction.replace(/_/g, ' ')}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Clan Blessing Required */}
      {shield.requires_clan_blessing && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            mt-4 p-4 rounded-xl text-center
            ${
              theme === 'dark'
                ? 'bg-purple-900/20 border border-purple-500/30'
                : 'bg-purple-50 border border-purple-200'
            }
          `}
        >
          <p
            className={`font-semibold text-sm mb-2 ${
              theme === 'dark' ? 'text-purple-300' : 'text-purple-800'
            }`}
          >
            Your Shield needs your Circle
          </p>
          <p
            className={`text-xs mb-3 ${
              theme === 'dark' ? 'text-purple-200' : 'text-purple-700'
            }`}
          >
            Ask your trusted family to stand with you and restore protection
          </p>
          <button
            className={`
              px-4 py-2 rounded-xl text-sm font-semibold transition-all
              ${
                theme === 'dark'
                  ? 'bg-purple-600 hover:bg-purple-500 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }
            `}
          >
            Request Clan Blessing
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default GuardianDashboard;
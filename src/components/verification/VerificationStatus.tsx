import React from 'react';
import { ChevronRight, Lock, Unlock } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import type { UserVerificationState } from '@/types/verification.types';
import { getVerificationTierName } from '@/types/verification.types';
import { VerificationBadge } from './VerificationBadge';
import { ProfessionalBadge } from './ProfessionalBadge';

interface VerificationStatusProps {
  verificationState: UserVerificationState;
  onUpgrade?: () => void;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  verificationState,
  onUpgrade,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const currentTier = verificationState.verification_level.tier;
  const tierName = getVerificationTierName(currentTier);

  // Permissions grouped
  const permissions = [
    { label: 'Post publicly', enabled: verificationState.can_post_public },
    { label: 'Receive whispers', enabled: verificationState.can_receive_whispers },
    { label: 'Large transfers', enabled: verificationState.can_transfer_large_amounts },
    { label: 'Professional listing', enabled: verificationState.can_be_listed_professionally },
    { label: 'Mediate disputes', enabled: verificationState.can_mediate_disputes },
    { label: 'Create Harambee', enabled: verificationState.can_create_harambee },
    { label: 'Mass broadcast', enabled: verificationState.can_broadcast_mass },
  ];

  return (
    <div
      className={`
      rounded-2xl p-6 border
      ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'}
    `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <VerificationBadge tier={currentTier} size="lg" showLabel={false} />
          <div>
            <h3
              className={`text-lg font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {tierName}
            </h3>
            <p
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Achieved{' '}
              {new Date(verificationState.verification_level.achieved_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Upgrade Button (if not Gold) */}
        {currentTier !== 'gold' && onUpgrade && (
          <button
            onClick={onUpgrade}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all"
          >
            Upgrade
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Professional Badges */}
      {verificationState.professional_badges.length > 0 && (
        <div className="mb-6">
          <p
            className={`text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Professional Credentials
          </p>
          <div className="flex flex-wrap gap-2">
            {verificationState.professional_badges.map((badge, idx) => (
              <ProfessionalBadge key={idx} badge={badge} size="md" />
            ))}
          </div>
        </div>
      )}

      {/* Permissions Grid */}
      <div>
        <p
          className={`text-sm font-semibold mb-3 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Your Powers
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {permissions.map((perm, idx) => (
            <div
              key={idx}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                ${
                  perm.enabled
                    ? theme === 'dark'
                      ? 'bg-green-900/20 text-green-400'
                      : 'bg-green-50 text-green-700'
                    : theme === 'dark'
                    ? 'bg-gray-900/50 text-gray-600'
                    : 'bg-gray-50 text-gray-400'
                }
              `}
            >
              {perm.enabled ? (
                <Unlock className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>{perm.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Tier Preview (if not Gold) */}
      {currentTier !== 'gold' && (
        <div
          className={`
          mt-6 p-4 rounded-xl border
          ${
            theme === 'dark'
              ? 'bg-gray-900/50 border-gray-700'
              : 'bg-gray-50 border-gray-200'
          }
        `}
        >
          <p
            className={`text-sm font-semibold mb-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Next Level: {getVerificationTierName(currentTier === 'bronze' ? 'silver' : 'gold')}
          </p>
          <p
            className={`text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}
          >
            {currentTier === 'bronze'
              ? 'Map your family tree and verify your profession to unlock Clan Verified status'
              : 'Build trust over time and contribute to the community to reach Ancestral Verified'}
          </p>
        </div>
      )}
    </div>
  );
};

export default VerificationStatus;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  //Shield, 
  Award, 
  Users, 
  MessageSquare,
  Heart,
  Edit3,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@store/hooks';
import { toggleAfroIdVisibility } from '@store/slices/userSlice';
import { formatHandle } from '@/types/profile.types';
import { VerificationBadge } from '@components/verification/VerificationBadge';
import { NkisiShield } from '@components/verification/NkisiShield';
import { ProfessionalBadge } from '@components/verification/ProfessionalBadge';
import type { VerificationTier, ShieldState, ProfessionalBadge as ProfessionalBadgeType } from '@/types/verification.types';

interface ProfileCardProps {
  viewType: 'self' | 'stranger' | 'trusted';
  onEditProfile?: () => void;
  onMessageRequest?: () => void;
  onAddToCircle?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  viewType,
  onEditProfile,
  onMessageRequest,
  onAddToCircle,
}) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  const publicProfile = useAppSelector((state) => state.user.publicProfile);
  const afroIdentity = useAppSelector((state) => state.user.afroIdentity);
  const village = useAppSelector((state) => state.user.village);
  const role = useAppSelector((state) => state.user.role);
  const showAfroId = useAppSelector((state) => state.user.showAfroId);
  const rank = useAppSelector((state) => state.user.rank);
  // ❌ REMOVED: const badges = useAppSelector((state) => state.user.badges);

  const [isFollowing, setIsFollowing] = useState(false);

  // Use publicProfile if available, fallback to legacy user data
  const displayName = publicProfile?.display_name || user?.full_name || user?.name || 'User';
  const handle = publicProfile?.handle || `@${user?.phoneNumber?.slice(-4)}` || '@user';
  const bio = publicProfile?.bio || '';
  const location = publicProfile?.location || user?.country || '';
  const avatarUrl = publicProfile?.avatar_url || '';
  const coverUrl = publicProfile?.cover_url || '';

  // Stats (mock for now - replace with real data)
  const followerCount = publicProfile?.follower_count || 0;
  const followingCount = publicProfile?.following_count || 0;
  const postCount = publicProfile?.post_count || 0;

  // Village & role display
  const villageName = village?.villageName || 'No Village';
  const roleName = role?.roleName || 'No Role';
  const villageRoleBadge = publicProfile?.village_role_badge || `${villageName} • ${roleName}`;

  // Rank display
  const rankLevel = rank?.level || user?.iwa_score || 0;
  const rankTitle = rank?.title || 'Novice';
  const rankColor = rank?.color || '#6b7280';

  // Heritage display (only if allowed)
  const showHeritage = publicProfile?.show_heritage || false;
  const heritage = user?.tribe || afroIdentity?.heritage || '';

  // Verification & Nkisi data (mock for now - replace with real data from Redux)
  const verificationTier: VerificationTier = 'bronze'; // TODO: Get from Redux
  const shieldState: ShieldState = 'calm'; // TODO: Get from Redux
  const professionalBadges: ProfessionalBadgeType[] = [
    // TODO: Get from Redux - mock example:
    // {
    //   category: 'healer',
    //   title: 'Herbal Healer',
    //   verified_by: 'Local Council of Elders',
    //   credential_type: 'endorsement',
    //   issued_at: new Date(),
    // }
  ];

  const handleToggleAfroId = () => {
    dispatch(toggleAfroIdVisibility());
  };

  return (
    <div className={`
      rounded-3xl overflow-hidden shadow-xl
      ${theme === 'dark' 
        ? 'bg-gray-800/50 border border-gray-700' 
        : 'bg-white border border-gray-200'
      }
    `}>
      {/* Cover Image */}
      <div className="relative h-32 sm:h-48 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700">
        {coverUrl ? (
          <img 
            src={coverUrl} 
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="text-6xl">🌍</div>
          </div>
        )}

        {/* Edit button (self view only) */}
        {viewType === 'self' && onEditProfile && (
          <button
            onClick={onEditProfile}
            className={`
              absolute top-4 right-4 p-2 rounded-xl backdrop-blur-xl
              ${theme === 'dark'
                ? 'bg-gray-800/80 hover:bg-gray-700/80 text-white'
                : 'bg-white/80 hover:bg-white/90 text-gray-900'
              }
            `}
          >
            <Edit3 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="px-4 sm:px-6 pb-6">
        {/* Avatar with Nkisi Shield */}
        <div className="flex items-end justify-between -mt-12 sm:-mt-16 mb-4">
          <div className="relative">
            {/* Nkisi Shield Wrapper */}
            <NkisiShield state={shieldState} size="lg" showTooltip={viewType !== 'self'}>
              <div className={`
                w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4
                ${theme === 'dark' ? 'border-gray-800' : 'border-white'}
                bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl
              `}>
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-3xl sm:text-5xl">
                    {displayName.charAt(0)}
                  </div>
                )}
              </div>
            </NkisiShield>

            {/* Verification Badge (overlaid on avatar) */}
            <div className="absolute -bottom-2 -right-2">
              <VerificationBadge tier={verificationTier} size="md" showTooltip />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mb-2">
            {viewType === 'self' ? (
              <button
                onClick={onEditProfile}
                className={`
                  px-4 py-2 rounded-xl font-semibold text-sm transition-all
                  ${theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }
                `}
              >
                <Edit3 className="w-4 h-4 inline mr-1" />
                Edit
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`
                    px-4 py-2 rounded-xl font-semibold text-sm transition-all
                    ${isFollowing
                      ? theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                    }
                  `}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>

                <button
                  onClick={onMessageRequest}
                  className={`
                    p-2 rounded-xl transition-all
                    ${theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }
                  `}
                  title="Send Whisper"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>

                {viewType === 'trusted' && onAddToCircle && (
                  <button
                    onClick={onAddToCircle}
                    className={`
                      p-2 rounded-xl transition-all
                      ${theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }
                    `}
                    title="Add to Circle"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Name & Handle */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <h1 className={`text-2xl sm:text-3xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {displayName}
            </h1>
          </div>
          <p className={`text-sm sm:text-base ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {formatHandle(handle)}
          </p>
        </div>

        {/* Bio */}
        {bio && (
          <p className={`text-sm sm:text-base mb-4 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {bio}
          </p>
        )}

        {/* Professional Badges (if any) */}
        {professionalBadges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {professionalBadges.map((badge, idx) => (
              <ProfessionalBadge key={idx} badge={badge} size="sm" showVerifier={false} />
            ))}
          </div>
        )}

        {/* Village & Role Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className={`
            inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold
            ${theme === 'dark'
              ? 'bg-green-900/30 text-green-400 border border-green-500/30'
              : 'bg-green-50 text-green-700 border border-green-200'
            }
          `}>
            <Users className="w-4 h-4" />
            {villageRoleBadge}
          </div>

          {/* Rank Badge */}
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold"
            style={{ 
              backgroundColor: `${rankColor}20`,
              color: rankColor,
              border: `1px solid ${rankColor}40`
            }}
          >
            <Award className="w-4 h-4" />
            {rankTitle} • Lv.{rankLevel}
          </div>

          {/* Heritage Pill (if allowed) */}
          {showHeritage && heritage && (
            <div className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold
              ${theme === 'dark'
                ? 'bg-amber-900/30 text-amber-400 border border-amber-500/30'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
              }
            `}>
              🌍 {heritage} Heritage
            </div>
          )}
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-2 mb-4">
            <MapPin className={`w-4 h-4 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <span className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {location}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-6 py-4 border-t border-b border-gray-200 dark:border-gray-700">
          <div>
            <p className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {postCount}
            </p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Posts
            </p>
          </div>
          <div>
            <p className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {followerCount}
            </p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Followers
            </p>
          </div>
          <div>
            <p className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {followingCount}
            </p>
            <p className={`text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>
              Following
            </p>
          </div>
        </div>

        {/* Afro-ID Section (self view only) */}
        {viewType === 'self' && user?.afro_id && (
          <div className="mt-4">
            <button
              onClick={handleToggleAfroId}
              className={`
                w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all
                ${theme === 'dark'
                  ? 'bg-gray-900/50 hover:bg-gray-900/70 text-gray-300 border border-gray-700'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }
              `}
            >
              <span>Your Afro-ID</span>
              {showAfroId ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>

            {showAfroId && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`
                  mt-2 p-3 rounded-xl font-mono text-xs break-all
                  ${theme === 'dark'
                    ? 'bg-gray-900 text-green-400 border border-gray-700'
                    : 'bg-gray-50 text-green-600 border border-gray-200'
                  }
                `}
              >
                {user.afro_id}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
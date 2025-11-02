import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  MapPin,
  Clock
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import type { FeedPost as FeedPostType } from '@/types/feed.types';
import { formatPostTime } from '@/types/feed.types';
import { PotButton } from '@components/common/PotButton';
import { PotHeatBar } from '@components/common/PotHeatBar';
import { VerificationBadge } from '@components/verification/VerificationBadge';
import { NkisiShield } from '@components/verification/NkisiShield';
import type { VerificationTier, ShieldState } from '@/types/verification.types';

interface FeedPostProps {
  post: FeedPostType;
  onPot: (postId: string) => Promise<void>;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => void;
}

export const FeedPost: React.FC<FeedPostProps> = ({
  post,
  onPot,
  onComment,
  onShare,
  onBookmark,
}) => {
  const [hasStirred, setHasStirred] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);

  const handlePot = async () => {
    await onPot(post.post_id);
    setHasStirred(true);
  };

  // Truncate long content
  const contentPreview = post.content.length > 280 
    ? post.content.substring(0, 280) + '...'
    : post.content;

  // ✅ NEW: Mock verification data (TODO: Get from post author data)
  const authorVerificationTier: VerificationTier = 'silver'; // TODO: Get from post.author_verification_tier
  const authorShieldState: ShieldState = 'calm'; // TODO: Get from post.author_shield_state

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-2xl p-4 sm:p-6 mb-4 transition-all
        ${theme === 'dark' 
          ? 'bg-gray-800/50 border border-gray-700' 
          : 'bg-white border border-gray-200 shadow-sm'
        }
        ${post.pot_status.heat_level === 'ready' 
          ? 'ring-2 ring-green-500/50 shadow-lg' 
          : ''
        }
      `}
    >
      {/* Post Header */}
      <div className="flex items-start gap-3 mb-4">
        {/* Avatar with Nkisi Shield */}
        <div className="flex-shrink-0">
          <NkisiShield state={authorShieldState} size="sm" showTooltip>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600">
              {post.author_avatar_url ? (
                <img 
                  src={post.author_avatar_url} 
                  alt={post.author_display_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                  {post.author_display_name.charAt(0)}
                </div>
              )}
            </div>
          </NkisiShield>
        </div>

        {/* Author Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-bold text-sm sm:text-base truncate ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {post.author_display_name}
            </h3>
            
            {/* ✅ Verification Badge */}
            <VerificationBadge tier={authorVerificationTier} size="sm" showTooltip />
          </div>

          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            <span className={`text-xs sm:text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {post.author_handle}
            </span>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`}>
              •
            </span>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              {post.author_village_role}
            </span>
          </div>
        </div>

        {/* More Options */}
        <button className={`p-2 rounded-lg transition-colors ${
          theme === 'dark' 
            ? 'hover:bg-gray-700 text-gray-400' 
            : 'hover:bg-gray-100 text-gray-600'
        }`}>
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className={`text-sm sm:text-base whitespace-pre-wrap ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`}>
          {showFullContent ? post.content : contentPreview}
        </p>
        
        {post.content.length > 280 && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-sm text-green-600 hover:text-green-700 font-semibold mt-1"
          >
            {showFullContent ? 'Show less' : 'Show more'}
          </button>
        )}

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.hashtags.map((tag, idx) => (
              <span
                key={idx}
                className={`text-xs sm:text-sm font-semibold ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Media (if any) */}
      {post.media_urls.length > 0 && (
        <div className={`
          grid gap-2 mb-4 rounded-xl overflow-hidden
          ${post.media_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}
        `}>
          {post.media_urls.map((url, idx) => (
            <div 
              key={idx}
              className="relative aspect-square bg-gray-200 dark:bg-gray-700"
            >
              <img 
                src={url}
                alt={`Post media ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Location */}
      {post.location && (
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin className={`w-3.5 h-3.5 ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <span className={`text-xs ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
          }`}>
            {post.location}
          </span>
        </div>
      )}

      {/* Pot Heat Bar */}
      <div className="mb-4">
        <PotHeatBar 
          potStatus={post.pot_status}
          showMessage={true}
          animated={true}
        />
      </div>

      {/* Engagement Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Pot Button */}
          <PotButton
            potStatus={post.pot_status}
            hasUserStirred={hasStirred}
            onPot={handlePot}
            size="md"
            showLabel={false}
          />

          {/* Comment */}
          <button
            onClick={() => onComment(post.post_id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold
              transition-all
              ${theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
              }
            `}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Comment</span>
            {post.comment_count > 0 && (
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                {post.comment_count}
              </span>
            )}
          </button>

          {/* Share */}
          <button
            onClick={() => onShare(post.post_id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold
              transition-all
              ${theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
              }
            `}
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
            {post.share_count > 0 && (
              <span className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                {post.share_count}
              </span>
            )}
          </button>
        </div>

        {/* Bookmark */}
        <button
          onClick={() => onBookmark(post.post_id)}
          className={`
            p-2 rounded-xl transition-all
            ${theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400'
              : 'hover:bg-gray-100 text-gray-600'
            }
          `}
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      {/* Timestamp */}
      <div className="flex items-center gap-1 mt-3">
        <Clock className={`w-3 h-3 ${
          theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
        }`} />
        <span className={`text-xs ${
          theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
        }`}>
          {formatPostTime(post.created_at)}
        </span>
      </div>
    </motion.article>
  );
};

export default FeedPost;
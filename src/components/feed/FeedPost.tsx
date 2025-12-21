// src/components/feed/FeedPost.tsx
// Professional Feed Post Component with Cultural Interactions

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bookmark, 
  MoreHorizontal,
  MapPin,
  Clock,
  MessageCircle,
  Share2
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { PotButton } from '@/components/common/PotButton';
import { PotHeatBar } from '@/components/common/PotHeatBar';
import { VerificationBadge } from '@/components/verification/VerificationBadge';
import { NkisiShield } from '@/components/verification/NkisiShield';
import { PostInteractionRenderer } from '@/components/cultural/PostInteractionRenderer';
import { mapToCulturalPost } from '@/types/feed-cultural.types';
import type { FeedPost as BaseFeedPost } from '@/types/feed.types';
import type { PostInteractionType } from '@/types/feed-cultural.types';

interface FeedPostProps {
  post: BaseFeedPost;
  onPot: (postId: string) => Promise<void>;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onCulturalInteraction?: (interactionType: string, data?: any) => void;
  // Optional: specify interaction type from parent
  interactionType?: PostInteractionType;
  interactionData?: any;
}

export const FeedPost: React.FC<FeedPostProps> = ({
  post,
  onPot,
  onComment,
  onShare,
  onBookmark,
  onCulturalInteraction,
  interactionType = 'standard',
  interactionData,
}) => {
  const [hasStirred, setHasStirred] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [showCulturalInteraction, setShowCulturalInteraction] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);

  // Convert to cultural post using helper
  const culturalPost = mapToCulturalPost(post, interactionType, interactionData);

  const handlePot = async () => {
    await onPot(post.post_id);
    setHasStirred(true);
  };

  const handleCulturalInteraction = (type: string, data?: any) => {
    onCulturalInteraction?.(type, data);
  };

  // Truncate long content
  const contentPreview = post.content.length > 280 
    ? post.content.substring(0, 280) + '...'
    : post.content;

  // Verification defaults (these would come from author data in production)
  const authorVerificationTier = 'silver'; // TODO: Get from author profile
  const authorShieldState = 'calm'; // TODO: Get from author profile

  // Format timestamp
  const formatPostTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

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
            
            {/* Verification Badge */}
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
        <p className={`text-sm sm:text-base whitespace-pre-wrap leading-relaxed ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`}>
          {showFullContent ? post.content : contentPreview}
        </p>
        
        {post.content.length > 280 && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-sm text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 font-semibold mt-2 transition-colors"
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
                className={`text-xs sm:text-sm font-semibold cursor-pointer hover:underline transition-all ${
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
          ${post.media_urls.length === 1 ? 'grid-cols-1' : 
            post.media_urls.length === 2 ? 'grid-cols-2' :
            post.media_urls.length === 3 ? 'grid-cols-3' :
            'grid-cols-2'}
        `}>
          {post.media_urls.map((url, idx) => (
            <div 
              key={idx}
              className={`
                relative overflow-hidden rounded-lg
                ${post.media_urls.length === 1 
                  ? 'aspect-video' 
                  : 'aspect-square'
                }
                ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}
              `}
            >
              <img 
                src={url}
                alt={`Post media ${idx + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}

      {/* Location */}
      {post.location && (
        <div className="flex items-center gap-1.5 mb-4">
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
      <div className={`
        flex items-center justify-between pt-4 pb-3
        border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
      `}>
        {/* Pot Button */}
        <PotButton
          potStatus={post.pot_status}
          hasUserStirred={hasStirred}
          onPot={handlePot}
          size="md"
          showLabel={true}
        />

        {/* Comment Button */}
        <button
          onClick={() => {
            if (culturalPost.interactionType === 'standard') {
              onComment(post.post_id);
            } else {
              setShowCulturalInteraction(!showCulturalInteraction);
            }
          }}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl transition-all
            ${theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }
            ${showCulturalInteraction ? 'bg-blue-500/10 text-blue-500' : ''}
          `}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-semibold hidden sm:inline">
            {culturalPost.comments}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => onShare(post.post_id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl transition-all
            ${theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }
          `}
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-semibold hidden sm:inline">
            {culturalPost.shares}
          </span>
        </button>

        {/* Bookmark */}
        <button
          onClick={() => onBookmark(post.post_id)}
          className={`
            p-2 rounded-xl transition-all
            ${theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }
          `}
          title="Bookmark"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Cultural Interaction Renderer */}
      {showCulturalInteraction && culturalPost.interactionType !== 'standard' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`
            mt-4 pt-4 border-t overflow-hidden
            ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
          `}
        >
          <PostInteractionRenderer
            post={culturalPost}
            onInteraction={handleCulturalInteraction}
          />
        </motion.div>
      )}

      {/* Timestamp */}
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-700/50">
        <Clock className={`w-3.5 h-3.5 ${
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
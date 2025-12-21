// src/types/feed-cultural.types.ts
// Type definitions for feed posts with cultural interactions

import type { PostInteractionType } from '@/components/cultural/PostInteractionRenderer';
import type { FeedPost } from './feed.types';

// Cultural Post Extension (wraps your existing FeedPost)
export interface CulturalFeedPost extends FeedPost {
  // Map to PostInteractionRenderer requirements
  id: string; // Same as post_id
  userId: string; // Same as author_afro_id
  userName: string; // Same as author_display_name
  timestamp: string; // Convert from created_at Date
  
  // Cultural interaction fields
  interactionType: PostInteractionType;
  interactionData?: any;
  
  // Engagement mappings
  likes: number; // Map from pot_status.total_pots
  comments: number; // Same as comment_count
  shares: number; // Same as share_count
  heat: number; // Map from pot_status.heat_score
}

// Helper to convert FeedPost to CulturalFeedPost
export const mapToCulturalPost = (
  post: FeedPost, 
  interactionType: PostInteractionType = 'standard', 
  interactionData?: any
): CulturalFeedPost => {
  return {
    ...post,
    id: post.post_id,
    userId: post.author_afro_id,
    userName: post.author_display_name,
    timestamp: post.created_at.toISOString(),
    interactionType,
    interactionData,
    likes: post.pot_status.total_pots,
    comments: post.comment_count,
    shares: post.share_count,
    heat: post.pot_status.heat_score,
  };
};

// Export for convenience
export type { PostInteractionType };
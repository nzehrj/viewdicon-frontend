// Feed & Social Content Types - African Potting System

export type PostType = 'text' | 'image' | 'video' | 'music' | 'marketplace' | 'event' | 'poll';
export type PostVisibility = 'public' | 'followers' | 'village' | 'inner_fire';
export type PotHeatLevel = 'cold' | 'warming' | 'cooking' | 'boiling' | 'ready';

// ============================================================================
// POTTING SYSTEM (REPLACES LIKES/REACTIONS)
// ============================================================================

/**
 * THE POT CONCEPT:
 * - Every post is a "pot" that needs to "cook"
 * - Users "stir the pot" instead of "liking"
 * - The more people stir, the hotter the pot gets
 * - Hot pots rise to the top of the timeline
 * - When a pot is "ready" (fully cooked), it reaches maximum visibility
 */

export interface PotStatus {
  post_id: string;
  
  // Potting metrics
  total_pots: number;                 // Total number of people who stirred the pot
  heat_level: PotHeatLevel;           // Current cooking state
  heat_score: number;                 // 0-100 (determines heat level)
  
  // Cooking progression
  started_cooking_at: Date | null;    // When first pot was added
  reached_boiling_at: Date | null;    // When pot reached boiling
  ready_at: Date | null;              // When pot fully cooked
  
  // Time decay (pots cool down over time)
  last_pot_at: Date;                  // Last time someone stirred
  cooling_rate: number;               // How fast pot cools (based on time since last stir)
  
  // Visibility boost
  boosted: boolean;                   // Is this pot featured/promoted?
  boost_multiplier: number;           // Heat multiplier (1.0 = normal, 2.0 = 2x heat)
}

export interface UserPot {
  pot_id: string;
  post_id: string;
  user_afro_id: string;
  user_display_name: string;
  user_handle: string;
  user_avatar_url: string;
  stirred_at: Date;                   // When user stirred the pot
}

// Heat level thresholds
export const POT_HEAT_THRESHOLDS = {
  COLD: { min: 0, max: 10, label: 'Cold Pot', icon: 'Snowflake', color: '#6b7280' },
  WARMING: { min: 11, max: 30, label: 'Warming Up', icon: 'Flame', color: '#f59e0b' },
  COOKING: { min: 31, max: 60, label: 'Cooking', icon: 'Flame', color: '#f97316' },
  BOILING: { min: 61, max: 90, label: 'Boiling', icon: 'Flame', color: '#ef4444' },
  READY: { min: 91, max: 100, label: 'Ready to Serve!', icon: 'Sparkles', color: '#10b981' },
} as const;

// ============================================================================
// FEED POST (UPDATED WITH POTTING)
// ============================================================================

export interface FeedPost {
  post_id: string;
  author_afro_id: string;
  
  // Author info (for display)
  author_display_name: string;
  author_handle: string;
  author_avatar_url: string;
  author_village_role: string;
  author_rank_level: number;
  author_badges: string[];
  
  // Post content
  type: PostType;
  content: string;                    // Text content or caption
  media_urls: string[];               // Images, videos, audio files
  
  // Post metadata
  visibility: PostVisibility;
  tagged_handles: string[];           // @mentions
  hashtags: string[];                 // #tags
  location: string | null;
  
  // 🔥 POTTING ENGAGEMENT (replaces likes)
  pot_status: PotStatus;
  
  // Other engagement
  comment_count: number;
  share_count: number;
  bookmark_count: number;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  edited: boolean;
}

// ============================================================================
// POST COMMENTS
// ============================================================================

export interface PostComment {
  comment_id: string;
  post_id: string;
  parent_comment_id: string | null;   // For nested replies
  
  // Author
  author_afro_id: string;
  author_display_name: string;
  author_handle: string;
  author_avatar_url: string;
  author_village_role: string;
  
  // Comment content
  content: string;
  media_urls: string[];               // Images/GIFs in comments
  
  // 🔥 COMMENTS CAN ALSO BE POTTED
  pot_status: PotStatus;
  reply_count: number;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  edited: boolean;
}

// ============================================================================
// MARKETPLACE POST (SPECIAL TYPE)
// ============================================================================

export interface MarketplacePost extends FeedPost {
  type: 'marketplace';
  marketplace_data: {
    title: string;
    price: number;
    currency: 'NGN' | 'USD' | 'Cowries';
    category: string;
    condition: 'new' | 'used' | 'service';
    delivery_options: string[];
    contact_method: 'message' | 'booking' | 'call';
    sold: boolean;
  };
}

// ============================================================================
// EVENT POST (SPECIAL TYPE)
// ============================================================================

export interface EventPost extends FeedPost {
  type: 'event';
  event_data: {
    title: string;
    description: string;
    start_time: Date;
    end_time: Date;
    location: string;
    is_virtual: boolean;
    virtual_link: string | null;
    max_attendees: number | null;
    rsvp_count: number;
    ticket_price: number | null;
  };
}

// ============================================================================
// POLL POST (SPECIAL TYPE)
// ============================================================================

export interface PollPost extends FeedPost {
  type: 'poll';
  poll_data: {
    question: string;
    options: {
      option_id: string;
      text: string;
      vote_count: number;
    }[];
    multiple_choice: boolean;
    closes_at: Date | null;
    total_votes: number;
  };
}

// ============================================================================
// FEED FILTERS
// ============================================================================

export interface FeedFilter {
  post_type?: PostType[];
  visibility?: PostVisibility[];
  village_ids?: string[];
  hashtags?: string[];
  heat_level?: PotHeatLevel[];       // Filter by pot heat
  date_range?: {
    from: Date;
    to: Date;
  };
  sort_by?: 'recent' | 'hottest' | 'relevant'; // "hottest" = most cooking pots
}

// ============================================================================
// POT COOKING ALGORITHM
// ============================================================================

export interface PotCookingFactors {
  base_pots: number;                  // Number of pots (stirs)
  time_decay: number;                 // Time since last pot (reduces heat)
  author_rank: number;                // Author's rank level
  velocity: number;                   // Pots per hour (recent activity)
  engagement_quality: number;         // Comments + shares weight
  village_bonus: number;              // Bonus if trending in village
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate heat score based on various factors
 */
export const calculateHeatScore = (factors: PotCookingFactors): number => {
  const {
    base_pots,
    time_decay,
    author_rank,
    velocity,
    engagement_quality,
    village_bonus
  } = factors;
  
  // Base score from number of pots
  let score = base_pots * 2;
  
  // Time decay (pot cools down over time)
  score *= (1 - time_decay);
  
  // Author rank bonus (higher rank = more heat per pot)
  const rankMultiplier = 1 + (author_rank / 100);
  score *= rankMultiplier;
  
  // Velocity bonus (rapid potting = more heat)
  score += velocity * 5;
  
  // Engagement quality (comments/shares add heat)
  score += engagement_quality * 3;
  
  // Village trending bonus
  score += village_bonus;
  
  // Cap at 100
  return Math.min(100, Math.max(0, score));
};

/**
 * Calculate time decay factor (0 = fresh, 1 = completely cold)
 */
export const calculateTimeDecay = (lastPotAt: Date): number => {
  const now = new Date();
  const hoursSinceLastPot = (now.getTime() - new Date(lastPotAt).getTime()) / (1000 * 60 * 60);
  
  // Decay curve: 0% at 0hrs, 50% at 12hrs, 90% at 48hrs
  if (hoursSinceLastPot < 1) return 0;
  if (hoursSinceLastPot < 12) return hoursSinceLastPot / 24;
  if (hoursSinceLastPot < 48) return 0.5 + (hoursSinceLastPot - 12) / 72;
  return 0.95; // Almost completely cold after 48 hours
};

/**
 * Calculate velocity (pots per hour in last 6 hours)
 */
export const calculateVelocity = (recentPots: UserPot[]): number => {
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
  const recentCount = recentPots.filter(p => 
    new Date(p.stirred_at) > sixHoursAgo
  ).length;
  
  return recentCount / 6; // Pots per hour
};

/**
 * Get heat level from score
 */
export const getHeatLevel = (score: number): PotHeatLevel => {
  if (score >= 91) return 'ready';
  if (score >= 61) return 'boiling';
  if (score >= 31) return 'cooking';
  if (score >= 11) return 'warming';
  return 'cold';
};

/**
 * Get heat level details
 */
export const getHeatLevelDetails = (level: PotHeatLevel) => {
  return POT_HEAT_THRESHOLDS[level.toUpperCase() as keyof typeof POT_HEAT_THRESHOLDS];
};

/**
 * Get pot icon based on heat level
 */
export const getPotIcon = (heatLevel: PotHeatLevel): string => {
  switch (heatLevel) {
    case 'cold': return 'Soup';          // Cold pot icon
    case 'warming': return 'Soup';       // Slightly steaming
    case 'cooking': return 'Soup';       // More steam
    case 'boiling': return 'Flame';      // Fire/flame icon
    case 'ready': return 'Sparkles';     // Ready to serve!
  }
};

/**
 * Get pot color based on heat level
 */
export const getPotColor = (heatLevel: PotHeatLevel): string => {
  return getHeatLevelDetails(heatLevel).color;
};

/**
 * Get pot animation class (for visual effect)
 */
export const getPotAnimationClass = (heatLevel: PotHeatLevel): string => {
  switch (heatLevel) {
    case 'cold': return '';
    case 'warming': return 'animate-pulse-slow';
    case 'cooking': return 'animate-pulse';
    case 'boiling': return 'animate-bounce-subtle';
    case 'ready': return 'animate-sparkle';
  }
};

/**
 * Format pot count for display
 */
export const formatPotCount = (count: number): string => {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
};

/**
 * Get pot status message
 */
export const getPotStatusMessage = (potStatus: PotStatus): string => {
  const { heat_level, total_pots } = potStatus;
  
  if (heat_level === 'cold') {
    return total_pots === 0 ? 'Be the first to stir this pot!' : 'Pot is cooling down...';
  }
  if (heat_level === 'warming') return 'Pot is warming up! 🔥';
  if (heat_level === 'cooking') return 'Pot is cooking! 🔥🔥';
  if (heat_level === 'boiling') return 'Pot is boiling! 🔥🔥🔥';
  return 'Pot is ready! Everyone is seeing this! ✨';
};

/**
 * Format post time
 */
export const formatPostTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
};

/**
 * Check if user has stirred this pot
 */
export const hasUserStirredPot = (potStatus: PotStatus, userAfroId: string, userPots: UserPot[]): boolean => {
  return userPots.some(p => p.post_id === potStatus.post_id && p.user_afro_id === userAfroId);
};
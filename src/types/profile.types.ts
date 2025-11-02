// Profile & Identity Types for 3-Layer System

export type VerificationLevel = 'Bronze' | 'Silver' | 'Gold';
export type CircleTier = 'inner_fire' | 'village' | 'kingdom';
export type KinshipTier = 'continental_african' | 'african_diaspora' | 'global_partner';

// ============================================================================
// LAYER 1: AFRO-ID (SECRET/BANK-GRADE)
// ============================================================================

export interface AfroIdentity {
  afro_id: string;                    // Immutable, secret, PII
  user_id: string;                    // FK to users table
  verification_level: VerificationLevel;
  heritage: string;                   // Tribe/ethnic origin (e.g., "Yoruba", "Igbo")
  totem: string;                      // IWA totem animal/symbol
  village_role: string;               // Village + role (e.g., "Healthcare • Doctor")
  rank_level: number;                 // Rank/level (0-100)
  
  // Security state (from biometric steps)
  security_state: {
    voice_verified: boolean;
    device_bound: boolean;
    face_verified: boolean;
    fingerprint_verified: boolean;
    kyc_completed: boolean;
  };
  
  // Wallet & device bindings
  wallet_binding: string;             // Wallet address
  device_binding: string[];           // Bound device IDs
  recovery_council: string[];         // Recovery contact Afro-IDs
  
  // Metadata
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// LAYER 2: PUBLIC PROFILE (SOCIAL IDENTITY)
// ============================================================================

export interface PublicProfile {
  profile_id: string;                 // Public UUID
  afro_id: string;                    // FK (NOT exposed in API by default)
  
  // Public identity (The "handle" layer)
  display_name: string;               // "Umoh Utibe", "Dr. Amina B."
  handle: string;                     // "@UmohTheGriot" (unique, searchable)
  bio: string;                        // Profile bio/description
  
  // Visual identity
  avatar_url: string;                 // Profile picture
  cover_url: string;                  // Cover/banner image
  
  // Location (public)
  location: string;                   // "Lagos, Nigeria" or "New York, USA"
  
  // Village & role display
  village_role_badge: string;         // "Creative Village • Musician"
  village_id: string;                 // FK to village
  role_id: string;                    // FK to role
  
  // Rank & regalia visuals
  rank_visuals: {
    rank_level: number;               // 0-100
    rank_title: string;               // "Elder", "Chief", "Master"
    regalia_state: string;            // Visual state identifier
    badges: string[];                 // Badge IDs earned
  };
  
  // Privacy settings (what strangers can see)
  show_heritage: boolean;             // Show "Calabar Heritage" pill
  show_clan: boolean;                 // Show clan/family info
  show_family_tree: boolean;          // Show family tree details
  allow_message_requests: boolean;    // Allow "Request Whisper"
  allow_booking: boolean;             // Allow booking services
  allow_tips: boolean;                // Allow receiving tips
  
  // Visibility settings
  visibility_settings: {
    profile_public: boolean;          // Is profile visible to strangers
    posts_public: boolean;            // Are posts visible to non-followers
    tools_public: boolean;            // Are village tools visible
  };
  
  // Stats (public)
  follower_count: number;
  following_count: number;
  post_count: number;
  
  // Metadata
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// BADGES & ACHIEVEMENTS
// ============================================================================

export interface UserBadge {
  id: string;
  name: string;                       // "Early Adopter", "IWA Master"
  description: string;
  icon: string;                       // Lucide icon name
  color: string;                      // Hex color
  earned_at: Date;
  category: 'achievement' | 'verification' | 'rank' | 'special';
}

export type BadgeCategory = 'achievement' | 'verification' | 'rank' | 'special';

// ============================================================================
// RANK & REGALIA SYSTEM
// ============================================================================

export interface RankRegalia {
  level: number;                      // 0-100
  title: string;                      // "Novice", "Apprentice", "Elder", "Chief"
  icon: string;                       // Lucide icon name
  color: string;                      // Hex color for visual
  requirements: string;               // Description of how to reach
  perks: string[];                    // Benefits at this rank
  next_level: {
    level: number;
    title: string;
    points_needed: number;
  } | null;
}

// Rank tiers
export const RANK_TIERS = {
  NOVICE: { min: 0, max: 10, title: 'Novice', color: '#6b7280' },
  APPRENTICE: { min: 11, max: 25, title: 'Apprentice', color: '#3b82f6' },
  SKILLED: { min: 26, max: 40, title: 'Skilled', color: '#10b981' },
  EXPERT: { min: 41, max: 60, title: 'Expert', color: '#f59e0b' },
  ELDER: { min: 61, max: 80, title: 'Elder', color: '#8b5cf6' },
  CHIEF: { min: 81, max: 100, title: 'Chief', color: '#ef4444' },
} as const;

// ============================================================================
// PROFILE EDIT & SETTINGS
// ============================================================================

export interface ProfileEditData {
  display_name?: string;
  handle?: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  location?: string;
}

export interface PrivacySettings {
  show_heritage: boolean;
  show_clan: boolean;
  show_family_tree: boolean;
  allow_message_requests: boolean;
  allow_booking: boolean;
  allow_tips: boolean;
  profile_public: boolean;
  posts_public: boolean;
  tools_public: boolean;
}

// ============================================================================
// VIEW TYPES (For UI Logic)
// ============================================================================

export type ProfileViewType = 'stranger' | 'follower' | 'trusted' | 'self';

// Determines what fields are visible based on relationship
export interface ProfileVisibility {
  can_see_afro_id: boolean;
  can_see_heritage: boolean;
  can_see_family_tree: boolean;
  can_direct_message: boolean;
  can_book: boolean;
  can_tip: boolean;
  can_call: boolean;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getRankTier = (level: number): typeof RANK_TIERS[keyof typeof RANK_TIERS] => {
  if (level <= 10) return RANK_TIERS.NOVICE;
  if (level <= 25) return RANK_TIERS.APPRENTICE;
  if (level <= 40) return RANK_TIERS.SKILLED;
  if (level <= 60) return RANK_TIERS.EXPERT;
  if (level <= 80) return RANK_TIERS.ELDER;
  return RANK_TIERS.CHIEF;
};

export const maskAfroId = (afroId: string, showLast4: boolean = false): string => {
  const parts = afroId.split('-');
  if (parts.length !== 5) return '•••-••-••-••••-••••';
  
  if (showLast4) {
    // Show: AFR-NG-••-••••-W1Y5
    return `${parts[0]}-${parts[1]}-••-••••-${parts[4]}`;
  }
  
  // Full mask: AFR-NG-••-••••-••••
  return `${parts[0]}-${parts[1]}-••-••••-••••`;
};

export const formatHandle = (handle: string): string => {
  // Ensure handle starts with @
  return handle.startsWith('@') ? handle : `@${handle}`;
};

export const validateHandle = (handle: string): boolean => {
  // Rules: 3-20 chars, alphanumeric + underscore only, no spaces
  const cleaned = handle.replace('@', '');
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(cleaned);
};

export const getVerificationBadgeColor = (level: VerificationLevel): string => {
  switch (level) {
    case 'Bronze': return '#cd7f32';
    case 'Silver': return '#c0c0c0';
    case 'Gold': return '#ffd700';
  }
};
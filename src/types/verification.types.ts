/**
 * Verification & Nkisi Shield Type Definitions
 * Track 1.3 + 1.4 Implementation + Upgrade 3 (African Names)
 */

// ===== VERIFICATION TIERS =====

export type VerificationTier = 'bronze' | 'silver' | 'gold';

export interface VerificationLevel {
  tier: VerificationTier;
  tier_name: string; // "Village Verified", "Clan Verified", "Ancestral Verified"
  achieved_at: Date;
  expires_at?: Date; // Some tiers may need renewal
  approved_by?: string[]; // Afro-IDs of approvers (for Silver/Gold)
}

// ===== AFRICAN TIER NAMES (UPGRADE 3) =====

export type AfricanTierName = 'Village Witnessed' | 'Clan Backed' | 'Elder Standing';
export type TierSymbol = 'calabash' | 'cowrie_shell' | 'council_staff';

export interface AfricanVerificationTier {
  internal_tier: VerificationTier; // 'bronze' | 'silver' | 'gold'
  public_label: AfricanTierName;
  symbol: TierSymbol;
  aura_color: string;
  description: string;
  trust_capabilities: TierCapabilities;
}

export interface TierCapabilities {
  can_post_public: boolean;
  can_receive_whispers: boolean;
  can_transfer_large_amounts: boolean;
  can_be_listed_professionally: boolean;
  can_mediate_disputes: boolean;
  can_create_harambee: boolean;
  can_broadcast_mass: boolean;
  can_host_public_rooms: boolean;
  can_receive_public_requests: boolean;
}

// ===== PROFESSIONAL BADGES =====

export type ProfessionCategory = 
  | 'healer'
  | 'teacher'
  | 'politician'
  | 'musician'
  | 'artist'
  | 'builder'
  | 'farmer'
  | 'driver'
  | 'merchant'
  | 'tech'
  | 'spiritual'
  | 'other';

export interface ProfessionalBadge {
  category: ProfessionCategory;
  title: string; // "Herbal Healer", "Licensed Surgeon", "Ward Councillor"
  verified_by: string; // "Lagos Medical Board", "Local Council of Elders"
  credential_type: 'license' | 'endorsement' | 'community' | 'electoral';
  issued_at: Date;
  credential_id?: string;
  issuer_logo_url?: string;
}

// ===== NKISI SHIELD (4 GUARDIANS) =====

export type GuardianStatus = 'ok' | 'warning' | 'alert';
export type ShieldState = 'calm' | 'unsettled' | 'under_protection';

export interface VoiceSpirit {
  status: GuardianStatus;
  last_check: Date;
  message: string;
  voiceprint_match_score?: number; // 0-100
}

export interface DrumBinding {
  status: GuardianStatus;
  last_check: Date;
  message: string;
  registered_devices: number;
  current_device_blessed: boolean;
}

export interface FootstepsPattern {
  status: GuardianStatus;
  last_check: Date;
  message: string;
  anomaly_score?: number; // 0-100, higher = more unusual
}

export interface CulturalMemory {
  status: GuardianStatus;
  last_check: Date;
  message: string;
  consistency_score?: number; // 0-100
}

export interface NkisiShield {
  afro_id: string;
  overall_state: ShieldState;
  last_updated: Date;
  guardians: {
    voice_spirit: VoiceSpirit;
    drum_binding: DrumBinding;
    footsteps: FootstepsPattern;
    cultural_memory: CulturalMemory;
  };
  recommended_restrictions: string[]; // ["limit_outgoing_payments", "block_cold_whispers"]
  requires_clan_blessing: boolean;
}

// ===== COMBINED USER VERIFICATION STATE =====

export interface UserVerificationState {
  afro_id: string;
  verification_level: VerificationLevel;
  professional_badges: ProfessionalBadge[];
  nkisi_shield: NkisiShield;
  can_post_public: boolean;
  can_receive_whispers: boolean;
  can_transfer_large_amounts: boolean;
  can_be_listed_professionally: boolean;
  can_mediate_disputes: boolean;
  can_create_harambee: boolean;
  can_broadcast_mass: boolean;
}

// ===== VOUCH SYSTEM =====

export interface Vouch {
  vouch_id: string;
  from_afro_id: string;
  from_display_name: string;
  from_verification_tier: VerificationTier;
  to_afro_id: string;
  relationship: string; // "cousin", "mentor", "neighbor", "colleague"
  message: string;
  given_at: Date;
  weight: number; // Higher tier vouches count more
}

export interface VouchRequest {
  request_id: string;
  from_afro_id: string;
  from_display_name: string;
  to_afro_id: string;
  message: string;
  requested_at: Date;
  status: 'pending' | 'accepted' | 'declined';
}

// ===== HELPER FUNCTIONS =====

/**
 * Get African tier information (Upgrade 3)
 */
export const getAfricanTierInfo = (tier: VerificationTier): AfricanVerificationTier => {
  const tiers: Record<VerificationTier, AfricanVerificationTier> = {
    bronze: {
      internal_tier: 'bronze',
      public_label: 'Village Witnessed',
      symbol: 'calabash',
      aura_color: '#8B4513', // Brown/ochre
      description: 'The people around you know you. You\'re not a ghost.',
      trust_capabilities: {
        can_post_public: true,
        can_receive_whispers: true,
        can_transfer_large_amounts: false,
        can_be_listed_professionally: false,
        can_mediate_disputes: false,
        can_create_harambee: false,
        can_broadcast_mass: false,
        can_host_public_rooms: false,
        can_receive_public_requests: false,
      },
    },
    silver: {
      internal_tier: 'silver',
      public_label: 'Clan Backed',
      symbol: 'cowrie_shell',
      aura_color: '#DAA520', // Warm gold/sand
      description: 'Your blood, your craft, your work is known.',
      trust_capabilities: {
        can_post_public: true,
        can_receive_whispers: true,
        can_transfer_large_amounts: true,
        can_be_listed_professionally: true,
        can_mediate_disputes: false,
        can_create_harambee: false,
        can_broadcast_mass: false,
        can_host_public_rooms: true,
        can_receive_public_requests: true,
      },
    },
    gold: {
      internal_tier: 'gold',
      public_label: 'Elder Standing',
      symbol: 'council_staff',
      aura_color: '#4B0082', // Deep indigo/purple
      description: 'You carry responsibility, not just identity.',
      trust_capabilities: {
        can_post_public: true,
        can_receive_whispers: true,
        can_transfer_large_amounts: true,
        can_be_listed_professionally: true,
        can_mediate_disputes: true,
        can_create_harambee: true,
        can_broadcast_mass: true,
        can_host_public_rooms: true,
        can_receive_public_requests: true,
      },
    },
  };
  
  return tiers[tier];
};

/**
 * Get verification tier name (uses African names now)
 */
export const getVerificationTierName = (tier: VerificationTier): string => {
  return getAfricanTierInfo(tier).public_label;
};

/**
 * Get verification tier color (uses African aura colors)
 */
export const getVerificationTierColor = (tier: VerificationTier): string => {
  return getAfricanTierInfo(tier).aura_color;
};

/**
 * Get verification tier icon (uses African symbols)
 */
export const getVerificationTierIcon = (tier: VerificationTier): string => {
  const icons = {
    bronze: 'Coffee', // Calabash (using Coffee as closest Lucide icon)
    silver: 'Shell', // Cowrie shell (using Shell icon)
    gold: 'Swords', // Council staff (using Swords as staff representation)
  };
  return icons[tier];
};

export const getShieldStateColor = (state: ShieldState): string => {
  const colors = {
    calm: '#10b981', // Soft green/gold
    unsettled: '#f59e0b', // Orange/yellow flicker
    under_protection: '#8b5cf6', // Purple ward
  };
  return colors[state];
};

export const getShieldStateMessage = (state: ShieldState): string => {
  const messages = {
    calm: 'Your shield is calm and strong',
    unsettled: 'Your shield is unsettled',
    under_protection: 'This person is under council protection',
  };
  return messages[state];
};

export const getGuardianIcon = (guardian: keyof NkisiShield['guardians']): string => {
  const icons = {
    voice_spirit: 'Mic',
    drum_binding: 'Smartphone',
    footsteps: 'Activity',
    cultural_memory: 'Brain',
  };
  return icons[guardian];
};

export const getGuardianName = (guardian: keyof NkisiShield['guardians']): string => {
  const names = {
    voice_spirit: 'Voice Spirit',
    drum_binding: 'Drum Binding',
    footsteps: 'Footsteps Pattern',
    cultural_memory: 'Cultural Memory',
  };
  return names[guardian];
};

export const getProfessionIcon = (category: ProfessionCategory): string => {
  const icons = {
    healer: 'Heart',
    teacher: 'BookOpen',
    politician: 'Flag',
    musician: 'Music',
    artist: 'Palette',
    builder: 'Hammer',
    farmer: 'Sprout',
    driver: 'Car',
    merchant: 'Store',
    tech: 'Code',
    spiritual: 'Sparkles',
    other: 'Briefcase',
  };
  return icons[category];
};

export const getProfessionColor = (category: ProfessionCategory): string => {
  const colors = {
    healer: '#10b981',
    teacher: '#3b82f6',
    politician: '#ef4444',
    musician: '#8b5cf6',
    artist: '#ec4899',
    builder: '#f59e0b',
    farmer: '#84cc16',
    driver: '#06b6d4',
    merchant: '#f97316',
    tech: '#6366f1',
    spiritual: '#a855f7',
    other: '#6b7280',
  };
  return colors[category];
};
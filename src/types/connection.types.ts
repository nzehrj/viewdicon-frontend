// Connection & Messaging Types for Layer 3

export type CircleTier = 'inner_fire' | 'village' | 'kingdom';
export type MessageRequestStatus = 'pending' | 'accepted' | 'declined' | 'blocked';
export type TrustRequestStatus = 'pending' | 'approved' | 'declined';
export type ConnectionStatus = 'active' | 'blocked' | 'muted';

// ============================================================================
// LAYER 3: CONNECTION GRAPH (TRUST RELATIONSHIPS)
// ============================================================================

export interface ConnectionGraph {
  connection_id: string;
  user_a_afro_id: string;             // First user (initiator)
  user_b_afro_id: string;             // Second user (recipient)
  
  // Relationship metadata
  connection_status: ConnectionStatus;
  
  // Circle tier (Ubuntu circles)
  circle_tier: CircleTier | null;     // Which circle is user_b in for user_a?
  
  // Basic social
  has_followed: boolean;              // A follows B
  is_mutual: boolean;                 // Both follow each other
  
  // Trust level (BBM-style handshake)
  has_afro_id_trust_channel: boolean; // Both exchanged Afro-IDs explicitly
  
  // Access permissions (granted after trust or circle promotion)
  can_direct_message: boolean;        // Can DM without "Request to Connect"
  can_tip_direct: boolean;            // Can send Cowries instantly
  can_book: boolean;                  // Can book services directly
  can_voice_call: boolean;            // Can initiate voice call
  can_video_call: boolean;            // Can initiate video call
  can_see_family_tree: boolean;       // Can view family connections
  can_see_heritage_details: boolean;  // Can see detailed heritage info
  
  // Trust metadata
  trust_initiated_by: string | null;  // Afro-ID of who initiated trust request
  trust_approved_at: Date | null;     // When trust was mutually approved
  
  // Interaction tracking
  connection_since: Date;             // When connection was first made
  last_interaction: Date;             // Last message/call/transaction
  interaction_count: number;          // Total interactions
  
  // Notes (private, for user_a only)
  notes: string | null;               // Personal notes about user_b
  
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// MESSAGE REQUESTS (LAYER 3A: PUBLIC MESSAGES)
// ============================================================================

export interface MessageRequest {
  request_id: string;
  
  // From (sender - wants to connect)
  from_afro_id: string;
  from_handle: string;                // For display
  from_display_name: string;          // For display
  from_avatar_url: string;            // For display
  from_village_role: string;          // For context
  
  // To (recipient - receives request)
  to_afro_id: string;
  
  // Request content
  message_preview: string;            // First 100 chars of message
  full_message: string;               // Full message (revealed after accept)
  
  // Status
  status: MessageRequestStatus;
  
  // Metadata
  created_at: Date;
  responded_at: Date | null;
  expires_at: Date | null;            // Auto-decline after 30 days
}

// ============================================================================
// TRUST REQUESTS (LAYER 3B: AFRO-ID LEVEL CONNECTION)
// ============================================================================

export interface TrustRequest {
  request_id: string;
  
  // From (initiator - wants Afro-ID level access)
  from_afro_id: string;
  from_display_name: string;
  from_handle: string;
  from_avatar_url: string;
  
  // To (recipient - receives trust request)
  to_afro_id: string;
  
  // Request details
  message: string;                    // Why they want trust access
  requested_circle: CircleTier;       // Which circle they want to join
  
  // Status
  status: TrustRequestStatus;
  
  // Metadata
  created_at: Date;
  responded_at: Date | null;
  expires_at: Date | null;            // Auto-decline after 7 days
}

// ============================================================================
// BLOCKED USERS
// ============================================================================

export interface BlockedUser {
  block_id: string;
  blocker_afro_id: string;            // Who blocked
  blocked_afro_id: string;            // Who was blocked
  blocked_handle: string;             // For reference
  blocked_display_name: string;       // For reference
  reason: string | null;              // Optional reason
  blocked_at: Date;
}

// ============================================================================
// CIRCLE MANAGEMENT (UBUNTU CIRCLES)
// ============================================================================

export interface Circle {
  circle_id: string;
  owner_afro_id: string;
  circle_tier: CircleTier;
  member_afro_ids: string[];          // List of members in this circle
  created_at: Date;
  updated_at: Date;
}

export interface CirclePermissions {
  inner_fire: {
    can_see_afro_id: boolean;
    can_direct_message: boolean;
    can_tip_direct: boolean;
    can_voice_call: boolean;
    can_video_call: boolean;
    can_see_family_tree: boolean;
    can_see_heritage_details: boolean;
    priority_support: boolean;
  };
  village: {
    can_see_afro_id: boolean;
    can_direct_message: boolean;
    can_book: boolean;
    can_tip_direct: boolean;
    can_voice_call: boolean;
    can_see_heritage_details: boolean;
  };
  kingdom: {
    can_see_afro_id: boolean;
    can_direct_message: boolean;
    can_follow: boolean;
    can_view_posts: boolean;
  };
}

// Default permissions for each circle
export const DEFAULT_CIRCLE_PERMISSIONS: CirclePermissions = {
  inner_fire: {
    can_see_afro_id: true,            // Inner Fire can see Afro-ID
    can_direct_message: true,
    can_tip_direct: true,
    can_voice_call: true,
    can_video_call: true,
    can_see_family_tree: true,
    can_see_heritage_details: true,
    priority_support: true,
  },
  village: {
    can_see_afro_id: false,           // Village cannot see Afro-ID by default
    can_direct_message: true,         // But can message after request accepted
    can_book: true,
    can_tip_direct: false,            // Tips require explicit approval
    can_voice_call: false,            // Calls require trust channel
    can_see_heritage_details: false,
  },
  kingdom: {
    can_see_afro_id: false,           // Kingdom (followers) never see Afro-ID
    can_direct_message: false,        // Must use "Request to Connect"
    can_follow: true,
    can_view_posts: true,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getCirclePermissions = (tier: CircleTier): CirclePermissions[CircleTier] => {
  return DEFAULT_CIRCLE_PERMISSIONS[tier];
};

export const canDirectMessage = (connection: ConnectionGraph): boolean => {
  return connection.can_direct_message || connection.has_afro_id_trust_channel;
};

export const canSeeAfroId = (connection: ConnectionGraph): boolean => {
  // Only Inner Fire or explicit trust channel can see Afro-ID
  return connection.circle_tier === 'inner_fire' || connection.has_afro_id_trust_channel;
};

export const isExpired = (expiresAt: Date | null): boolean => {
  if (!expiresAt) return false;
  return new Date() > new Date(expiresAt);
};

export const getCircleName = (tier: CircleTier): string => {
  switch (tier) {
    case 'inner_fire': return 'Inner Fire';
    case 'village': return 'Village Circle';
    case 'kingdom': return 'Kingdom Circle';
  }
};

export const getCircleDescription = (tier: CircleTier): string => {
  switch (tier) {
    case 'inner_fire': return 'Your closest circle - family, trusted friends, and partners';
    case 'village': return 'Your professional network - colleagues, clients, and collaborators';
    case 'kingdom': return 'Your followers and fans - public audience';
  }
};

export const getCircleIcon = (tier: CircleTier): string => {
  switch (tier) {
    case 'inner_fire': return 'Heart';
    case 'village': return 'Users';
    case 'kingdom': return 'Globe';
  }
};

export const getCircleColor = (tier: CircleTier): string => {
  switch (tier) {
    case 'inner_fire': return '#ef4444';    // Red
    case 'village': return '#10b981';       // Green
    case 'kingdom': return '#3b82f6';       // Blue
  }
};
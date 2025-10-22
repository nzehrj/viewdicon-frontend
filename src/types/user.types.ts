// User & Profile Types

export interface User {
  id: string;
  afro_id: string;
  phone: string;
  full_name: string;
  village?: string;
  date_of_birth?: string;
  role_id?: string;
  role_name?: string;
  kinship_tier?: KinshipTier;
  sankofa_totem?: string;
  iwa_score?: number;
  created_at: string;
  updated_at: string;
}

export type KinshipTier = 
  | 'continental_african'
  | 'african_diaspora'
  | 'global_partner';

export interface UserProfile {
  user: User;
  stats: {
    total_transactions: number;
    total_attestations: number;
    family_connections: number;
  };
}

export interface UserRegistry {
  afro_id: string;
  role_id: string;
  kinship_tier: KinshipTier;
  verified: boolean;
  created_at: string;
}

// The Three Becomings (Identity Context)
export interface IdentityContext {
  becoming: KinshipTier;
  geographic_anchor?: string;
  cultural_affinity?: string;
}
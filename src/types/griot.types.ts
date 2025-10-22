// Griot Service (DRS - Dynamic Role System) Types

export interface GriotRoleManifestResponse {
  role_id: string;
  role_name: string;
  village: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    pattern?: string;
    font?: string;
  };
  tools: Array<{
    id: string;
    name: string;
    icon: string;
    description: string;
    component: string;
    position?: { x: number; y: number };
  }>;
  privileges?: {
    sankofa_totem?: string;
    premium_tools?: string[];
  };
}

export interface UserRegistryResponse {
  afro_id: string;
  full_name: string;
  role_id: string;
  kinship_tier: string;
  verified: boolean;
  created_at: string;
}

export interface KinshipTierResponse {
  user_id: string;
  tier: 'continental_african' | 'african_diaspora' | 'global_partner';
  tier_benefits: string[];
  next_tier?: string;
  upgrade_requirements?: string[];
}

export interface GlobalPoliciesResponse {
  max_devices: number;
  device_rotation_days: number;
  session_timeout_minutes: number;
  heritage_challenge_attempts: number;
  family_gate_min_connections: number;
}
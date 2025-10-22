// Role Manifest & Village Types

export type VillageId = 
  | 'healers'
  | 'farmers'
  | 'builders'
  | 'traders'
  | 'artists'
  | 'teachers'
  | 'civic'
  | 'transport'
  | 'tech'
  | 'hospitality'
  | 'finance'
  | 'environment';

export interface Village {
  id: VillageId;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

export interface Tool {
  id: string;
  name: string;
  icon: string;
  description: string;
  component: string;
  requires_privilege?: boolean;
  sankofa_totem?: string;
}

export interface RoleTheme {
  primary: string;
  secondary: string;
  accent: string;
  pattern?: string;
  texture?: string;
}

export interface RoleManifest {
  role_id: string;
  role_name: string;
  village: VillageId;
  theme: RoleTheme;
  tools: Tool[];
  layout?: {
    grid_columns: number;
    widget_positions?: Record<string, { x: number; y: number }>;
  };
  privileges?: {
    sankofa_totem?: string;
    premium_features?: string[];
  };
}

// Role Registry (400 roles)
export interface RoleDefinition {
  id: string;
  name: string;
  village: VillageId;
  description: string;
  sub_roles?: string[];
}
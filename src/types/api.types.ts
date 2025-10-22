// Generic API Response Types

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
  requiresAuth?: boolean;
  requiresDPoP?: boolean;
}

// Circle Gate Types
export type CircleGate = 'C1' | 'C2' | 'C3';

export interface CircleResolveResponse {
  user_id: string;
  gate: CircleGate;
  gate_name: string;
  status: 'completed' | 'pending' | 'blocked';
  next_steps?: string[];
}

// Family Gate (C1)
export interface FamilyGateStatusResponse {
  tree_id: string;
  connections: number;
  required_connections: number;
  status: 'incomplete' | 'complete';
  family_members: Array<{
    member_id: string;
    name: string;
    relationship: string;
    verified: boolean;
  }>;
}
// Digital Griot's Archive (DGA) Types

export type AssetType = 'music' | 'video' | 'document' | 'image' | 'story';

export interface KSESplit {
  collaborator_id: string;
  collaborator_name: string;
  percentage: number;
  role: string;
}

export interface DGAUploadRequest {
  title: string;
  description: string;
  asset_type: AssetType;
  file: File;
  kse_splits: KSESplit[];
  required_tier?: 'continental_african' | 'african_diaspora' | 'global_partner';
  tags?: string[];
}

export interface DGAUploadResponse {
  asset_id: string;
  title: string;
  upload_url?: string;
  status: 'uploaded' | 'processing' | 'ready';
}

export interface DGAAsset {
  asset_id: string;
  title: string;
  description: string;
  asset_type: AssetType;
  creator_id: string;
  creator_name: string;
  file_url: string;
  thumbnail_url?: string;
  duration?: number;
  file_size: number;
  kse_splits: KSESplit[];
  required_tier?: string;
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

export interface DGAEntitlementCheckResponse {
  has_access: boolean;
  user_tier: string;
  required_tier: string;
  reason?: string;
}

export interface DGAStreamResponse {
  stream_url: string;
  expires_at: string;
  quality_options?: Array<{ quality: string; url: string }>;
}
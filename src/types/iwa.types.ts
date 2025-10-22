// IWA (Indigenous Worth Assessment) Ledger Types

export type Virtue = 
  | 'honesty'
  | 'reliability'
  | 'generosity'
  | 'respect'
  | 'courage'
  | 'wisdom'
  | 'compassion'
  | 'integrity';

export interface IWAAttestation {
  virtue: Virtue;
  rating: number; // 1-5
  comment?: string;
}

export interface IWASubmitAttestationRequest {
  attestee_id: string;
  attestations: IWAAttestation[];
  relationship: 'family' | 'friend' | 'colleague' | 'community';
}

export interface IWASubmitAttestationResponse {
  attestation_id: string;
  attestee_new_score: number;
  recorded_at: string;
}

export interface IWAScoreResponse {
  user_id: string;
  iwa_score: number;
  max_score: number;
  percentile: number;
  sankofa_totem?: string;
  last_updated: string;
}

export interface IWATotemResponse {
  user_id: string;
  sankofa_totem: string;
  totem_description: string;
  privileges: string[];
  earned_at: string;
}

export interface IWAAttestationHistoryResponse {
  attestations: Array<{
    id: string;
    attester_name: string;
    virtues: Array<{ virtue: Virtue; rating: number }>;
    created_at: string;
  }>;
  total_received: number;
  average_score: number;
}
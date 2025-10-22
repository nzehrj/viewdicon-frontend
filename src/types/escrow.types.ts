// Escrow & Moot Resolution Types

export type EscrowStatus = 
  | 'created'
  | 'funded'
  | 'locked'
  | 'disputed'
  | 'released'
  | 'refunded'
  | 'cancelled';

export interface EscrowCreateRequest {
  amount: number;
  currency: string;
  beneficiary_id: string;
  description: string;
  release_conditions?: string;
  auto_release_days?: number;
}

export interface EscrowCreateResponse {
  escrow_id: string;
  amount: number;
  status: EscrowStatus;
  created_at: string;
}

export interface EscrowLockRequest {
  escrow_id: string;
}

export interface EscrowRaiseDisputeRequest {
  escrow_id: string;
  reason: string;
  evidence?: string[];
}

export interface EscrowRaiseDisputeResponse {
  escrow_id: string;
  dispute_id: string;
  moot_initiated: boolean;
  status: 'disputed';
}

export interface EscrowStatusResponse {
  escrow_id: string;
  amount: number;
  currency: string;
  status: EscrowStatus;
  payer_id: string;
  beneficiary_id: string;
  dispute_id?: string;
  created_at: string;
  updated_at: string;
}

// Moot Resolution System
export interface MootInitiateRequest {
  dispute_id: string;
  escrow_id: string;
  parties: string[];
}

export interface MootInitiateResponse {
  moot_id: string;
  status: 'pending' | 'in_progress' | 'resolved';
  mediator_assigned: boolean;
}

export interface MootStatusResponse {
  moot_id: string;
  dispute_id: string;
  status: 'pending' | 'in_progress' | 'resolved';
  mediator_id?: string;
  resolution?: string;
  resolved_at?: string;
}

export interface MootResolutionResponse {
  moot_id: string;
  resolution: 'release_to_beneficiary' | 'refund_to_payer' | 'split_funds';
  split_percentages?: { payer: number; beneficiary: number };
  consensus_token: string;
}
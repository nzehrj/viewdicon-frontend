/**
 * Security & Protection Type Definitions
 * Upgrades 1, 4, 5 Implementation
 */

// ===== WATCHFUL EYE (ATM SECURITY) =====

export type FinancialIntent = 
  | 'WALLET_TRANSFER'
  | 'ESCROW_RELEASE'
  | 'LIVE_STREAM_GIFT'
  | 'CROSS_BORDER_TRANSFER'
  | 'CASH_OUT'
  | 'CRYPTO_MOVE';

export interface WatchfulEyeCapture {
  afro_id: string;
  device_fingerprint: string;
  face_hash: string;
  intent: FinancialIntent;
  amount: number;
  currency: string;
  timestamp: Date;
}

export type GuardianState = 'allowed' | 'under_protection';
export type GuardianAction = 'proceed' | 'freeze_and_alert_clan';
export type GuardianReason = 
  | 'face_mismatch' 
  | 'new_device' 
  | 'limit_exceeded'
  | 'suspicious_behavior'
  | 'location_mismatch';

export interface WatchfulEyeResponse {
  state: GuardianState;
  action: GuardianAction;
  reason?: GuardianReason;
  message?: string;
}

// ===== EMERGENCY LOCKDOWN (CALL THE CIRCLE) =====

export interface EmergencyContact {
  afro_id: string;
  display_name: string;
  relationship: string;
  phone: string;
  avatar_url?: string;
  last_confirmed?: Date;
}

export interface CircleAlert {
  alert_id: string;
  triggered_by: string; // AfroID
  triggered_at: Date;
  reason: GuardianReason;
  contacts_notified: string[]; // AfroIDs
  confirmations: CircleConfirmation[];
  status: 'pending' | 'confirmed' | 'denied' | 'escalated';
}

export interface CircleConfirmation {
  from_afro_id: string;
  confirmed: boolean;
  confirmed_at: Date;
  message?: string;
}

export interface ProtectionMode {
  active: boolean;
  triggered_at: Date;
  reason: GuardianReason;
  alert?: CircleAlert;
  restrictions: string[]; // e.g., ["wallet_transfer", "live_stream", "whisper_strangers"]
}

// ===== INNER FIRE CIRCLE (TRUSTED CONTACTS) =====

export interface InnerFireCircle {
  afro_id: string;
  members: EmergencyContact[];
  quorum_required: number; // How many must confirm (e.g., 2 of 3)
  created_at: Date;
  last_updated: Date;
}
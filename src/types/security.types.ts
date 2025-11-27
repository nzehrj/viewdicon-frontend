/**
 * Security & Protection Type Definitions
 * Upgrades 1, 4, 5 Implementation
 * Updated to match component requirements
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
  | 'location_mismatch'
  | 'voice_mismatch'; // Added for voice verification

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

// ✅ UPDATED: CircleAlert - matches CircleAlertFlow component expectations
export interface CircleAlert {
  alert_id: string;
  status: 'pending' | 'confirmed' | 'denied' | 'escalated';
  reason: GuardianReason;
  confirmations: CircleConfirmation[];
  expires_at: string; // ISO date string
  triggered_by?: string; // AfroID (optional for backward compatibility)
  triggered_at?: Date; // Optional for backward compatibility
  contacts_notified?: string[]; // AfroIDs (optional for backward compatibility)
}

export interface CircleConfirmation {
  from_afro_id: string;
  confirmed: boolean;
  timestamp: string; // ISO date string (changed from confirmed_at)
  method: 'sms' | 'app' | 'call'; // Added method field
  message?: string;
  confirmed_at?: Date; // Optional for backward compatibility
}

// ✅ UPDATED: ProtectionMode - matches ProtectionModeScreen component expectations
export interface ProtectionMode {
  active: boolean;
  reason: GuardianReason;
  restrictions: string[]; // e.g., ["Large transactions", "Profile changes"]
  triggered_at?: Date; // Optional
  alert?: CircleAlert; // Optional
}

// ===== INNER FIRE CIRCLE (TRUSTED CONTACTS) =====

export interface InnerFireCircle {
  afro_id: string;
  members: EmergencyContact[];
  quorum_required: number; // How many must confirm (e.g., 2 of 3)
  created_at: Date;
  last_updated: Date;
}

// ===== ADDITIONAL TYPES FOR PROTECTION MODE SCREEN =====

export type ProtectionReason = GuardianReason; // Alias for consistency
// Device Binding & DPoP Types

export type DevicePlatform = 'web' | 'android' | 'ios';

export interface DeviceEnrollRequest {
  user_temp_id?: string;
  jkt: string; // JSON Web Key Thumbprint
  platform: DevicePlatform;
  hw_fingerprint?: string;
  attestation_data?: any;
}

export interface DeviceEnrollResponse {
  device_id: string;
  dpop_required: boolean;
  offline_ttl: number;
}

export interface DeviceAttestRequest {
  device_id: string;
  attestation_statement: string;
  platform: DevicePlatform;
}

export interface DeviceAttestResponse {
  verified: boolean;
  trust_level: 'high' | 'medium' | 'low';
}

export interface DeviceStatusResponse {
  device_id: string;
  platform: DevicePlatform;
  enrolled_at: string;
  last_seen: string;
  status: 'active' | 'suspended' | 'revoked';
}

export interface DPoPProof {
  auth?: string; // Authorization header value
  proof?: string; // DPoP header value
}

export interface DPoPKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
  jkt: string; // JSON Web Key Thumbprint
}

// Device Management
export interface ManagedDevice {
  device_id: string;
  platform: DevicePlatform;
  device_name?: string;
  enrolled_at: string;
  last_active: string;
  is_current: boolean;
}

export interface DeviceCapResponse {
  current_devices: number;
  max_devices: number;
  devices: ManagedDevice[];
  can_enroll: boolean;
}
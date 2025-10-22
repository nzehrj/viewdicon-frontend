import { apiClient } from '@services/api/client';
import { AUTH_FLOW } from '@config/services.config';
import { ensureKeypair, computeJKT } from '@services/crypto/keys';
import { generateDPoPProof } from '@services/crypto/dpop';
import { getDevicePlatform } from '@utils/helpers';
import { storage } from '@utils/storage';
import type {
  DeviceEnrollRequest,
  DeviceEnrollResponse,
  DeviceAttestRequest,
  DeviceAttestResponse,
  DeviceStatusResponse,
  DeviceCapResponse,
} from '@/types/device.types';

/**
 * Enroll device (bind device to user account)
 */
export const enrollDevice = async (userTempId?: string): Promise<DeviceEnrollResponse> => {
  // Ensure keypair exists
  const keypair = await ensureKeypair();

  // Compute JKT
  const jkt = await computeJKT(keypair.publicKey);

  // Get platform
  const platform = getDevicePlatform();

  // Create hardware fingerprint
  const hwFingerprint = await createHardwareFingerprint();

  const data: DeviceEnrollRequest = {
    user_temp_id: userTempId,
    jkt,
    platform,
    hw_fingerprint: hwFingerprint,
  };

  const response = await apiClient.post<DeviceEnrollResponse>(
    `${AUTH_FLOW.BASE}${AUTH_FLOW.ENDPOINTS.DEVICE_ENROLL}`,
    data
  );

  // Store device ID
  await storage.setDeviceId(response.device_id);

  return response;
};

/**
 * Attest device (additional security verification)
 */
export const attestDevice = async (deviceId: string): Promise<DeviceAttestResponse> => {
  const platform = getDevicePlatform();

  // Generate attestation statement (platform-specific)
  const attestationStatement = await generateAttestationStatement(platform);

  const data: DeviceAttestRequest = {
    device_id: deviceId,
    attestation_statement: attestationStatement,
    platform,
  };

  const dpopProof = await generateDPoPProof(
    'POST',
    `${AUTH_FLOW.BASE}${AUTH_FLOW.ENDPOINTS.DEVICE_ATTEST}`
  );

  return apiClient.dpopRequest<DeviceAttestResponse>(
    `${AUTH_FLOW.BASE}${AUTH_FLOW.ENDPOINTS.DEVICE_ATTEST}`,
    'POST',
    dpopProof,
    data
  );
};

/**
 * Get device status
 */
export const getDeviceStatus = async (deviceId: string): Promise<DeviceStatusResponse> => {
  const url = AUTH_FLOW.ENDPOINTS.DEVICE_STATUS.replace(':id', deviceId);
  return apiClient.get<DeviceStatusResponse>(`${AUTH_FLOW.BASE}${url}`);
};

/**
 * Get device capacity (how many devices user has)
 */
export const getDeviceCapacity = async (): Promise<DeviceCapResponse> => {
  return apiClient.get<DeviceCapResponse>('/v1/device/capacity');
};

/**
 * Remove device
 */
export const removeDevice = async (deviceId: string): Promise<void> => {
  return apiClient.delete(`/v1/device/${deviceId}`);
};

/**
 * Create hardware fingerprint
 */
const createHardwareFingerprint = async (): Promise<string> => {
  const components: string[] = [];

  // User agent
  components.push(navigator.userAgent);

  // Screen resolution
  components.push(`${screen.width}x${screen.height}`);

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Language
  components.push(navigator.language);

  // Platform
  components.push(navigator.platform);

  // Hardware concurrency (CPU cores)
  components.push(navigator.hardwareConcurrency?.toString() || 'unknown');

  // Device memory (if available)
  if ('deviceMemory' in navigator) {
    components.push((navigator as any).deviceMemory.toString());
  }

  // Combine and hash
  const fingerprint = components.join('|');
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprint);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Generate attestation statement (platform-specific)
 */
const generateAttestationStatement = async (
  platform: 'web' | 'android' | 'ios'
): Promise<string> => {
  if (platform === 'web') {
    // For web, we use a simple challenge-response
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const response = await crypto.subtle.digest('SHA-256', challenge);
    return btoa(String.fromCharCode(...new Uint8Array(response)));
  }

  // For mobile platforms, would use platform-specific APIs
  // (SafetyNet for Android, DeviceCheck for iOS)
  return 'mock_attestation_' + Date.now();
};
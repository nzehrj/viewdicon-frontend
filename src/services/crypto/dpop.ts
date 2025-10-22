import { v4 as uuidv4 } from 'uuid';
import { ensureKeypair, computeJKT, signData, base64UrlEncode } from './keys';
import type { DPoPProof } from '@/types/device.types';
import { storage } from '@utils/storage';

/**
 * Generate DPoP proof for authenticated requests
 */
export const generateDPoPProof = async (
  method: string,
  url: string
): Promise<DPoPProof> => {
  // Ensure keypair exists
  const keypair = await ensureKeypair();

  // Compute JKT
  const jkt = await computeJKT(keypair.publicKey);

  // Get access token
  const accessToken = await storage.getAuthToken();

  if (!accessToken) {
    throw new Error('No access token available for DPoP proof');
  }

  // Create DPoP header (JWT format)
  const header = {
    alg: 'EdDSA',
    typ: 'dpop+jwt',
    jwk: {
      kty: 'OKP',
      crv: 'Ed25519',
      x: jkt,
    },
  };

  // Create DPoP payload
  const payload = {
    jti: uuidv4(), // Unique ID for this proof
    htm: method.toUpperCase(), // HTTP method
    htu: url, // HTTP URI
    iat: Math.floor(Date.now() / 1000), // Issued at
    ath: await hashAccessToken(accessToken), // Access token hash
  };

  // Encode header and payload
  const encodedHeader = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify(header))
  );
  const encodedPayload = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify(payload))
  );

  // Sign the proof
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = await signData(keypair.privateKey, signingInput);

  // Create complete JWT
  const dpopProofJWT = `${encodedHeader}.${encodedPayload}.${signature}`;

  return {
    auth: accessToken,
    proof: dpopProofJWT,
  };
};

/**
 * Hash access token for DPoP proof
 */
const hashAccessToken = async (token: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(hashBuffer));
};

/**
 * Make DPoP-protected request
 */
export const makeDPoPRequest = async <T = any>(
  method: string,
  url: string,
  body?: any
): Promise<T> => {
  const proof = await generateDPoPProof(method, url);

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `DPoP ${proof.auth}`,
      DPoP: proof.proof!,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`DPoP request failed: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Regenerate keypair (on DPoP failure)
 */
export const regenerateKeypair = async (): Promise<void> => {
  const { deleteKeypair, ensureKeypair } = await import('./keys');
  await deleteKeypair();
  await ensureKeypair();
};
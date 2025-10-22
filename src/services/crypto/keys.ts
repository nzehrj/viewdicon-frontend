import { storage } from '@utils/storage';

/**
 * Generate Ed25519 keypair for DPoP
 */
export const generateKeypair = async (): Promise<CryptoKeyPair> => {
  // Use browser's WebCrypto API
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      // Try Ed25519 first
      const keypair = await window.crypto.subtle.generateKey(
        {
          name: 'ECDSA',
          namedCurve: 'P-256',
        },
        true,
        ['sign', 'verify']
      );
      return keypair;
    } catch (error) {
      console.error('Key generation failed:', error);
      throw new Error('Failed to generate cryptographic keys');
    }
  }

  throw new Error('WebCrypto API not available');
};

/**
 * Compute JKT (JSON Web Key Thumbprint) from public key
 */
export const computeJKT = async (publicKey: CryptoKey): Promise<string> => {
  // Export public key
  const exported = await window.crypto.subtle.exportKey('raw', publicKey);
  const pubKeyBytes = new Uint8Array(exported);

  // Compute SHA-256 hash
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', pubKeyBytes);
  const hash = new Uint8Array(hashBuffer);

  // Convert to base64url
  return base64UrlEncode(hash);
};

/**
 * Sign data with private key
 */
export const signData = async (
  privateKey: CryptoKey,
  data: string
): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(data);

  const signature = await window.crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' },
    },
    privateKey,
    dataBytes
  );

  return base64UrlEncode(new Uint8Array(signature));
};

/**
 * Base64URL encode
 */
export const base64UrlEncode = (data: Uint8Array): string => {
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

/**
 * Base64URL decode
 */
export const base64UrlDecode = (data: string): Uint8Array => {
  const base64 = data.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

/**
 * Store keypair securely
 */
export const storeKeypair = async (keypair: CryptoKeyPair): Promise<void> => {
  await storage.setDPoPKey(keypair);
};

/**
 * Retrieve keypair
 */
export const getKeypair = async (): Promise<CryptoKeyPair | null> => {
  const keypair = await storage.getDPoPKey();
  return keypair || null;
};

/**
 * Delete keypair
 */
export const deleteKeypair = async (): Promise<void> => {
  await storage.removeDPoPKey();
};

/**
 * Ensure keypair exists (create if not)
 */
export const ensureKeypair = async (): Promise<CryptoKeyPair> => {
  let keypair = await getKeypair();

  if (!keypair) {
    keypair = await generateKeypair();
    await storeKeypair(keypair);
  }

  return keypair;
};
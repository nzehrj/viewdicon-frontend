import { useCallback } from 'react';
import { generateDPoPProof } from '@services/crypto/dpop';
import { ensureKeypair } from '@services/crypto/keys';
import type { DPoPProof } from '@/types/device.types';

export const useDPoP = () => {
  const generateProof = useCallback(async (method: string, url: string): Promise<DPoPProof | null> => {
    try {
      // Ensure keypair exists
      await ensureKeypair();
      
      // Generate proof
      const proof = await generateDPoPProof(method, url);
      return proof;
    } catch (error) {
      console.error('DPoP proof generation failed:', error);
      return null;
    }
  }, []);

  const makeProtectedRequest = useCallback(async <T = any>(
    method: string,
    url: string,
    body?: any
  ): Promise<T | null> => {
    try {
      const proof = await generateProof(method, url);
      if (!proof) throw new Error('Failed to generate DPoP proof');

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `DPoP ${proof.auth}`,
          'DPoP': proof.proof!,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Protected request failed:', error);
      return null;
    }
  }, [generateProof]);

  return {
    generateProof,
    makeProtectedRequest,
  };
};
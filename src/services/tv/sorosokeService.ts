// src/services/tv/sorosokeService.ts
// Sorosoke (Call-In System) Service - API Connector

import { SorosokeSession, SorosokeCall, SorosokeBundle } from '@/types/tv/sorosoke.types';

const API_BASE = '/api/sorosoke';

/**
 * Sorosoke Service
 */
export const sorosokeService = {
  /**
   * Get Sorosoke session
   */
  async getSession(sessionId: string): Promise<SorosokeSession> {
    const response = await fetch(`${API_BASE}/sessions/${sessionId}`);
    
    if (!response.ok) throw new Error('Failed to fetch session');
    return response.json();
  },

  /**
   * Join call queue
   */
  async joinQueue(
    sessionId: string,
    callType: 'voice' | 'video' | 'text',
    question?: string
  ): Promise<SorosokeCall> {
    const response = await fetch(`${API_BASE}/sessions/${sessionId}/queue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: callType, question }),
    });
    
    if (!response.ok) throw new Error('Failed to join queue');
    return response.json();
  },

  /**
   * Leave call queue
   */
  async leaveQueue(callId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/calls/${callId}/leave`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to leave queue');
  },

  /**
   * Get user's active call
   */
  async getMyCall(sessionId: string): Promise<SorosokeCall | null> {
    const response = await fetch(`${API_BASE}/sessions/${sessionId}/my-call`);
    
    if (!response.ok) return null;
    return response.json();
  },

  /**
   * Get user's call bundles
   */
  async getBundles(userId: string): Promise<SorosokeBundle[]> {
    const response = await fetch(`/api/users/${userId}/sorosoke-bundles`);
    
    if (!response.ok) throw new Error('Failed to fetch bundles');
    return response.json();
  },

  /**
   * Purchase call bundle
   */
  async purchaseBundle(bundleType: 'single' | '5-pack' | '10-pack' | '20-pack'): Promise<SorosokeBundle> {
    const response = await fetch(`${API_BASE}/bundles/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bundleType }),
    });
    
    if (!response.ok) throw new Error('Failed to purchase bundle');
    return response.json();
  },

  /**
   * Approve call (moderator)
   */
  async approveCall(callId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/calls/${callId}/approve`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to approve call');
  },

  /**
   * Reject call (moderator)
   */
  async rejectCall(callId: string, reason: string): Promise<void> {
    const response = await fetch(`${API_BASE}/calls/${callId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    
    if (!response.ok) throw new Error('Failed to reject call');
  },

  /**
   * Mute call (moderator)
   */
  async muteCall(callId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/calls/${callId}/mute`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to mute call');
  },

  /**
   * Kick caller (moderator)
   */
  async kickCall(callId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/calls/${callId}/kick`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to kick call');
  },

  /**
   * End call (moderator)
   */
  async endCall(callId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/calls/${callId}/end`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to end call');
  },

  /**
   * Get respect filter settings
   */
  async getRespectFilter(sessionId: string): Promise<any> {
    const response = await fetch(`${API_BASE}/sessions/${sessionId}/respect-filter`);
    
    if (!response.ok) throw new Error('Failed to fetch respect filter');
    return response.json();
  },

  /**
   * Update respect filter settings
   */
  async updateRespectFilter(
    sessionId: string,
    settings: {
      enabled: boolean;
      strictness: 'low' | 'medium' | 'high';
      autoMute: boolean;
      autoKick: boolean;
    }
  ): Promise<void> {
    const response = await fetch(`${API_BASE}/sessions/${sessionId}/respect-filter`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    
    if (!response.ok) throw new Error('Failed to update respect filter');
  },

  /**
   * Get DJ telemetry (live metrics)
   */
  async getTelemetry(sessionId: string): Promise<any> {
    const response = await fetch(`${API_BASE}/sessions/${sessionId}/telemetry`);
    
    if (!response.ok) throw new Error('Failed to fetch telemetry');
    return response.json();
  },

  /**
   * Get Sorosoke analytics
   */
  async getAnalytics(sessionId: string): Promise<any> {
    const response = await fetch(`${API_BASE}/sessions/${sessionId}/analytics`);
    
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  },
};

export default sorosokeService;
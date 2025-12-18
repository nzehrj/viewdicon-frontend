// src/services/tv/streamService.ts
// TV Stream Service - API Connector

import { TVChannel } from '@/types/tv/tv.types';

const API_BASE = '/api/tv';

/**
 * Stream Service
 */
export const streamService = {
  /**
   * Get all channels
   */
  async getChannels(): Promise<TVChannel[]> {
    const response = await fetch(`${API_BASE}/channels`);
    
    if (!response.ok) throw new Error('Failed to fetch channels');
    return response.json();
  },

  /**
   * Get single channel
   */
  async getChannel(channelId: string): Promise<TVChannel> {
    const response = await fetch(`${API_BASE}/channels/${channelId}`);
    
    if (!response.ok) throw new Error('Failed to fetch channel');
    return response.json();
  },

  /**
   * Get stream URL
   */
  async getStreamUrl(channelId: string): Promise<{ streamUrl: string; quality: string }> {
    const response = await fetch(`${API_BASE}/channels/${channelId}/stream`);
    
    if (!response.ok) throw new Error('Failed to fetch stream URL');
    return response.json();
  },

  /**
   * Start viewer session
   */
  async startViewerSession(channelId: string): Promise<{ sessionId: string }> {
    const response = await fetch(`${API_BASE}/sessions/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId }),
    });
    
    if (!response.ok) throw new Error('Failed to start viewer session');
    return response.json();
  },

  /**
   * End viewer session
   */
  async endViewerSession(channelId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/sessions/end`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId }),
    });
    
    if (!response.ok) throw new Error('Failed to end viewer session');
  },

  /**
   * Record viewer interaction
   */
  async recordInteraction(channelId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/sessions/interaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId }),
    });
    
    if (!response.ok) throw new Error('Failed to record interaction');
  },
};

export default streamService;
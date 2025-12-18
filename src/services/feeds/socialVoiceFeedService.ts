// src/services/feeds/socialVoiceFeedService.ts
// Social Voice Feed Service - API Connector

import { SocialVoicePost, SocialVoiceFilters, LiveMicroRoom, ThreadChain } from '@/types/feeds/socialVoice.types';

const API_BASE = '/api/feeds/social-voice';

/**
 * Social Voice Feed Service
 */
export const socialVoiceFeedService = {
  /**
   * Get social voice feed posts
   */
  async getFeed(filters?: SocialVoiceFilters): Promise<SocialVoicePost[]> {
    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters }),
    });
    
    if (!response.ok) throw new Error('Failed to fetch social voice feed');
    return response.json();
  },

  /**
   * Get single post by ID
   */
  async getPost(postId: string): Promise<SocialVoicePost> {
    const response = await fetch(`${API_BASE}/${postId}`);
    
    if (!response.ok) throw new Error('Failed to fetch post');
    return response.json();
  },

  /**
   * Create new post
   */
  async createPost(post: Partial<SocialVoicePost>): Promise<SocialVoicePost> {
    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  },

  /**
   * Amplify post (TUSIKIE)
   */
  async amplifyPost(postId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${postId}/amplify`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to amplify post');
  },

  /**
   * Verify post (KUBALIKA)
   */
  async verifyPost(postId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${postId}/verify`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to verify post');
  },

  /**
   * Ubuntu support (UBUNTU)
   */
  async ubuntuPost(postId: string, message?: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${postId}/ubuntu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) throw new Error('Failed to ubuntu post');
  },

  /**
   * Help post (NGUVU)
   */
  async helpPost(postId: string, message?: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${postId}/help`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) throw new Error('Failed to help post');
  },

  /**
   * Peace flag (RO™)
   */
  async peaceFlagPost(postId: string, reason: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${postId}/peace`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    
    if (!response.ok) throw new Error('Failed to flag peace');
  },

  /**
   * Get thread chain
   */
  async getThread(threadId: string): Promise<ThreadChain> {
    const response = await fetch(`/api/threads/${threadId}`);
    
    if (!response.ok) throw new Error('Failed to fetch thread');
    return response.json();
  },

  /**
   * Get live micro-room
   */
  async getRoom(roomId: string): Promise<LiveMicroRoom> {
    const response = await fetch(`/api/rooms/${roomId}`);
    
    if (!response.ok) throw new Error('Failed to fetch room');
    return response.json();
  },

  /**
   * Join live micro-room
   */
  async joinRoom(roomId: string, role: 'speaker' | 'listener'): Promise<void> {
    const response = await fetch(`/api/rooms/${roomId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    
    if (!response.ok) throw new Error('Failed to join room');
  },

  /**
   * Leave live micro-room
   */
  async leaveRoom(roomId: string): Promise<void> {
    const response = await fetch(`/api/rooms/${roomId}/leave`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to leave room');
  },

  /**
   * Raise hand in room
   */
  async raiseHand(roomId: string): Promise<void> {
    const response = await fetch(`/api/rooms/${roomId}/raise-hand`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to raise hand');
  },

  /**
   * Create witness post (geo-locked)
   */
  async createWitnessPost(data: {
    text: string;
    imageUrl?: string;
    voiceUrl?: string;
    geoLocation: { latitude: number; longitude: number };
  }): Promise<SocialVoicePost> {
    const response = await fetch(`${API_BASE}/witness`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to create witness post');
    return response.json();
  },
};

export default socialVoiceFeedService;
// src/services/pot/echoService.ts
// Echo System Service - API Connector

import { EchoChain } from '@/types/social/pot.types';

const API_BASE = '/api/echo';

/**
 * Echo Service
 */
export const echoService = {
  /**
   * Create echo (reshare)
   */
  async createEcho(originalPotId: string, message?: string): Promise<any> {
    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalPotId, message }),
    });
    
    if (!response.ok) throw new Error('Failed to create echo');
    return response.json();
  },

  /**
   * Get echo chain (reshare lineage)
   */
  async getEchoChain(originalPotId: string): Promise<EchoChain> {
    const response = await fetch(`${API_BASE}/chain/${originalPotId}`);
    
    if (!response.ok) throw new Error('Failed to fetch echo chain');
    return response.json();
  },

  /**
   * Get amplifier rewards (earnings from echoes)
   */
  async getAmplifierRewards(userId: string): Promise<any> {
    const response = await fetch(`/api/users/${userId}/amplifier-rewards`);
    
    if (!response.ok) throw new Error('Failed to fetch amplifier rewards');
    return response.json();
  },

  /**
   * Get echo analytics
   */
  async getEchoAnalytics(potId: string): Promise<any> {
    const response = await fetch(`/api/pots/${potId}/echo/analytics`);
    
    if (!response.ok) throw new Error('Failed to fetch echo analytics');
    return response.json();
  },

  /**
   * Get user's echoes
   */
  async getMyEchoes(userId: string): Promise<any[]> {
    const response = await fetch(`/api/users/${userId}/echoes`);
    
    if (!response.ok) throw new Error('Failed to fetch user echoes');
    return response.json();
  },

  /**
   * Get echo notifications
   */
  async getEchoNotifications(userId: string): Promise<any[]> {
    const response = await fetch(`/api/users/${userId}/echo-notifications`);
    
    if (!response.ok) throw new Error('Failed to fetch echo notifications');
    return response.json();
  },

  /**
   * Get echo performance (for content creators)
   */
  async getEchoPerformance(userId: string, timeRange: '24h' | '7d' | '30d'): Promise<any> {
    const response = await fetch(`/api/users/${userId}/echo-performance?range=${timeRange}`);
    
    if (!response.ok) throw new Error('Failed to fetch echo performance');
    return response.json();
  },

  /**
   * Delete echo
   */
  async deleteEcho(echoId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${echoId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete echo');
  },
};

export default echoService;
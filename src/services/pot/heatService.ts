// src/services/pot/heatService.ts
// Heat System Service - API Connector

import { LiftScope } from '@/types/social/pot.types';

const API_BASE = '/api';

/**
 * Heat Service
 */
export const heatService = {
  /**
   * Get POT heat data
   */
  async getHeat(potId: string): Promise<{
    finalHeat: number;
    baseHeat: number;
    multipliedHeat: number;
    diversityBoost: number;
  }> {
    const response = await fetch(`${API_BASE}/pots/${potId}/heat`);
    
    if (!response.ok) throw new Error('Failed to fetch heat');
    return response.json();
  },

  /**
   * Get heat history
   */
  async getHeatHistory(potId: string, timeRange: '24h' | '7d' | '30d'): Promise<any[]> {
    const response = await fetch(`${API_BASE}/pots/${potId}/heat/history?range=${timeRange}`);
    
    if (!response.ok) throw new Error('Failed to fetch heat history');
    return response.json();
  },

  /**
   * Get heat contributors (top actors)
   */
  async getHeatContributors(potId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE}/pots/${potId}/heat/contributors`);
    
    if (!response.ok) throw new Error('Failed to fetch heat contributors');
    return response.json();
  },

  /**
   * Get heat milestones
   */
  async getHeatMilestones(potId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE}/pots/${potId}/heat/milestones`);
    
    if (!response.ok) throw new Error('Failed to fetch heat milestones');
    return response.json();
  },

  /**
   * Get heat leaderboard
   */
  async getLeaderboard(scope: 'local' | 'regional' | 'national' | 'global'): Promise<any[]> {
    const response = await fetch(`${API_BASE}/heat/leaderboard?scope=${scope}`);
    
    if (!response.ok) throw new Error('Failed to fetch heat leaderboard');
    return response.json();
  },

  /**
   * Get lift status (Discovery feed)
   */
  async getLiftStatus(potId: string): Promise<{
    currentScope: LiftScope | null;
    isLifted: boolean;
    liftedAt: string | null;
    canLiftToNext: boolean;
    nextScope: LiftScope | null;
    blockers: string[];
  }> {
    const response = await fetch(`${API_BASE}/pots/${potId}/lift-status`);
    
    if (!response.ok) throw new Error('Failed to fetch lift status');
    return response.json();
  },
};

export default heatService;
// src/services/feeds/familyRootService.ts
// Family Root Feed Service - API Connector

import { FamilyHouse, FamilyPost, FamilyRootFilters, ContributionBoard, ClanPurse } from '@/types/feeds/familyRoot.types';

const API_BASE = '/api/houses';

/**
 * Family Root Feed Service
 */
export const familyRootService = {
  /**
   * Get family root feed posts
   */
  async getFeed(houseId: string, filters?: FamilyRootFilters): Promise<FamilyPost[]> {
    const response = await fetch(`${API_BASE}/${houseId}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters }),
    });
    
    if (!response.ok) throw new Error('Failed to fetch family feed');
    return response.json();
  },

  /**
   * Get family house by ID
   */
  async getHouse(houseId: string): Promise<FamilyHouse> {
    const response = await fetch(`${API_BASE}/${houseId}`);
    
    if (!response.ok) throw new Error('Failed to fetch house');
    return response.json();
  },

  /**
   * Create new post in house
   */
  async createPost(houseId: string, post: Partial<FamilyPost>): Promise<FamilyPost> {
    const response = await fetch(`${API_BASE}/${houseId}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  },

  /**
   * Join family house
   */
  async joinHouse(houseId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${houseId}/join`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to join house');
  },

  /**
   * Leave family house
   */
  async leaveHouse(houseId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${houseId}/leave`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to leave house');
  },

  /**
   * Get contribution board (Ajo/Esusu/Stokvel)
   */
  async getContributionBoard(boardId: string): Promise<ContributionBoard> {
    const response = await fetch(`/api/contributions/${boardId}`);
    
    if (!response.ok) throw new Error('Failed to fetch contribution board');
    return response.json();
  },

  /**
   * Make contribution to board
   */
  async makeContribution(boardId: string, amount: number): Promise<void> {
    const response = await fetch(`/api/contributions/${boardId}/contribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    
    if (!response.ok) throw new Error('Failed to make contribution');
  },

  /**
   * Get clan purse (shared wallet)
   */
  async getClanPurse(purseId: string): Promise<ClanPurse> {
    const response = await fetch(`/api/clan-purse/${purseId}`);
    
    if (!response.ok) throw new Error('Failed to fetch clan purse');
    return response.json();
  },

  /**
   * Add to clan purse
   */
  async addToPurse(purseId: string, amount: number): Promise<void> {
    const response = await fetch(`/api/clan-purse/${purseId}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    
    if (!response.ok) throw new Error('Failed to add to clan purse');
  },

  /**
   * Get heritage archive
   */
  async getHeritageArchive(houseId: string): Promise<any[]> {
    const response = await fetch(`${API_BASE}/${houseId}/heritage`);
    
    if (!response.ok) throw new Error('Failed to fetch heritage archive');
    return response.json();
  },
};

export default familyRootService;
// src/services/feeds/marketplaceFeedService.ts
// Marketplace Feed Service - API Connector

import { MarketplaceListing, MarketplaceTransaction, MarketplaceFilters, BusinessChatThread } from '@/types/feeds/marketplace.types';

const API_BASE = '/api/feeds/marketplace';

/**
 * Marketplace Feed Service
 */
export const marketplaceFeedService = {
  /**
   * Get marketplace feed listings
   */
  async getFeed(filters?: MarketplaceFilters): Promise<MarketplaceListing[]> {
    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters }),
    });
    
    if (!response.ok) throw new Error('Failed to fetch marketplace feed');
    return response.json();
  },

  /**
   * Get single listing by ID
   */
  async getListing(listingId: string): Promise<MarketplaceListing> {
    const response = await fetch(`${API_BASE}/listings/${listingId}`);
    
    if (!response.ok) throw new Error('Failed to fetch listing');
    return response.json();
  },

  /**
   * Create new listing
   */
  async createListing(listing: Partial<MarketplaceListing>): Promise<MarketplaceListing> {
    const response = await fetch(`${API_BASE}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listing),
    });
    
    if (!response.ok) throw new Error('Failed to create listing');
    return response.json();
  },

  /**
   * Update listing
   */
  async updateListing(listingId: string, data: Partial<MarketplaceListing>): Promise<MarketplaceListing> {
    const response = await fetch(`${API_BASE}/listings/${listingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to update listing');
    return response.json();
  },

  /**
   * Delete listing
   */
  async deleteListing(listingId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/listings/${listingId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete listing');
  },

  /**
   * Get user's transactions
   */
  async getTransactions(userId: string, role: 'buyer' | 'seller'): Promise<MarketplaceTransaction[]> {
    const response = await fetch(`/api/users/${userId}/transactions?role=${role}`);
    
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  },

  /**
   * Create transaction (Add to Pot)
   */
  async createTransaction(data: {
    listingId: string;
    quantity: number;
    deliveryMode: string;
  }): Promise<MarketplaceTransaction> {
    const response = await fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to create transaction');
    return response.json();
  },

  /**
   * Confirm delivery
   */
  async confirmDelivery(transactionId: string): Promise<MarketplaceTransaction> {
    const response = await fetch(`${API_BASE}/transactions/${transactionId}/confirm`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to confirm delivery');
    return response.json();
  },

  /**
   * Dispute transaction
   */
  async disputeTransaction(transactionId: string, reason: string): Promise<MarketplaceTransaction> {
    const response = await fetch(`${API_BASE}/transactions/${transactionId}/dispute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    
    if (!response.ok) throw new Error('Failed to dispute transaction');
    return response.json();
  },

  /**
   * Generate voice pickup code (Ọ̀RỌ̀-KEY)
   */
  async generatePickupCode(transactionId: string): Promise<{ code: string }> {
    const response = await fetch(`${API_BASE}/transactions/${transactionId}/pickup-code`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to generate pickup code');
    return response.json();
  },

  /**
   * Verify pickup code
   */
  async verifyPickupCode(transactionId: string, code: string): Promise<{ valid: boolean }> {
    const response = await fetch(`${API_BASE}/transactions/${transactionId}/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    
    if (!response.ok) throw new Error('Failed to verify pickup code');
    return response.json();
  },

  /**
   * Get business chat thread
   */
  async getChatThread(threadId: string): Promise<BusinessChatThread> {
    const response = await fetch(`${API_BASE}/chats/${threadId}`);
    
    if (!response.ok) throw new Error('Failed to fetch chat thread');
    return response.json();
  },

  /**
   * Send message in business chat
   */
  async sendMessage(threadId: string, message: {
    text?: string;
    voiceUrl?: string;
    imageUrl?: string;
  }): Promise<void> {
    const response = await fetch(`${API_BASE}/chats/${threadId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    
    if (!response.ok) throw new Error('Failed to send message');
  },
};

export default marketplaceFeedService;
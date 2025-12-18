// src/services/cowrie/escrowService.ts
// Escrow Service - API Connector

const API_BASE = '/api/escrow';

/**
 * Escrow Service
 */
export const escrowService = {
  /**
   * Create escrow for marketplace transaction
   */
  async createEscrow(data: {
    transactionId: string;
    amount: number;
    buyerId: string;
    sellerId: string;
  }): Promise<any> {
    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to create escrow');
    return response.json();
  },

  /**
   * Lock escrow funds
   */
  async lockEscrow(escrowId: string): Promise<any> {
    const response = await fetch(`${API_BASE}/${escrowId}/lock`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to lock escrow');
    return response.json();
  },

  /**
   * Start delivery
   */
  async startDelivery(escrowId: string, data: {
    pickupCode?: string;
    riderId?: string;
  }): Promise<any> {
    const response = await fetch(`${API_BASE}/${escrowId}/delivery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to start delivery');
    return response.json();
  },

  /**
   * Confirm delivery
   */
  async confirmDelivery(escrowId: string): Promise<any> {
    const response = await fetch(`${API_BASE}/${escrowId}/confirm`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to confirm delivery');
    return response.json();
  },

  /**
   * Release escrow funds to seller
   */
  async releaseEscrow(escrowId: string): Promise<any> {
    const response = await fetch(`${API_BASE}/${escrowId}/release`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to release escrow');
    return response.json();
  },

  /**
   * Dispute escrow
   */
  async disputeEscrow(escrowId: string, reason: string): Promise<any> {
    const response = await fetch(`${API_BASE}/${escrowId}/dispute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    
    if (!response.ok) throw new Error('Failed to dispute escrow');
    return response.json();
  },

  /**
   * Refund escrow to buyer
   */
  async refundEscrow(escrowId: string): Promise<any> {
    const response = await fetch(`${API_BASE}/${escrowId}/refund`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to refund escrow');
    return response.json();
  },

  /**
   * Get escrow details
   */
  async getEscrow(escrowId: string): Promise<any> {
    const response = await fetch(`${API_BASE}/${escrowId}`);
    
    if (!response.ok) throw new Error('Failed to fetch escrow');
    return response.json();
  },
};

export default escrowService;
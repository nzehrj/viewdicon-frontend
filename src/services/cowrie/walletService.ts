// src/services/cowrie/walletService.ts
// Wallet Service - API Connector

const API_BASE = '/api/wallet';

/**
 * Wallet Service
 */
export const walletService = {
  /**
   * Get wallet information
   */
  async getWalletInfo(): Promise<{
    balance: number;
    tierBadge: 'bronze' | 'silver' | 'gold' | 'platinum';
    userId: string;
  }> {
    const response = await fetch(`${API_BASE}/info`);
    
    if (!response.ok) throw new Error('Failed to fetch wallet info');
    return response.json();
  },

  /**
   * Get transaction history with pagination
   */
  async getTransactionHistory(limit: number = 50, offset: number = 0): Promise<{
    transactions: any[];
    total: number;
    hasMore: boolean;
  }> {
    const response = await fetch(`${API_BASE}/transactions?limit=${limit}&offset=${offset}`);
    
    if (!response.ok) throw new Error('Failed to fetch transaction history');
    return response.json();
  },

  /**
   * Get pending transactions
   */
  async getPendingTransactions(): Promise<any[]> {
    const response = await fetch(`${API_BASE}/pending`);
    
    if (!response.ok) throw new Error('Failed to fetch pending transactions');
    return response.json();
  },

  /**
   * Export transactions as CSV
   */
  async exportTransactions(startDate: string, endDate: string): Promise<Blob> {
    const response = await fetch(`${API_BASE}/export?startDate=${startDate}&endDate=${endDate}`);
    
    if (!response.ok) throw new Error('Failed to export transactions');
    return response.blob();
  },
};

export default walletService;
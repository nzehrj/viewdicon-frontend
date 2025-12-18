// src/services/cowrie/cowrieService.ts
// Cowrie Wallet Service - API Connector

const API_BASE = '/api/cowrie';

/**
 * Cowrie Service
 */
export const cowrieService = {
  /**
   * Get current balance
   */
  async getBalance(): Promise<{ balance: number }> {
    const response = await fetch(`${API_BASE}/balance`);
    
    if (!response.ok) throw new Error('Failed to fetch balance');
    return response.json();
  },

  /**
   * Get transaction history
   */
  async getTransactions(): Promise<any[]> {
    const response = await fetch(`${API_BASE}/transactions`);
    
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  },

  /**
   * Send cowrie to another user
   */
  async sendCowrie(recipientId: string, amount: number, message?: string): Promise<any> {
    const response = await fetch(`${API_BASE}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId, amount, message }),
    });
    
    if (!response.ok) throw new Error('Failed to send cowrie');
    return response.json();
  },

  /**
   * Generate QR code for receiving cowrie
   */
  async generateQRCode(): Promise<{ qrCode: string }> {
    const response = await fetch(`${API_BASE}/qr-code`);
    
    if (!response.ok) throw new Error('Failed to generate QR code');
    return response.json();
  },

  /**
   * Get cowrie statistics
   */
  async getStats(): Promise<{
    totalEarned: number;
    totalSpent: number;
    totalTipped: number;
    totalReceived: number;
  }> {
    const response = await fetch(`${API_BASE}/stats`);
    
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },
};

export default cowrieService;
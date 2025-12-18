// src/services/events/ticketService.ts
// Ticket Service - API Connector

import { EventTicket, TicketTransfer, TicketResaleListing } from '@/types/events/ticket.types';

const API_BASE = '/api/tickets';

/**
 * Ticket Service
 */
export const ticketService = {
  /**
   * Purchase tickets
   */
  async purchaseTickets(
    eventId: string,
    tickets: Array<{ tierId: string; quantity: number }>
  ): Promise<{ tickets: EventTicket[]; transactionId: string }> {
    const response = await fetch(`${API_BASE}/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, tickets }),
    });
    
    if (!response.ok) throw new Error('Failed to purchase tickets');
    return response.json();
  },

  /**
   * Get user's tickets
   */
  async getMyTickets(userId: string): Promise<EventTicket[]> {
    const response = await fetch(`/api/users/${userId}/tickets`);
    
    if (!response.ok) throw new Error('Failed to fetch tickets');
    return response.json();
  },

  /**
   * Get single ticket by ID
   */
  async getTicket(ticketId: string): Promise<EventTicket> {
    const response = await fetch(`${API_BASE}/${ticketId}`);
    
    if (!response.ok) throw new Error('Failed to fetch ticket');
    return response.json();
  },

  /**
   * Transfer ticket to another user
   */
  async transferTicket(
    ticketId: string,
    data: { toUserId?: string; toUserEmail?: string; message?: string }
  ): Promise<TicketTransfer> {
    const response = await fetch(`${API_BASE}/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, ...data }),
    });
    
    if (!response.ok) throw new Error('Failed to transfer ticket');
    return response.json();
  },

  /**
   * Accept ticket transfer
   */
  async acceptTransfer(transferId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/transfer/${transferId}/accept`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to accept transfer');
  },

  /**
   * Decline ticket transfer
   */
  async declineTransfer(transferId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/transfer/${transferId}/decline`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to decline transfer');
  },

  /**
   * Get pending transfers
   */
  async getPendingTransfers(userId: string): Promise<TicketTransfer[]> {
    const response = await fetch(`/api/users/${userId}/pending-transfers`);
    
    if (!response.ok) throw new Error('Failed to fetch pending transfers');
    return response.json();
  },

  /**
   * List ticket for resale
   */
  async listForResale(ticketId: string, askingPrice: number): Promise<TicketResaleListing> {
    const response = await fetch(`${API_BASE}/resale`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, askingPrice }),
    });
    
    if (!response.ok) throw new Error('Failed to list ticket for resale');
    return response.json();
  },

  /**
   * Cancel resale listing
   */
  async cancelResale(listingId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/resale/${listingId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to cancel resale');
  },

  /**
   * Purchase resale ticket
   */
  async purchaseResaleTicket(listingId: string): Promise<EventTicket> {
    const response = await fetch(`${API_BASE}/resale/${listingId}/purchase`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to purchase resale ticket');
    return response.json();
  },

  /**
   * Get resale listings for event
   */
  async getResaleListings(eventId: string): Promise<TicketResaleListing[]> {
    const response = await fetch(`/api/events/${eventId}/resale`);
    
    if (!response.ok) throw new Error('Failed to fetch resale listings');
    return response.json();
  },

  /**
   * Validate ticket (for event staff)
   */
  async validateTicket(data: {
    ticketId?: string;
    qrCode?: string;
    auraBeaconId?: string;
  }): Promise<{ valid: boolean; ticket?: EventTicket; message?: string }> {
    const response = await fetch(`${API_BASE}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to validate ticket');
    return response.json();
  },
};

export default ticketService;
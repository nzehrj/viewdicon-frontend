// src/services/events/auraService.ts
// AURA Beacon Service - API Connector

const API_BASE = '/api/aura';

/**
 * AURA Service
 */
export const auraService = {
  /**
   * Get AURA beacon details
   */
  async getBeacon(beaconId: string): Promise<any> {
    const response = await fetch(`${API_BASE}/beacons/${beaconId}`);
    
    if (!response.ok) throw new Error('Failed to fetch beacon');
    return response.json();
  },

  /**
   * Activate AURA beacon for event
   */
  async activateBeacon(eventId: string, location: string): Promise<{ beaconId: string }> {
    const response = await fetch(`${API_BASE}/beacons/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId, location }),
    });
    
    if (!response.ok) throw new Error('Failed to activate beacon');
    return response.json();
  },

  /**
   * Deactivate AURA beacon
   */
  async deactivateBeacon(beaconId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/beacons/${beaconId}/deactivate`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to deactivate beacon');
  },

  /**
   * Check in to event using AURA
   */
  async checkIn(
    ticketId: string,
    data: { beaconId?: string; location: string }
  ): Promise<{ success: boolean; checkedInAt: string }> {
    const response = await fetch(`/api/tickets/checkin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, ...data }),
    });
    
    if (!response.ok) throw new Error('Failed to check in');
    return response.json();
  },

  /**
   * Get check-in records for event
   */
  async getCheckInRecords(eventId: string): Promise<any[]> {
    const response = await fetch(`/api/events/${eventId}/checkins`);
    
    if (!response.ok) throw new Error('Failed to fetch check-in records');
    return response.json();
  },

  /**
   * Verify ticket at entry point
   */
  async verifyTicket(ticketId: string): Promise<{
    valid: boolean;
    ticket: any;
    alreadyCheckedIn: boolean;
  }> {
    const response = await fetch(`${API_BASE}/verify/${ticketId}`);
    
    if (!response.ok) throw new Error('Failed to verify ticket');
    return response.json();
  },
};

export default auraService;
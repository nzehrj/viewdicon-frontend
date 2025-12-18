// src/services/tv/schedulerService.ts
// TV Scheduler Service - API Connector

import { TVProgram } from '@/types/tv/tv.types';

const API_BASE = '/api/tv';

/**
 * Scheduler Service
 */
export const schedulerService = {
  /**
   * Get channel schedule
   */
  async getSchedule(channelId: string, date?: Date): Promise<TVProgram[]> {
    const dateParam = date ? `?date=${date.toISOString()}` : '';
    const response = await fetch(`${API_BASE}/channels/${channelId}/schedule${dateParam}`);
    
    if (!response.ok) throw new Error('Failed to fetch schedule');
    return response.json();
  },

  /**
   * Get current program
   */
  async getCurrentProgram(channelId: string): Promise<TVProgram | null> {
    const response = await fetch(`${API_BASE}/channels/${channelId}/current`);
    
    if (!response.ok) throw new Error('Failed to fetch current program');
    return response.json();
  },

  /**
   * Get upcoming programs
   */
  async getUpcomingPrograms(channelId: string): Promise<TVProgram[]> {
    const response = await fetch(`${API_BASE}/channels/${channelId}/upcoming`);
    
    if (!response.ok) throw new Error('Failed to fetch upcoming programs');
    return response.json();
  },

  /**
   * Get village hour slot (daily 17:00-19:00)
   */
  async getVillageHourSlot(villageId: string): Promise<any> {
    const response = await fetch(`${API_BASE}/village-hours/${villageId}`);
    
    if (!response.ok) throw new Error('Failed to fetch village hour');
    return response.json();
  },

  /**
   * Book TV slot
   */
  async bookSlot(channelId: string, data: {
    title: string;
    description: string;
    requestedDate: Date;
    requestedTimeSlot: { start: string; end: string };
    duration: number;
  }): Promise<any> {
    const response = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId, ...data }),
    });
    
    if (!response.ok) throw new Error('Failed to book TV slot');
    return response.json();
  },

  /**
   * Get user's bookings
   */
  async getMyBookings(userId: string): Promise<any[]> {
    const response = await fetch(`/api/users/${userId}/tv-bookings`);
    
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  },
};

export default schedulerService;
// src/services/events/eventService.ts
// Event Service - API Connector

import { Event, EventFilters, EventSchedule, EventShowcase, EventAttendee } from '@/types/events/event.types';

const API_BASE = '/api/events';

/**
 * Event Service
 */
export const eventService = {
  /**
   * Get events list with filters
   */
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters }),
    });
    
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  /**
   * Get single event by ID
   */
  async getEvent(eventId: string): Promise<Event> {
    const response = await fetch(`${API_BASE}/${eventId}`);
    
    if (!response.ok) throw new Error('Failed to fetch event');
    return response.json();
  },

  /**
   * Create new event
   */
  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    
    if (!response.ok) throw new Error('Failed to create event');
    return response.json();
  },

  /**
   * Update event
   */
  async updateEvent(eventId: string, data: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_BASE}/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to update event');
    return response.json();
  },

  /**
   * Delete event
   */
  async deleteEvent(eventId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${eventId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete event');
  },

  /**
   * Get event schedule
   */
  async getSchedule(eventId: string): Promise<EventSchedule> {
    const response = await fetch(`${API_BASE}/${eventId}/schedule`);
    
    if (!response.ok) throw new Error('Failed to fetch event schedule');
    return response.json();
  },

  /**
   * Get event showcases (exhibitor booths)
   */
  async getShowcases(eventId: string): Promise<EventShowcase[]> {
    const response = await fetch(`${API_BASE}/${eventId}/showcase`);
    
    if (!response.ok) throw new Error('Failed to fetch showcases');
    return response.json();
  },

  /**
   * Visit booth (track engagement)
   */
  async visitBooth(showcaseId: string): Promise<void> {
    const response = await fetch(`/api/showcase/${showcaseId}/visit`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to visit booth');
  },

  /**
   * Get event attendees
   */
  async getAttendees(eventId: string): Promise<EventAttendee[]> {
    const response = await fetch(`${API_BASE}/${eventId}/attendees`);
    
    if (!response.ok) throw new Error('Failed to fetch attendees');
    return response.json();
  },

  /**
   * Get event streaming info
   */
  async getStreamingInfo(eventId: string): Promise<{
    streamUrl: string;
    isLive: boolean;
    viewerCount: number;
  }> {
    const response = await fetch(`${API_BASE}/${eventId}/streaming`);
    
    if (!response.ok) throw new Error('Failed to fetch streaming info');
    return response.json();
  },

  /**
   * Get user's events (as organizer)
   */
  async getMyEvents(userId: string): Promise<Event[]> {
    const response = await fetch(`/api/users/${userId}/events`);
    
    if (!response.ok) throw new Error('Failed to fetch user events');
    return response.json();
  },
};

export default eventService;
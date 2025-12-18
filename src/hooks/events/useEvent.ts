// src/hooks/events/useEvent.ts
// Event System Hook

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Event, 
  EventFilters,
  EventSchedule,
  EventShowcase,
  EventAttendee,
} from '@/types/events/event.types';

/**
 * Event hook
 */
export const useEvent = (eventId?: string) => {
  const queryClient = useQueryClient();
  
  const { data: event, isLoading } = useQuery<Event>({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) throw new Error('No event ID');
      
      const response = await fetch(`/api/events/${eventId}`);
      
      if (!response.ok) throw new Error('Failed to fetch event');
      
      return response.json();
    },
    enabled: !!eventId,
  });
  
  const updateEvent = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Event> }) => {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update event');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event'] });
    },
  });
  
  return {
    event,
    isLoading,
    updateEvent: updateEvent.mutate,
    isUpdating: updateEvent.isPending,
  };
};

/**
 * Events list hook
 */
export const useEvents = (filters?: EventFilters) => {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['events', filters],
    queryFn: async () => {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters }),
      });
      
      if (!response.ok) throw new Error('Failed to fetch events');
      
      return response.json();
    },
    staleTime: 30000,
  });
  
  return {
    events: events || [],
    isLoading,
  };
};

/**
 * Event schedule hook
 */
export const useEventSchedule = (eventId: string) => {
  const { data: schedule, isLoading } = useQuery<EventSchedule>({
    queryKey: ['event-schedule', eventId],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}/schedule`);
      
      if (!response.ok) throw new Error('Failed to fetch event schedule');
      
      return response.json();
    },
  });
  
  return {
    schedule,
    sessions: schedule?.sessions || [],
    isLoading,
  };
};

/**
 * Event showcase hook (exhibitor booths)
 */
export const useEventShowcase = (eventId: string) => {
  const queryClient = useQueryClient();
  
  const { data: showcases, isLoading } = useQuery<EventShowcase[]>({
    queryKey: ['event-showcase', eventId],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}/showcase`);
      
      if (!response.ok) throw new Error('Failed to fetch showcases');
      
      return response.json();
    },
  });
  
  const visitBooth = useMutation({
    mutationFn: async (showcaseId: string) => {
      const response = await fetch(`/api/showcase/${showcaseId}/visit`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to visit booth');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-showcase'] });
    },
  });
  
  return {
    showcases: showcases || [],
    isLoading,
    visitBooth: visitBooth.mutate,
    isVisiting: visitBooth.isPending,
  };
};

/**
 * Event attendance hook
 */
export const useEventAttendance = (eventId: string) => {
  const { data: attendees, isLoading } = useQuery<EventAttendee[]>({
    queryKey: ['event-attendance', eventId],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}/attendees`);
      
      if (!response.ok) throw new Error('Failed to fetch attendees');
      
      return response.json();
    },
    refetchInterval: 10000, // Update every 10 seconds during event
  });
  
  return {
    attendees: attendees || [],
    attendeeCount: attendees?.length || 0,
    checkedInCount: attendees?.filter((a) => a.checkedIn).length || 0,
    isLoading,
  };
};

/**
 * Create event hook
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  const createEvent = useMutation({
    mutationFn: async (eventData: Partial<Event>) => {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) throw new Error('Failed to create event');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
  
  return {
    createEvent: createEvent.mutate,
    isCreating: createEvent.isPending,
  };
};

/**
 * Event streaming hook
 */
export const useEventStreaming = (eventId: string) => {
  const { data: streamInfo, isLoading } = useQuery({
    queryKey: ['event-streaming', eventId],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}/streaming`);
      
      if (!response.ok) throw new Error('Failed to fetch streaming info');
      
      return response.json();
    },
  });
  
  return {
    streamUrl: streamInfo?.streamUrl,
    isLive: streamInfo?.isLive || false,
    viewerCount: streamInfo?.viewerCount || 0,
    isLoading,
  };
};

/**
 * My events hook (organizer)
 */
export const useMyEvents = (userId: string) => {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['my-events', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/events`);
      
      if (!response.ok) throw new Error('Failed to fetch user events');
      
      return response.json();
    },
  });
  
  return {
    events: events || [],
    upcomingEvents: events?.filter((e) => new Date(e.startDate) > new Date()) || [],
    pastEvents: events?.filter((e) => new Date(e.endDate) < new Date()) || [],
    isLoading,
  };
};
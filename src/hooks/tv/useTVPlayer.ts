// src/hooks/tv/useTVPlayer.ts
// Jollof TV Player Hook

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  TVChannel, 
  TVProgram,
  TVMode,
  TVPlayerState,
  StreamQuality,
} from '@/types/tv/tv.types';

/**
 * TV player hook
 */
export const useTVPlayer = (channelId?: string) => {
  const [playerState, setPlayerState] = useState<TVPlayerState>({
    channelId: channelId || '',
    mode: 'bubble',
    position: { x: 20, y: 80, width: 200, height: 150 },
    isPlaying: false,
    isMuted: false,
    volume: 80,
    quality: 'auto',
    isPiP: false,
    viewerCount: 0,
    heat: 0,
    sorosokeActive: false,
  });
  
  const changeChannel = useCallback((newChannelId: string) => {
    setPlayerState(prev => ({ ...prev, channelId: newChannelId }));
  }, []);
  
  const togglePlay = useCallback(() => {
    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);
  
  const toggleMute = useCallback(() => {
    setPlayerState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);
  
  const setVolume = useCallback((volume: number) => {
    setPlayerState(prev => ({ ...prev, volume: Math.max(0, Math.min(100, volume)) }));
  }, []);
  
  const setQuality = useCallback((quality: StreamQuality) => {
    setPlayerState(prev => ({ ...prev, quality }));
  }, []);
  
  return {
    playerState,
    changeChannel,
    togglePlay,
    toggleMute,
    setVolume,
    setQuality,
  };
};

/**
 * TV mode hook (Bubble, Half, Float, PiP)
 */
export const useTVMode = () => {
  const [mode, setMode] = useState<TVMode>('bubble');
  const [position, setPosition] = useState({ x: 20, y: 80, width: 200, height: 150 });
  
  const changeMode = useCallback((newMode: TVMode) => {
    setMode(newMode);
    
    // Adjust position based on mode
    switch (newMode) {
      case 'bubble':
        setPosition({ x: 20, y: 80, width: 200, height: 150 });
        break;
      case 'half-screen':
        setPosition({ x: 0, y: 50, width: 50, height: 50 });
        break;
      case 'floating':
        setPosition({ x: 70, y: 70, width: 25, height: 25 });
        break;
      case 'fullscreen':
        setPosition({ x: 0, y: 0, width: 100, height: 100 });
        break;
    }
  }, []);
  
  const updatePosition = useCallback((newPosition: Partial<typeof position>) => {
    setPosition(prev => ({ ...prev, ...newPosition }));
  }, []);
  
  return {
    mode,
    position,
    changeMode,
    updatePosition,
  };
};

/**
 * TV channel hook
 */
export const useTVChannel = (channelId?: string) => {
  const { data: channel, isLoading } = useQuery<TVChannel>({
    queryKey: ['tv-channel', channelId],
    queryFn: async () => {
      if (!channelId) throw new Error('No channel ID');
      
      const response = await fetch(`/api/tv/channels/${channelId}`);
      
      if (!response.ok) throw new Error('Failed to fetch channel');
      
      return response.json();
    },
    enabled: !!channelId,
    refetchInterval: 30000, // Update every 30 seconds
  });
  
  return {
    channel,
    isLoading,
  };
};

/**
 * TV channels list hook
 */
export const useTVChannels = () => {
  const { data: channels, isLoading } = useQuery<TVChannel[]>({
    queryKey: ['tv-channels'],
    queryFn: async () => {
      const response = await fetch('/api/tv/channels');
      
      if (!response.ok) throw new Error('Failed to fetch channels');
      
      return response.json();
    },
  });
  
  return {
    channels: channels || [],
    isLoading,
  };
};

/**
 * TV schedule hook (program guide)
 */
export const useTVSchedule = (channelId: string, date?: Date) => {
  const { data: schedule, isLoading } = useQuery<TVProgram[]>({
    queryKey: ['tv-schedule', channelId, date],
    queryFn: async () => {
      const dateParam = date ? `?date=${date.toISOString()}` : '';
      const response = await fetch(`/api/tv/channels/${channelId}/schedule${dateParam}`);
      
      if (!response.ok) throw new Error('Failed to fetch schedule');
      
      return response.json();
    },
  });
  
  return {
    schedule: schedule || [],
    currentProgram: schedule?.find(p => p.status === 'live'),
    upcomingPrograms: schedule?.filter(p => p.status === 'scheduled') || [],
    isLoading,
  };
};

/**
 * Village hour hook
 */
export const useVillageHour = (villageId: string) => {
  const { data: villageHourSlot, isLoading } = useQuery({
    queryKey: ['village-hour', villageId],
    queryFn: async () => {
      const response = await fetch(`/api/tv/village-hours/${villageId}`);
      
      if (!response.ok) throw new Error('Failed to fetch village hour');
      
      return response.json();
    },
  });
  
  return {
    villageHourSlot,
    isActive: villageHourSlot?.active || false,
    currentProgram: villageHourSlot?.programTitle,
    isLoading,
  };
};

/**
 * TV booking hook
 */
export const useTVBooking = () => {
  const queryClient = useQueryClient();
  
  const bookSlot = useMutation({
    mutationFn: async (data: {
      channelId: string;
      title: string;
      description: string;
      requestedDate: Date;
      requestedTimeSlot: { start: string; end: string };
      duration: number;
    }) => {
      const response = await fetch('/api/tv/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to book TV slot');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tv-schedule'] });
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
    },
  });
  
  return {
    bookSlot: bookSlot.mutate,
    isBooking: bookSlot.isPending,
  };
};

/**
 * User's TV bookings hook
 */
export const useMyTVBookings = (userId: string) => {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/tv-bookings`);
      
      if (!response.ok) throw new Error('Failed to fetch bookings');
      
      return response.json();
    },
  });
  
  return {
    bookings: bookings || [],
    pendingBookings: bookings?.filter((b: any) => b.status === 'pending') || [],
    approvedBookings: bookings?.filter((b: any) => b.status === 'approved') || [],
    isLoading,
  };
};

/**
 * TV viewer session hook (analytics)
 */
export const useTVViewerSession = (channelId: string) => {
  useEffect(() => {
    // Start viewing session
    const startSession = async () => {
      await fetch('/api/tv/sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId }),
      });
    };
    
    startSession();
    
    // End viewing session on unmount
    return () => {
      fetch('/api/tv/sessions/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelId }),
      });
    };
  }, [channelId]);
  
  return {};
};

/**
 * Cowrie rain hook
 */
export const useCowrieRain = () => {
  const [isRaining, setIsRaining] = useState(false);
  const [rainAmount, setRainAmount] = useState(0);
  
  const triggerRain = useCallback((amount: number) => {
    setIsRaining(true);
    setRainAmount(amount);
    
    setTimeout(() => {
      setIsRaining(false);
    }, 5000); // Rain for 5 seconds
  }, []);
  
  return {
    isRaining,
    rainAmount,
    triggerRain,
  };
};
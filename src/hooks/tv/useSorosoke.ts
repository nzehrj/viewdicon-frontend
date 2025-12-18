// src/hooks/tv/useSorosoke.ts
// Sorosoke (Call-In System) Hook

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  SorosokeSession, 
  SorosokeCall,
  SorosokeBundle,
} from '@/types/tv/sorosoke.types';

/**
 * Sorosoke session hook
 */
export const useSorosoke = (sessionId?: string) => {
  const { data: session, isLoading } = useQuery<SorosokeSession>({
    queryKey: ['sorosoke-session', sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error('No session ID');
      
      const response = await fetch(`/api/sorosoke/sessions/${sessionId}`);
      
      if (!response.ok) throw new Error('Failed to fetch session');
      
      return response.json();
    },
    enabled: !!sessionId,
    refetchInterval: 2000, // Poll every 2 seconds for live updates
  });
  
  return {
    session,
    isActive: session?.active || false,
    callQueue: session?.callQueue || [],
    liveCallers: session?.liveCallers || [],
    queueLength: session?.callQueue?.length || 0,
    isLoading,
  };
};

/**
 * Call queue hook
 */
export const useCallQueue = (sessionId: string) => {
  const queryClient = useQueryClient();
  
  const joinQueue = useMutation({
    mutationFn: async (data: {
      type: 'voice' | 'video' | 'text';
      question?: string;
    }) => {
      const response = await fetch(`/api/sorosoke/sessions/${sessionId}/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to join queue');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sorosoke-session'] });
      queryClient.invalidateQueries({ queryKey: ['my-calls'] });
    },
  });
  
  const leaveQueue = useMutation({
    mutationFn: async (callId: string) => {
      const response = await fetch(`/api/sorosoke/calls/${callId}/leave`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to leave queue');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sorosoke-session'] });
      queryClient.invalidateQueries({ queryKey: ['my-calls'] });
    },
  });
  
  return {
    joinQueue: joinQueue.mutate,
    leaveQueue: leaveQueue.mutate,
    isJoining: joinQueue.isPending,
    isLeaving: leaveQueue.isPending,
  };
};

/**
 * User's active call hook
 */
export const useMyCall = (userId: string, sessionId: string) => {
  const { data: call, isLoading } = useQuery<SorosokeCall | null>({
    queryKey: ['my-call', userId, sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/sorosoke/sessions/${sessionId}/my-call`);
      
      if (!response.ok) return null;
      
      return response.json();
    },
    refetchInterval: 1000, // Poll every second
  });
  
  return {
    call,
    isInQueue: call?.status === 'queued',
    isLive: call?.status === 'live',
    queuePosition: call?.queuePosition,
    estimatedWaitTime: call ? (call.queuePosition * 120) : 0, // 2 mins per caller estimate
    isLoading,
  };
};

/**
 * Sorosoke bundle hook (pre-purchased call slots)
 */
export const useSorosokeBundle = (userId: string) => {
  const queryClient = useQueryClient();
  
  const { data: bundles, isLoading } = useQuery<SorosokeBundle[]>({
    queryKey: ['sorosoke-bundles', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/sorosoke-bundles`);
      
      if (!response.ok) throw new Error('Failed to fetch bundles');
      
      return response.json();
    },
  });
  
  const purchaseBundle = useMutation({
    mutationFn: async (data: {
      bundleType: 'single' | '5-pack' | '10-pack' | '20-pack';
    }) => {
      const response = await fetch('/api/sorosoke/bundles/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to purchase bundle');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sorosoke-bundles'] });
    },
  });
  
  return {
    bundles: bundles || [],
    totalCallsRemaining: bundles?.reduce((sum, b) => sum + b.callsRemaining, 0) || 0,
    purchaseBundle: purchaseBundle.mutate,
    isPurchasing: purchaseBundle.isPending,
    isLoading,
  };
};

/**
 * Moderator controls hook (for hosts)
 */
export const useModeratorControls = (sessionId: string) => {
  const queryClient = useQueryClient();
  
  const approveCall = useMutation({
    mutationFn: async (callId: string) => {
      const response = await fetch(`/api/sorosoke/calls/${callId}/approve`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to approve call');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sorosoke-session', sessionId] });
    },
  });
  
  const rejectCall = useMutation({
    mutationFn: async ({ callId, reason }: { callId: string; reason: string }) => {
      const response = await fetch(`/api/sorosoke/calls/${callId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) throw new Error('Failed to reject call');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sorosoke-session', sessionId] });
    },
  });
  
  const muteCall = useMutation({
    mutationFn: async (callId: string) => {
      const response = await fetch(`/api/sorosoke/calls/${callId}/mute`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to mute call');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sorosoke-session', sessionId] });
    },
  });
  
  const kickCall = useMutation({
    mutationFn: async (callId: string) => {
      const response = await fetch(`/api/sorosoke/calls/${callId}/kick`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to kick call');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sorosoke-session', sessionId] });
    },
  });
  
  const endCall = useMutation({
    mutationFn: async (callId: string) => {
      const response = await fetch(`/api/sorosoke/calls/${callId}/end`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to end call');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sorosoke-session', sessionId] });
    },
  });
  
  return {
    approveCall: approveCall.mutate,
    rejectCall: rejectCall.mutate,
    muteCall: muteCall.mutate,
    kickCall: kickCall.mutate,
    endCall: endCall.mutate,
    isApproving: approveCall.isPending,
    isRejecting: rejectCall.isPending,
    isMuting: muteCall.isPending,
    isKicking: kickCall.isPending,
    isEnding: endCall.isPending,
  };
};

/**
 * Respect filter hook (content moderation)
 */
export const useRespectFilter = (sessionId: string) => {
  const queryClient = useQueryClient();
  
  const { data: filter, isLoading } = useQuery({
    queryKey: ['respect-filter', sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/sorosoke/sessions/${sessionId}/respect-filter`);
      
      if (!response.ok) throw new Error('Failed to fetch respect filter');
      
      return response.json();
    },
  });
  
  const updateFilter = useMutation({
    mutationFn: async (data: {
      enabled: boolean;
      strictness: 'low' | 'medium' | 'high';
      autoMute: boolean;
      autoKick: boolean;
    }) => {
      const response = await fetch(`/api/sorosoke/sessions/${sessionId}/respect-filter`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update filter');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['respect-filter', sessionId] });
    },
  });
  
  return {
    filter,
    isLoading,
    updateFilter: updateFilter.mutate,
    isUpdating: updateFilter.isPending,
  };
};

/**
 * DJ telemetry hook (live metrics dashboard)
 */
export const useDJTelemetry = (sessionId: string) => {
  const { data: telemetry, isLoading } = useQuery({
    queryKey: ['dj-telemetry', sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/sorosoke/sessions/${sessionId}/telemetry`);
      
      if (!response.ok) throw new Error('Failed to fetch telemetry');
      
      return response.json();
    },
    refetchInterval: 1000, // Update every second
  });
  
  return {
    viewerCount: telemetry?.viewerCount || 0,
    peakViewers: telemetry?.peakViewers || 0,
    queueLength: telemetry?.queueLength || 0,
    averageWaitTime: telemetry?.averageWaitTime || 0,
    totalCallsToday: telemetry?.totalCallsToday || 0,
    avgCallDuration: telemetry?.avgCallDuration || 0,
    totalHeat: telemetry?.totalHeat || 0,
    totalCowrie: telemetry?.totalCowrie || 0,
    isLoading,
  };
};

/**
 * Sorosoke analytics hook
 */
export const useSorosokeAnalytics = (sessionId: string) => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['sorosoke-analytics', sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/sorosoke/sessions/${sessionId}/analytics`);
      
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      return response.json();
    },
  });
  
  return {
    analytics,
    isLoading,
  };
};
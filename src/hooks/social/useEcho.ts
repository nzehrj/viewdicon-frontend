// src/hooks/social/useEcho.ts
// Echo System Hook

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EchoChain } from '@/types/social/pot.types';

/**
 * Echo hook - reshare functionality
 */
export const useEcho = () => {
  const queryClient = useQueryClient();
  
  const createEcho = useMutation({
    mutationFn: async ({ 
      originalPotId, 
      message 
    }: { 
      originalPotId: string; 
      message?: string;
    }) => {
      const response = await fetch('/api/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalPotId, message }),
      });
      
      if (!response.ok) throw new Error('Failed to create echo');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['echo-chain'] });
      queryClient.invalidateQueries({ queryKey: ['pot'] });
    },
  });
  
  return {
    createEcho: createEcho.mutate,
    isEchoing: createEcho.isPending,
  };
};

/**
 * Echo chain hook - tracks reshare lineage
 */
export const useEchoChain = (originalPotId: string) => {
  const { data: chain, isLoading } = useQuery<EchoChain>({
    queryKey: ['echo-chain', originalPotId],
    queryFn: async () => {
      const response = await fetch(`/api/echo/chain/${originalPotId}`);
      
      if (!response.ok) throw new Error('Failed to fetch echo chain');
      
      return response.json();
    },
    refetchInterval: 10000, // Update every 10 seconds
  });
  
  return {
    chain,
    echoPots: chain?.echoPots || [],
    totalReach: chain?.totalReach || 0,
    echoCount: chain?.echoPots?.length || 0,
    isLoading,
  };
};

/**
 * Amplifier rewards hook - earnings from echoes
 */
export const useAmplifierRewards = (userId: string) => {
  const { data: rewards, isLoading } = useQuery({
    queryKey: ['amplifier-rewards', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/amplifier-rewards`);
      
      if (!response.ok) throw new Error('Failed to fetch amplifier rewards');
      
      return response.json();
    },
  });
  
  return {
    totalRewards: rewards?.totalRewards || 0,
    activeEchoes: rewards?.activeEchoes || [],
    rewardsByPot: rewards?.rewardsByPot || {},
    isLoading,
  };
};

/**
 * Echo analytics hook
 */
export const useEchoAnalytics = (potId: string) => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['echo-analytics', potId],
    queryFn: async () => {
      const response = await fetch(`/api/pots/${potId}/echo/analytics`);
      
      if (!response.ok) throw new Error('Failed to fetch echo analytics');
      
      return response.json();
    },
  });
  
  return {
    totalEchoes: analytics?.totalEchoes || 0,
    uniqueAmplifiers: analytics?.uniqueAmplifiers || 0,
    viralScore: analytics?.viralScore || 0,
    reachMultiplier: analytics?.reachMultiplier || 1,
    topAmplifiers: analytics?.topAmplifiers || [],
    geographicSpread: analytics?.geographicSpread || [],
    isLoading,
  };
};

/**
 * User's echo feed hook (posts they've echoed)
 */
export const useMyEchoes = (userId: string) => {
  const { data: echoes, isLoading } = useQuery({
    queryKey: ['my-echoes', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/echoes`);
      
      if (!response.ok) throw new Error('Failed to fetch user echoes');
      
      return response.json();
    },
  });
  
  return {
    echoes: echoes || [],
    isLoading,
  };
};

/**
 * Echo notifications hook
 */
export const useEchoNotifications = (userId: string) => {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['echo-notifications', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/echo-notifications`);
      
      if (!response.ok) throw new Error('Failed to fetch echo notifications');
      
      return response.json();
    },
    refetchInterval: 30000, // Check every 30 seconds
  });
  
  return {
    notifications: notifications || [],
    unreadCount: notifications?.filter((n: any) => !n.read).length || 0,
    isLoading,
  };
};

/**
 * Echo performance hook (for content creators)
 */
export const useEchoPerformance = (userId: string, timeRange: '24h' | '7d' | '30d' = '7d') => {
  const { data: performance, isLoading } = useQuery({
    queryKey: ['echo-performance', userId, timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/echo-performance?range=${timeRange}`);
      
      if (!response.ok) throw new Error('Failed to fetch echo performance');
      
      return response.json();
    },
  });
  
  return {
    totalEchoes: performance?.totalEchoes || 0,
    totalReach: performance?.totalReach || 0,
    avgEchoesPerPost: performance?.avgEchoesPerPost || 0,
    viralPosts: performance?.viralPosts || [],
    echoGrowthRate: performance?.echoGrowthRate || 0,
    isLoading,
  };
};

/**
 * Delete echo hook
 */
export const useDeleteEcho = () => {
  const queryClient = useQueryClient();
  
  const deleteEcho = useMutation({
    mutationFn: async (echoId: string) => {
      const response = await fetch(`/api/echo/${echoId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete echo');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-echoes'] });
      queryClient.invalidateQueries({ queryKey: ['echo-chain'] });
    },
  });
  
  return {
    deleteEcho: deleteEcho.mutate,
    isDeleting: deleteEcho.isPending,
  };
};
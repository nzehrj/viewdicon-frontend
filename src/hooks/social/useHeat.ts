// src/hooks/social/useHeat.ts
// Heat System Hook

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getHeatLevel, 
  shouldLiftToDiscovery,
  getLiftScope,
  getHeatColor,
  getHeatProgress,
} from '@/utils/social/heatCalculator';
import { LiftScope } from '@/types/social/pot.types';

/**
 * Heat calculation hook
 */
export const useHeat = (potId: string) => {
  const { data: heatData, isLoading } = useQuery({
    queryKey: ['heat', potId],
    queryFn: async () => {
      const response = await fetch(`/api/pots/${potId}/heat`);
      
      if (!response.ok) throw new Error('Failed to fetch heat');
      
      return response.json();
    },
    refetchInterval: 3000, // Update every 3 seconds
  });
  
  const heat = heatData?.finalHeat || 0;
  const heatLevel = getHeatLevel(heat);
  const heatColor = getHeatColor(heat);
  const shouldLift = shouldLiftToDiscovery(heat);
  const liftScope = getLiftScope(heat);
  const progress = getHeatProgress(heat);
  
  return {
    heat,
    heatLevel,
    heatColor,
    shouldLift,
    liftScope,
    progress,
    baseHeat: heatData?.baseHeat || 0,
    multipliedHeat: heatData?.multipliedHeat || 0,
    diversityBoost: heatData?.diversityBoost || 0,
    isLoading,
  };
};

/**
 * Heat animation hook
 */
export const useHeatAnimation = (heat: number) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevHeat, setPrevHeat] = useState(heat);
  
  useEffect(() => {
    if (heat !== prevHeat) {
      setIsAnimating(true);
      setPrevHeat(heat);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Animation duration
      
      return () => clearTimeout(timer);
    }
  }, [heat, prevHeat]);
  
  return {
    isAnimating,
    heatDelta: heat - prevHeat,
    isIncreasing: heat > prevHeat,
  };
};

/**
 * Lift status hook
 */
export const useLiftStatus = (potId: string) => {
  const { data: liftStatus, isLoading } = useQuery({
    queryKey: ['lift-status', potId],
    queryFn: async () => {
      const response = await fetch(`/api/pots/${potId}/lift-status`);
      
      if (!response.ok) throw new Error('Failed to fetch lift status');
      
      return response.json();
    },
  });
  
  return {
    currentScope: liftStatus?.currentScope as LiftScope | null,
    isLifted: liftStatus?.isLifted || false,
    liftedAt: liftStatus?.liftedAt ? new Date(liftStatus.liftedAt) : null,
    canLiftToNext: liftStatus?.canLiftToNext || false,
    nextScope: liftStatus?.nextScope as LiftScope | null,
    blockers: liftStatus?.blockers || [],
    isLoading,
  };
};

/**
 * Heat leaderboard hook
 */
export const useHeatLeaderboard = (scope: 'local' | 'regional' | 'national' | 'global' = 'local') => {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['heat-leaderboard', scope],
    queryFn: async () => {
      const response = await fetch(`/api/heat/leaderboard?scope=${scope}`);
      
      if (!response.ok) throw new Error('Failed to fetch heat leaderboard');
      
      return response.json();
    },
    refetchInterval: 30000, // Update every 30 seconds
  });
  
  return {
    leaderboard: leaderboard || [],
    isLoading,
  };
};

/**
 * Heat history hook (for charts/graphs)
 */
export const useHeatHistory = (potId: string, timeRange: '24h' | '7d' | '30d' = '24h') => {
  const { data: history, isLoading } = useQuery({
    queryKey: ['heat-history', potId, timeRange],
    queryFn: async () => {
      const response = await fetch(`/api/pots/${potId}/heat/history?range=${timeRange}`);
      
      if (!response.ok) throw new Error('Failed to fetch heat history');
      
      return response.json();
    },
  });
  
  return {
    history: history || [],
    isLoading,
  };
};

/**
 * Heat contributors hook (top actors)
 */
export const useHeatContributors = (potId: string) => {
  const { data: contributors, isLoading } = useQuery({
    queryKey: ['heat-contributors', potId],
    queryFn: async () => {
      const response = await fetch(`/api/pots/${potId}/heat/contributors`);
      
      if (!response.ok) throw new Error('Failed to fetch heat contributors');
      
      return response.json();
    },
  });
  
  return {
    contributors: contributors || [],
    isLoading,
  };
};

/**
 * Heat milestones hook (achievements)
 */
export const useHeatMilestones = (potId: string) => {
  const { data: milestones, isLoading } = useQuery({
    queryKey: ['heat-milestones', potId],
    queryFn: async () => {
      const response = await fetch(`/api/pots/${potId}/heat/milestones`);
      
      if (!response.ok) throw new Error('Failed to fetch heat milestones');
      
      return response.json();
    },
  });
  
  return {
    milestones: milestones || [],
    isLoading,
  };
};

/**
 * Real-time heat updates hook (WebSocket)
 */
export const useRealtimeHeat = (potId: string) => {
  const [realtimeHeat, setRealtimeHeat] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // TODO: Replace with actual WebSocket implementation
    const ws = new WebSocket(`wss://api.viewdicon.com/heat/${potId}`);
    
    ws.onopen = () => {
      setIsConnected(true);
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRealtimeHeat(data.heat);
    };
    
    ws.onerror = () => {
      setIsConnected(false);
    };
    
    ws.onclose = () => {
      setIsConnected(false);
    };
    
    return () => {
      ws.close();
    };
  }, [potId]);
  
  return {
    realtimeHeat,
    isConnected,
  };
};
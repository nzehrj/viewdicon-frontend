// src/hooks/social/usePot.ts
// POT System Hook

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pot, InteractionType, SocialVoiceInteraction } from '@/types/social/pot.types';
import { InteractionRecord } from '@/types/social/interaction.types';

/**
 * POT hook - manages pot interactions
 */
export const usePot = (potId?: string) => {
  const queryClient = useQueryClient();
  
  const { data: pot, isLoading } = useQuery<Pot>({
    queryKey: ['pot', potId],
    queryFn: async () => {
      if (!potId) throw new Error('No pot ID');
      
      const response = await fetch(`/api/pots/${potId}`);
      
      if (!response.ok) throw new Error('Failed to fetch pot');
      
      return response.json();
    },
    enabled: !!potId,
    refetchInterval: 5000, // Poll every 5 seconds for live heat updates
  });
  
  // Hear interaction (Gbọ́)
  const hear = useMutation({
    mutationFn: async (potId: string) => {
      const response = await fetch(`/api/pots/${potId}/hear`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to hear');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pot'] });
    },
  });
  
  // Speak interaction (Sọrọ)
  const speak = useMutation({
    mutationFn: async ({ potId, message, voiceUrl }: { 
      potId: string; 
      message?: string; 
      voiceUrl?: string;
    }) => {
      const response = await fetch(`/api/pots/${potId}/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, voiceUrl }),
      });
      
      if (!response.ok) throw new Error('Failed to speak');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pot'] });
    },
  });
  
  // Bless interaction (ÌBÙKÚN)
  const bless = useMutation({
    mutationFn: async ({ potId, message }: { potId: string; message?: string }) => {
      const response = await fetch(`/api/pots/${potId}/bless`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) throw new Error('Failed to bless');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pot'] });
    },
  });
  
  // Cowrie Drop (Kọ́wọ́)
  const dropCowrie = useMutation({
    mutationFn: async ({ potId, amount, message }: { 
      potId: string; 
      amount: number; 
      message?: string;
    }) => {
      const response = await fetch(`/api/pots/${potId}/cowrie`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, message }),
      });
      
      if (!response.ok) throw new Error('Failed to drop cowrie');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pot'] });
    },
  });
  
  // Echo interaction (Tùsíkíẹ̀)
  const echo = useMutation({
    mutationFn: async ({ potId, message }: { potId: string; message?: string }) => {
      const response = await fetch(`/api/pots/${potId}/echo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) throw new Error('Failed to echo');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pot'] });
    },
  });
  
  return {
    pot,
    isLoading,
    hear: hear.mutate,
    speak: speak.mutate,
    bless: bless.mutate,
    dropCowrie: dropCowrie.mutate,
    echo: echo.mutate,
    isHearing: hear.isPending,
    isSpeaking: speak.isPending,
    isBlessing: bless.isPending,
    isDroppingCowrie: dropCowrie.isPending,
    isEchoing: echo.isPending,
  };
};

/**
 * POT interactions history hook
 */
export const usePotInteractions = (potId: string) => {
  const { data: interactions, isLoading } = useQuery<InteractionRecord[]>({
    queryKey: ['pot-interactions', potId],
    queryFn: async () => {
      const response = await fetch(`/api/pots/${potId}/interactions`);
      
      if (!response.ok) throw new Error('Failed to fetch interactions');
      
      return response.json();
    },
    refetchInterval: 3000, // Live updates
  });
  
  return {
    interactions: interactions || [],
    isLoading,
  };
};

/**
 * POT stats hook
 */
export const usePotStats = (potId: string) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['pot-stats', potId],
    queryFn: async () => {
      const response = await fetch(`/api/pots/${potId}/stats`);
      
      if (!response.ok) throw new Error('Failed to fetch pot stats');
      
      return response.json();
    },
  });
  
  return {
    stats,
    isLoading,
  };
};

/**
 * Social Voice interactions hook (Amplify, Verify, Ubuntu, etc.)
 */
export const useSocialVoiceInteractions = () => {
  const queryClient = useQueryClient();
  
  // Amplify (TUSIKIE)
  const amplify = useMutation({
    mutationFn: async (potId: string) => {
      const response = await fetch(`/api/pots/${potId}/amplify`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to amplify');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pot'] });
    },
  });
  
  // Verify (KUBALIKA)
  const verify = useMutation({
    mutationFn: async (potId: string) => {
      const response = await fetch(`/api/pots/${potId}/verify`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to verify');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pot'] });
    },
  });
  
  // Ubuntu (UBUNTU)
  const ubuntu = useMutation({
    mutationFn: async ({ potId, message }: { potId: string; message?: string }) => {
      const response = await fetch(`/api/pots/${potId}/ubuntu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) throw new Error('Failed to ubuntu');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pot'] });
    },
  });
  
  // Help (NGUVU)
  const help = useMutation({
    mutationFn: async ({ potId, message }: { potId: string; message?: string }) => {
      const response = await fetch(`/api/pots/${potId}/help`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) throw new Error('Failed to help');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pot'] });
    },
  });
  
  // Peace Flag (RO™)
  const peaceFla = useMutation({
    mutationFn: async ({ potId, reason }: { potId: string; reason: string }) => {
      const response = await fetch(`/api/pots/${potId}/peace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) throw new Error('Failed to flag peace');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pot'] });
    },
  });
  
  return {
    amplify: amplify.mutate,
    verify: verify.mutate,
    ubuntu: ubuntu.mutate,
    help: help.mutate,
    peaceFlag: peaceFla.mutate,
    isAmplifying: amplify.isPending,
    isVerifying: verify.isPending,
    isUbuntu: ubuntu.isPending,
    isHelping: help.isPending,
    isFlagging: peaceFla.isPending,
  };
};

/**
 * Interaction cooldown hook
 */
export const useInteractionCooldown = (interactionType: InteractionType | SocialVoiceInteraction) => {
  const { data: cooldown, isLoading } = useQuery<{ canInteract: boolean; remainingSeconds: number }>({
    queryKey: ['interaction-cooldown', interactionType],
    queryFn: async () => {
      const response = await fetch(`/api/interactions/cooldown/${interactionType}`);
      
      if (!response.ok) throw new Error('Failed to fetch cooldown');
      
      return response.json();
    },
    refetchInterval: 1000, // Check every second
  });
  
  return {
    canInteract: cooldown?.canInteract ?? true,
    remainingSeconds: cooldown?.remainingSeconds ?? 0,
    isLoading,
  };
};
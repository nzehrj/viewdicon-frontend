// src/hooks/feeds/useSocialVoiceFeed.ts
// Social Voice Feed Hook

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  SocialVoicePost, 
  SocialVoiceFilters,
  LiveMicroRoom,
  ThreadChain,
} from '@/types/feeds/socialVoice.types';

/**
 * Social voice feed hook
 */
export const useSocialVoiceFeed = (filters?: SocialVoiceFilters) => {
  const queryClient = useQueryClient();
  
  const {
    data: posts,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<SocialVoicePost[]>({
    queryKey: ['social-voice-feed', filters],
    queryFn: async () => {
      const response = await fetch('/api/feeds/social-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters }),
      });
      
      if (!response.ok) throw new Error('Failed to fetch social voice feed');
      
      return response.json();
    },
    staleTime: 15000, // 15 seconds for real-time feel
    refetchInterval: 30000,
  });
  
  const createPost = useMutation({
    mutationFn: async (post: Partial<SocialVoicePost>) => {
      const response = await fetch('/api/feeds/social-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      
      if (!response.ok) throw new Error('Failed to create post');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-voice-feed'] });
    },
  });
  
  const amplifyPost = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/feeds/social-voice/${postId}/amplify`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to amplify post');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-voice-feed'] });
    },
  });
  
  const verifyPost = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/feeds/social-voice/${postId}/verify`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to verify post');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-voice-feed'] });
    },
  });
  
  return {
    posts: posts || [],
    isLoading,
    isError,
    error,
    refetch,
    createPost: createPost.mutate,
    amplifyPost: amplifyPost.mutate,
    verifyPost: verifyPost.mutate,
    isCreating: createPost.isPending,
    isAmplifying: amplifyPost.isPending,
    isVerifying: verifyPost.isPending,
  };
};

/**
 * Live micro-room hook
 */
export const useLiveMicroRoom = (roomId?: string) => {
  const queryClient = useQueryClient();
  
  const { data: room, isLoading } = useQuery<LiveMicroRoom>({
    queryKey: ['live-micro-room', roomId],
    queryFn: async () => {
      if (!roomId) throw new Error('No room ID');
      
      const response = await fetch(`/api/rooms/${roomId}`);
      
      if (!response.ok) throw new Error('Failed to fetch room');
      
      return response.json();
    },
    enabled: !!roomId,
    refetchInterval: 3000, // Poll frequently for live updates
  });
  
  const joinRoom = useMutation({
    mutationFn: async ({ id, asRole }: { id: string; asRole: 'speaker' | 'listener' }) => {
      const response = await fetch(`/api/rooms/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: asRole }),
      });
      
      if (!response.ok) throw new Error('Failed to join room');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-micro-room'] });
    },
  });
  
  const leaveRoom = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/rooms/${id}/leave`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to leave room');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-micro-room'] });
    },
  });
  
  const raiseHand = useMutation({
    mutationFn: async (roomId: string) => {
      const response = await fetch(`/api/rooms/${roomId}/raise-hand`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to raise hand');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-micro-room'] });
    },
  });
  
  return {
    room,
    isLoading,
    joinRoom: joinRoom.mutate,
    leaveRoom: leaveRoom.mutate,
    raiseHand: raiseHand.mutate,
    isJoining: joinRoom.isPending,
    isLeaving: leaveRoom.isPending,
  };
};

/**
 * Thread chain hook
 */
export const useThreadChain = (threadId?: string) => {
  const { data: thread, isLoading } = useQuery<ThreadChain>({
    queryKey: ['thread-chain', threadId],
    queryFn: async () => {
      if (!threadId) throw new Error('No thread ID');
      
      const response = await fetch(`/api/threads/${threadId}`);
      
      if (!response.ok) throw new Error('Failed to fetch thread');
      
      return response.json();
    },
    enabled: !!threadId,
  });
  
  return {
    thread,
    isLoading,
  };
};

/**
 * Witness post hook
 */
export const useWitnessPost = () => {
  const queryClient = useQueryClient();
  
  const createWitnessPost = useMutation({
    mutationFn: async (data: {
      text: string;
      imageUrl?: string;
      voiceUrl?: string;
      geoLocation: { latitude: number; longitude: number };
    }) => {
      const response = await fetch('/api/feeds/social-voice/witness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create witness post');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-voice-feed'] });
    },
  });
  
  return {
    createWitnessPost: createWitnessPost.mutate,
    isCreating: createWitnessPost.isPending,
  };
};
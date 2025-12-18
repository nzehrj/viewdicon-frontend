// src/hooks/feeds/usePerformanceFeed.ts
// Performance Feed Hook

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  PerformancePost, 
  RecordingSession, 
  PerformanceFilters,
  KnowledgeBasketItem,
  LiveClassroom,
} from '@/types/feeds/performance.types';

/**
 * Performance feed hook
 */
export const usePerformanceFeed = (filters?: PerformanceFilters) => {
  const queryClient = useQueryClient();
  
  // Fetch performance posts
  const {
    data: posts,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<PerformancePost[]>({
    queryKey: ['performance-feed', filters],
    queryFn: async () => {
      // TODO: Replace with actual API call
      const response = await fetch('/api/feeds/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters }),
      });
      
      if (!response.ok) throw new Error('Failed to fetch performance feed');
      
      return response.json();
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
  });
  
  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (post: Partial<PerformancePost>) => {
      const response = await fetch('/api/feeds/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      
      if (!response.ok) throw new Error('Failed to create post');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-feed'] });
    },
  });
  
  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/feeds/performance/${postId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete post');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-feed'] });
    },
  });
  
  return {
    posts: posts || [],
    isLoading,
    isError,
    error,
    refetch,
    createPost: createPostMutation.mutate,
    deletePost: deletePostMutation.mutate,
    isCreating: createPostMutation.isPending,
    isDeleting: deletePostMutation.isPending,
  };
};

/**
 * Recording session hook
 */
export const useRecordingSession = () => {
  const [session, setSession] = useState<RecordingSession | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const startRecording = useCallback((mode: RecordingSession['mode'], entrySkin: RecordingSession['entrySkin']) => {
    const newSession: RecordingSession = {
      id: `rec_${Date.now()}`,
      userId: 'current-user-id', // TODO: Get from auth
      mode,
      entrySkin,
      status: 'recording',
      startTime: new Date(),
      duration: 0,
      audienceScope: 'village',
      trustBandVisible: true,
      safetyToggles: {
        locationVisible: true,
        timestampVisible: true,
        deviceInfoVisible: false,
        networkVisible: false,
      },
    };
    
    setSession(newSession);
    setIsRecording(true);
  }, []);
  
  const pauseRecording = useCallback(() => {
    if (!session) return;
    
    setSession({ ...session, status: 'paused' });
    setIsRecording(false);
  }, [session]);
  
  const resumeRecording = useCallback(() => {
    if (!session) return;
    
    setSession({ ...session, status: 'recording' });
    setIsRecording(true);
  }, [session]);
  
  const stopRecording = useCallback(() => {
    if (!session) return;
    
    setSession({ ...session, status: 'stopped' });
    setIsRecording(false);
  }, [session]);
  
  const publishRecording = useMutation({
    mutationFn: async (postData: Partial<PerformancePost>) => {
      if (!session) throw new Error('No recording session');
      
      const response = await fetch('/api/feeds/performance/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session,
          ...postData,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to publish recording');
      
      return response.json();
    },
    onSuccess: () => {
      setSession(null);
      setIsRecording(false);
    },
  });
  
  return {
    session,
    isRecording,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    publishRecording: publishRecording.mutate,
    isPublishing: publishRecording.isPending,
  };
};

/**
 * Knowledge basket hook
 */
export const useKnowledgeBasket = (userId: string) => {
  const queryClient = useQueryClient();
  
  const { data: items, isLoading } = useQuery<KnowledgeBasketItem[]>({
    queryKey: ['knowledge-basket', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/knowledge-basket`);
      
      if (!response.ok) throw new Error('Failed to fetch knowledge basket');
      
      return response.json();
    },
  });
  
  const addToBasket = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/users/${userId}/knowledge-basket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });
      
      if (!response.ok) throw new Error('Failed to add to knowledge basket');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-basket', userId] });
    },
  });
  
  const removeFromBasket = useMutation({
    mutationFn: async (itemId: string) => {
      const response = await fetch(`/api/users/${userId}/knowledge-basket/${itemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to remove from knowledge basket');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-basket', userId] });
    },
  });
  
  return {
    items: items || [],
    isLoading,
    addToBasket: addToBasket.mutate,
    removeFromBasket: removeFromBasket.mutate,
    isAdding: addToBasket.isPending,
    isRemoving: removeFromBasket.isPending,
  };
};

/**
 * Live classroom hook
 */
export const useLiveClassroom = (classroomId?: string) => {
  const queryClient = useQueryClient();
  
  const { data: classroom, isLoading } = useQuery<LiveClassroom>({
    queryKey: ['live-classroom', classroomId],
    queryFn: async () => {
      if (!classroomId) throw new Error('No classroom ID');
      
      const response = await fetch(`/api/classrooms/${classroomId}`);
      
      if (!response.ok) throw new Error('Failed to fetch classroom');
      
      return response.json();
    },
    enabled: !!classroomId,
  });
  
  const joinClassroom = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/classrooms/${id}/join`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to join classroom');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-classroom'] });
    },
  });
  
  const leaveClassroom = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/classrooms/${id}/leave`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to leave classroom');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live-classroom'] });
    },
  });
  
  return {
    classroom,
    isLoading,
    joinClassroom: joinClassroom.mutate,
    leaveClassroom: leaveClassroom.mutate,
    isJoining: joinClassroom.isPending,
    isLeaving: leaveClassroom.isPending,
  };
};
// src/hooks/feeds/useFamilyRootFeed.ts
// Family Root Feed Hook

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FamilyHouse, 
  FamilyPost,
  FamilyRootFilters,
  ContributionBoard,
  ClanPurse,
} from '@/types/feeds/familyRoot.types';

/**
 * Family root feed hook
 */
export const useFamilyRootFeed = (houseId: string, filters?: FamilyRootFilters) => {
  const queryClient = useQueryClient();
  
  const {
    data: posts,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<FamilyPost[]>({
    queryKey: ['family-root-feed', houseId, filters],
    queryFn: async () => {
      const response = await fetch(`/api/houses/${houseId}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters }),
      });
      
      if (!response.ok) throw new Error('Failed to fetch family feed');
      
      return response.json();
    },
    staleTime: 30000,
  });
  
  const createPost = useMutation({
    mutationFn: async (post: Partial<FamilyPost>) => {
      const response = await fetch(`/api/houses/${houseId}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      
      if (!response.ok) throw new Error('Failed to create post');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-root-feed', houseId] });
    },
  });
  
  return {
    posts: posts || [],
    isLoading,
    isError,
    error,
    refetch,
    createPost: createPost.mutate,
    isCreating: createPost.isPending,
  };
};

/**
 * Family house hook
 */
export const useFamilyHouse = (houseId?: string) => {
  const queryClient = useQueryClient();
  
  const { data: house, isLoading } = useQuery<FamilyHouse>({
    queryKey: ['family-house', houseId],
    queryFn: async () => {
      if (!houseId) throw new Error('No house ID');
      
      const response = await fetch(`/api/houses/${houseId}`);
      
      if (!response.ok) throw new Error('Failed to fetch house');
      
      return response.json();
    },
    enabled: !!houseId,
  });
  
  const joinHouse = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/houses/${id}/join`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to join house');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-house'] });
    },
  });
  
  const leaveHouse = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/houses/${id}/leave`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to leave house');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['family-house'] });
    },
  });
  
  return {
    house,
    isLoading,
    joinHouse: joinHouse.mutate,
    leaveHouse: leaveHouse.mutate,
    isJoining: joinHouse.isPending,
    isLeaving: leaveHouse.isPending,
  };
};

/**
 * Contribution board hook (Ajo/Esusu)
 */
export const useContributionBoard = (boardId?: string) => {
  const queryClient = useQueryClient();
  
  const { data: board, isLoading } = useQuery<ContributionBoard>({
    queryKey: ['contribution-board', boardId],
    queryFn: async () => {
      if (!boardId) throw new Error('No board ID');
      
      const response = await fetch(`/api/contributions/${boardId}`);
      
      if (!response.ok) throw new Error('Failed to fetch contribution board');
      
      return response.json();
    },
    enabled: !!boardId,
  });
  
  const makeContribution = useMutation({
    mutationFn: async ({ boardId, amount }: { boardId: string; amount: number }) => {
      const response = await fetch(`/api/contributions/${boardId}/contribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      
      if (!response.ok) throw new Error('Failed to make contribution');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contribution-board'] });
    },
  });
  
  return {
    board,
    isLoading,
    makeContribution: makeContribution.mutate,
    isContributing: makeContribution.isPending,
  };
};

/**
 * Clan purse hook
 */
export const useClanPurse = (purseId?: string) => {
  const queryClient = useQueryClient();
  
  const { data: purse, isLoading } = useQuery<ClanPurse>({
    queryKey: ['clan-purse', purseId],
    queryFn: async () => {
      if (!purseId) throw new Error('No purse ID');
      
      const response = await fetch(`/api/clan-purse/${purseId}`);
      
      if (!response.ok) throw new Error('Failed to fetch clan purse');
      
      return response.json();
    },
    enabled: !!purseId,
  });
  
  const addToPurse = useMutation({
    mutationFn: async ({ purseId, amount }: { purseId: string; amount: number }) => {
      const response = await fetch(`/api/clan-purse/${purseId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      
      if (!response.ok) throw new Error('Failed to add to clan purse');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clan-purse'] });
    },
  });
  
  return {
    purse,
    isLoading,
    addToPurse: addToPurse.mutate,
    isAdding: addToPurse.isPending,
  };
};

/**
 * Heritage archive hook
 */
export const useHeritageArchive = (houseId: string) => {
  const { data: archive, isLoading } = useQuery({
    queryKey: ['heritage-archive', houseId],
    queryFn: async () => {
      const response = await fetch(`/api/houses/${houseId}/heritage`);
      
      if (!response.ok) throw new Error('Failed to fetch heritage archive');
      
      return response.json();
    },
  });
  
  return {
    archive: archive || [],
    isLoading,
  };
};
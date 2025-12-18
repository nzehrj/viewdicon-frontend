// src/hooks/feeds/useMarketplaceFeed.ts
// Marketplace Feed Hook

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  MarketplaceListing, 
  MarketplaceTransaction,
  MarketplaceFilters,
  BusinessChatThread,
} from '@/types/feeds/marketplace.types';

/**
 * Marketplace feed hook
 */
export const useMarketplaceFeed = (filters?: MarketplaceFilters) => {
  const queryClient = useQueryClient();
  
  const {
    data: listings,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<MarketplaceListing[]>({
    queryKey: ['marketplace-feed', filters],
    queryFn: async () => {
      const response = await fetch('/api/feeds/marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters }),
      });
      
      if (!response.ok) throw new Error('Failed to fetch marketplace feed');
      
      return response.json();
    },
    staleTime: 30000,
  });
  
  const createListing = useMutation({
    mutationFn: async (listing: Partial<MarketplaceListing>) => {
      const response = await fetch('/api/marketplace/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing),
      });
      
      if (!response.ok) throw new Error('Failed to create listing');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-feed'] });
    },
  });
  
  const updateListing = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MarketplaceListing> }) => {
      const response = await fetch(`/api/marketplace/listings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update listing');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-feed'] });
    },
  });
  
  const deleteListing = useMutation({
    mutationFn: async (listingId: string) => {
      const response = await fetch(`/api/marketplace/listings/${listingId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete listing');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-feed'] });
    },
  });
  
  return {
    listings: listings || [],
    isLoading,
    isError,
    error,
    refetch,
    createListing: createListing.mutate,
    updateListing: updateListing.mutate,
    deleteListing: deleteListing.mutate,
    isCreating: createListing.isPending,
    isUpdating: updateListing.isPending,
    isDeleting: deleteListing.isPending,
  };
};

/**
 * Marketplace transaction hook (Add to Pot flow)
 */
export const useMarketplaceTransaction = () => {
  const queryClient = useQueryClient();
  
  const addToPot = useMutation({
    mutationFn: async (data: {
      listingId: string;
      quantity: number;
      deliveryMode: string;
    }) => {
      const response = await fetch('/api/marketplace/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to add to pot');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-transactions'] });
    },
  });
  
  const confirmDelivery = useMutation({
    mutationFn: async (transactionId: string) => {
      const response = await fetch(`/api/marketplace/transactions/${transactionId}/confirm`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to confirm delivery');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-transactions'] });
    },
  });
  
  const disputeTransaction = useMutation({
    mutationFn: async ({ transactionId, reason }: { transactionId: string; reason: string }) => {
      const response = await fetch(`/api/marketplace/transactions/${transactionId}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) throw new Error('Failed to dispute transaction');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketplace-transactions'] });
    },
  });
  
  return {
    addToPot: addToPot.mutate,
    confirmDelivery: confirmDelivery.mutate,
    disputeTransaction: disputeTransaction.mutate,
    isAddingToPot: addToPot.isPending,
    isConfirming: confirmDelivery.isPending,
    isDisputing: disputeTransaction.isPending,
  };
};

/**
 * Business chat hook
 */
export const useBusinessChat = (threadId?: string) => {
  const queryClient = useQueryClient();
  
  const { data: thread, isLoading } = useQuery<BusinessChatThread>({
    queryKey: ['business-chat', threadId],
    queryFn: async () => {
      if (!threadId) throw new Error('No thread ID');
      
      const response = await fetch(`/api/marketplace/chats/${threadId}`);
      
      if (!response.ok) throw new Error('Failed to fetch chat thread');
      
      return response.json();
    },
    enabled: !!threadId,
    refetchInterval: 5000, // Poll every 5 seconds
  });
  
  const sendMessage = useMutation({
    mutationFn: async (data: {
      text?: string;
      voiceUrl?: string;
      imageUrl?: string;
    }) => {
      if (!threadId) throw new Error('No thread ID');
      
      const response = await fetch(`/api/marketplace/chats/${threadId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-chat', threadId] });
    },
  });
  
  return {
    thread,
    isLoading,
    sendMessage: sendMessage.mutate,
    isSending: sendMessage.isPending,
  };
};

/**
 * User's marketplace transactions hook
 */
export const useMyTransactions = (userId: string, role: 'buyer' | 'seller') => {
  const { data: transactions, isLoading } = useQuery<MarketplaceTransaction[]>({
    queryKey: ['my-transactions', userId, role],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/transactions?role=${role}`);
      
      if (!response.ok) throw new Error('Failed to fetch transactions');
      
      return response.json();
    },
  });
  
  return {
    transactions: transactions || [],
    isLoading,
  };
};

/**
 * Voice pickup code hook (for sellers)
 */
export const useVoicePickupCode = () => {
  const generatePickupCode = useMutation({
    mutationFn: async (transactionId: string) => {
      const response = await fetch(`/api/marketplace/transactions/${transactionId}/pickup-code`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to generate pickup code');
      
      return response.json();
    },
  });
  
  const verifyPickupCode = useMutation({
    mutationFn: async ({ transactionId, code }: { transactionId: string; code: string }) => {
      const response = await fetch(`/api/marketplace/transactions/${transactionId}/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      
      if (!response.ok) throw new Error('Failed to verify pickup code');
      
      return response.json();
    },
  });
  
  return {
    generatePickupCode: generatePickupCode.mutate,
    verifyPickupCode: verifyPickupCode.mutate,
    isGenerating: generatePickupCode.isPending,
    isVerifying: verifyPickupCode.isPending,
  };
};
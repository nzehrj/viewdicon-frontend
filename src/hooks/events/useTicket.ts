// src/hooks/events/useTicket.ts
// Ticketing System Hook

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  EventTicket, 
  TicketTransfer,
  TicketResaleListing,
} from '@/types/events/ticket.types';

/**
 * Ticket purchase hook
 */
export const useTicketPurchase = () => {
  const queryClient = useQueryClient();
  
  const purchaseTicket = useMutation({
    mutationFn: async (data: {
      eventId: string;
      tickets: Array<{ tierId: string; quantity: number }>;
    }) => {
      const response = await fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to purchase ticket');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['event'] });
    },
  });
  
  return {
    purchaseTicket: purchaseTicket.mutate,
    isPurchasing: purchaseTicket.isPending,
  };
};

/**
 * User's tickets hook
 */
export const useMyTickets = (userId: string) => {
  const { data: tickets, isLoading } = useQuery<EventTicket[]>({
    queryKey: ['my-tickets', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/tickets`);
      
      if (!response.ok) throw new Error('Failed to fetch tickets');
      
      return response.json();
    },
  });
  
  return {
    tickets: tickets || [],
    activeTickets: tickets?.filter((t) => t.status === 'active') || [],
    upcomingTickets: tickets?.filter((t) => t.status === 'active' && new Date(t.validUntil) > new Date()) || [],
    isLoading,
  };
};

/**
 * Ticket details hook
 */
export const useTicket = (ticketId?: string) => {
  const { data: ticket, isLoading } = useQuery<EventTicket>({
    queryKey: ['ticket', ticketId],
    queryFn: async () => {
      if (!ticketId) throw new Error('No ticket ID');
      
      const response = await fetch(`/api/tickets/${ticketId}`);
      
      if (!response.ok) throw new Error('Failed to fetch ticket');
      
      return response.json();
    },
    enabled: !!ticketId,
  });
  
  return {
    ticket,
    isLoading,
  };
};

/**
 * Ticket transfer hook
 */
export const useTicketTransfer = () => {
  const queryClient = useQueryClient();
  
  const transferTicket = useMutation({
    mutationFn: async (data: {
      ticketId: string;
      toUserId?: string;
      toUserEmail?: string;
      message?: string;
    }) => {
      const response = await fetch('/api/tickets/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to transfer ticket');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
    },
  });
  
  const acceptTransfer = useMutation({
    mutationFn: async (transferId: string) => {
      const response = await fetch(`/api/tickets/transfer/${transferId}/accept`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to accept transfer');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['pending-transfers'] });
    },
  });
  
  const declineTransfer = useMutation({
    mutationFn: async (transferId: string) => {
      const response = await fetch(`/api/tickets/transfer/${transferId}/decline`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to decline transfer');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-transfers'] });
    },
  });
  
  return {
    transferTicket: transferTicket.mutate,
    acceptTransfer: acceptTransfer.mutate,
    declineTransfer: declineTransfer.mutate,
    isTransferring: transferTicket.isPending,
    isAccepting: acceptTransfer.isPending,
    isDeclining: declineTransfer.isPending,
  };
};

/**
 * Pending transfers hook
 */
export const usePendingTransfers = (userId: string) => {
  const { data: transfers, isLoading } = useQuery<TicketTransfer[]>({
    queryKey: ['pending-transfers', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}/pending-transfers`);
      
      if (!response.ok) throw new Error('Failed to fetch pending transfers');
      
      return response.json();
    },
  });
  
  return {
    transfers: transfers || [],
    isLoading,
  };
};

/**
 * Ticket resale hook
 */
export const useTicketResale = () => {
  const queryClient = useQueryClient();
  
  const listForResale = useMutation({
    mutationFn: async (data: {
      ticketId: string;
      askingPrice: number;
    }) => {
      const response = await fetch('/api/tickets/resale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to list ticket for resale');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['resale-listings'] });
    },
  });
  
  const cancelResale = useMutation({
    mutationFn: async (listingId: string) => {
      const response = await fetch(`/api/tickets/resale/${listingId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to cancel resale');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resale-listings'] });
    },
  });
  
  const purchaseResaleTicket = useMutation({
    mutationFn: async (listingId: string) => {
      const response = await fetch(`/api/tickets/resale/${listingId}/purchase`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to purchase resale ticket');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-tickets'] });
      queryClient.invalidateQueries({ queryKey: ['resale-listings'] });
    },
  });
  
  return {
    listForResale: listForResale.mutate,
    cancelResale: cancelResale.mutate,
    purchaseResaleTicket: purchaseResaleTicket.mutate,
    isListing: listForResale.isPending,
    isCancelling: cancelResale.isPending,
    isPurchasing: purchaseResaleTicket.isPending,
  };
};

/**
 * Resale listings hook
 */
export const useResaleListings = (eventId: string) => {
  const { data: listings, isLoading } = useQuery<TicketResaleListing[]>({
    queryKey: ['resale-listings', eventId],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}/resale`);
      
      if (!response.ok) throw new Error('Failed to fetch resale listings');
      
      return response.json();
    },
  });
  
  return {
    listings: listings || [],
    isLoading,
  };
};

/**
 * AURA check-in hook
 */
export const useAURACheckIn = () => {
  const queryClient = useQueryClient();
  
  const checkIn = useMutation({
    mutationFn: async (data: {
      ticketId: string;
      beaconId?: string;
      location: string;
    }) => {
      const response = await fetch('/api/tickets/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to check in');
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket'] });
      queryClient.invalidateQueries({ queryKey: ['event-attendance'] });
    },
  });
  
  return {
    checkIn: checkIn.mutate,
    isCheckingIn: checkIn.isPending,
  };
};

/**
 * Ticket validation hook (for event staff)
 */
export const useTicketValidation = () => {
  const validateTicket = useMutation({
    mutationFn: async (data: {
      ticketId?: string;
      qrCode?: string;
      auraBeaconId?: string;
    }) => {
      const response = await fetch('/api/tickets/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to validate ticket');
      
      return response.json();
    },
  });
  
  return {
    validateTicket: validateTicket.mutate,
    isValidating: validateTicket.isPending,
  };
};
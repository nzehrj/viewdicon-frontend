// src/store/slices/eventSlice.ts
// Event & Ticketing State Management

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

/**
 * Event state interface
 */
interface EventState {
  // Event creation flow
  eventCreation: {
    step: number;
    data: {
      title?: string;
      description?: string;
      category?: string;
      isVirtual?: boolean;
      location?: string;
      startDate?: string;
      endDate?: string;
      tickets?: Array<{
        name: string;
        price: number;
        capacity: number;
      }>;
    };
  };
  
  // Active event (currently viewing)
  activeEventId: string | null;
  
  // Event filters
  filters: {
    category?: string;
    isVirtual?: boolean;
    startDate?: string;
    endDate?: string;
    priceMin?: number;
    priceMax?: number;
  };
  
  // Ticket purchase flow
  ticketPurchase: {
    eventId: string | null;
    selectedTiers: Array<{
      tierId: string;
      quantity: number;
    }>;
    totalAmount: number;
    step: 'select' | 'review' | 'payment' | 'complete';
  };
  
  // My tickets
  myTickets: {
    upcoming: string[];
    past: string[];
    transferred: string[];
  };
  
  // Ticket transfer
  ticketTransfer: {
    showModal: boolean;
    ticketId: string | null;
    recipientEmail: string;
    message: string;
  };
  
  // Ticket resale
  ticketResale: {
    showModal: boolean;
    ticketId: string | null;
    askingPrice: number;
  };
  
  // AURA check-in
  auraCheckIn: {
    showScanner: boolean;
    scannedTicketId: string | null;
    checkInStatus: 'idle' | 'scanning' | 'success' | 'error';
    errorMessage: string | null;
  };
  
  // Event showcase
  selectedBoothId: string | null;
  
  // Trade zone
  tradeZone: {
    showConnections: boolean;
    selectedConnectionId: string | null;
  };
  
  // Event streaming
  streaming: {
    isLive: boolean;
    viewerCount: number;
    chatVisible: boolean;
  };
}

/**
 * Initial state
 */
const initialState: EventState = {
  eventCreation: {
    step: 0,
    data: {},
  },
  
  activeEventId: null,
  
  filters: {},
  
  ticketPurchase: {
    eventId: null,
    selectedTiers: [],
    totalAmount: 0,
    step: 'select',
  },
  
  myTickets: {
    upcoming: [],
    past: [],
    transferred: [],
  },
  
  ticketTransfer: {
    showModal: false,
    ticketId: null,
    recipientEmail: '',
    message: '',
  },
  
  ticketResale: {
    showModal: false,
    ticketId: null,
    askingPrice: 0,
  },
  
  auraCheckIn: {
    showScanner: false,
    scannedTicketId: null,
    checkInStatus: 'idle',
    errorMessage: null,
  },
  
  selectedBoothId: null,
  
  tradeZone: {
    showConnections: false,
    selectedConnectionId: null,
  },
  
  streaming: {
    isLive: false,
    viewerCount: 0,
    chatVisible: true,
  },
};

/**
 * Event slice
 */
export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    // Event creation
    setEventCreationStep: (state, action: PayloadAction<number>) => {
      state.eventCreation.step = action.payload;
    },
    
    updateEventCreationData: (state, action: PayloadAction<Partial<EventState['eventCreation']['data']>>) => {
      state.eventCreation.data = { ...state.eventCreation.data, ...action.payload };
    },
    
    resetEventCreation: (state) => {
      state.eventCreation = { step: 0, data: {} };
    },
    
    // Active event
    setActiveEventId: (state, action: PayloadAction<string | null>) => {
      state.activeEventId = action.payload;
    },
    
    // Filters
    setEventFilters: (state, action: PayloadAction<Partial<EventState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearEventFilters: (state) => {
      state.filters = {};
    },
    
    // Ticket purchase
    startTicketPurchase: (state, action: PayloadAction<string>) => {
      state.ticketPurchase = {
        eventId: action.payload,
        selectedTiers: [],
        totalAmount: 0,
        step: 'select',
      };
    },
    
    addTicketTier: (state, action: PayloadAction<{ tierId: string; quantity: number; price: number }>) => {
      const existing = state.ticketPurchase.selectedTiers.find(t => t.tierId === action.payload.tierId);
      
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.ticketPurchase.selectedTiers.push({
          tierId: action.payload.tierId,
          quantity: action.payload.quantity,
        });
      }
      
      state.ticketPurchase.totalAmount += action.payload.price * action.payload.quantity;
    },
    
    removeTicketTier: (state, action: PayloadAction<{ tierId: string; price: number }>) => {
      const tier = state.ticketPurchase.selectedTiers.find(t => t.tierId === action.payload.tierId);
      
      if (tier) {
        state.ticketPurchase.totalAmount -= action.payload.price * tier.quantity;
        state.ticketPurchase.selectedTiers = state.ticketPurchase.selectedTiers.filter(
          t => t.tierId !== action.payload.tierId
        );
      }
    },
    
    setTicketPurchaseStep: (state, action: PayloadAction<'select' | 'review' | 'payment' | 'complete'>) => {
      state.ticketPurchase.step = action.payload;
    },
    
    completeTicketPurchase: (state) => {
      state.ticketPurchase = {
        eventId: null,
        selectedTiers: [],
        totalAmount: 0,
        step: 'select',
      };
    },
    
    // My tickets
    addMyTicket: (state, action: PayloadAction<{ ticketId: string; category: 'upcoming' | 'past' }>) => {
      state.myTickets[action.payload.category].push(action.payload.ticketId);
    },
    
    moveTicketToPast: (state, action: PayloadAction<string>) => {
      state.myTickets.upcoming = state.myTickets.upcoming.filter(id => id !== action.payload);
      state.myTickets.past.push(action.payload);
    },
    
    // Ticket transfer
    openTicketTransferModal: (state, action: PayloadAction<string>) => {
      state.ticketTransfer = {
        showModal: true,
        ticketId: action.payload,
        recipientEmail: '',
        message: '',
      };
    },
    
    closeTicketTransferModal: (state) => {
      state.ticketTransfer = {
        showModal: false,
        ticketId: null,
        recipientEmail: '',
        message: '',
      };
    },
    
    setTransferRecipient: (state, action: PayloadAction<string>) => {
      state.ticketTransfer.recipientEmail = action.payload;
    },
    
    setTransferMessage: (state, action: PayloadAction<string>) => {
      state.ticketTransfer.message = action.payload;
    },
    
    // Ticket resale
    openTicketResaleModal: (state, action: PayloadAction<{ ticketId: string; originalPrice: number }>) => {
      state.ticketResale = {
        showModal: true,
        ticketId: action.payload.ticketId,
        askingPrice: action.payload.originalPrice,
      };
    },
    
    closeTicketResaleModal: (state) => {
      state.ticketResale = {
        showModal: false,
        ticketId: null,
        askingPrice: 0,
      };
    },
    
    setResalePrice: (state, action: PayloadAction<number>) => {
      state.ticketResale.askingPrice = action.payload;
    },
    
    // AURA check-in
    openAURAScanner: (state) => {
      state.auraCheckIn.showScanner = true;
      state.auraCheckIn.checkInStatus = 'idle';
      state.auraCheckIn.errorMessage = null;
    },
    
    closeAURAScanner: (state) => {
      state.auraCheckIn = {
        showScanner: false,
        scannedTicketId: null,
        checkInStatus: 'idle',
        errorMessage: null,
      };
    },
    
    setAURACheckInStatus: (state, action: PayloadAction<{
      status: 'idle' | 'scanning' | 'success' | 'error';
      ticketId?: string | null;
      errorMessage?: string | null;
    }>) => {
      state.auraCheckIn.checkInStatus = action.payload.status;
      if (action.payload.ticketId !== undefined) {
        state.auraCheckIn.scannedTicketId = action.payload.ticketId;
      }
      if (action.payload.errorMessage !== undefined) {
        state.auraCheckIn.errorMessage = action.payload.errorMessage;
      }
    },
    
    // Event showcase
    setSelectedBoothId: (state, action: PayloadAction<string | null>) => {
      state.selectedBoothId = action.payload;
    },
    
    // Trade zone
    toggleTradeZoneConnections: (state) => {
      state.tradeZone.showConnections = !state.tradeZone.showConnections;
    },
    
    setSelectedConnectionId: (state, action: PayloadAction<string | null>) => {
      state.tradeZone.selectedConnectionId = action.payload;
    },
    
    // Streaming
    setStreamingStatus: (state, action: PayloadAction<{ isLive: boolean; viewerCount?: number }>) => {
      state.streaming.isLive = action.payload.isLive;
      if (action.payload.viewerCount !== undefined) {
        state.streaming.viewerCount = action.payload.viewerCount;
      }
    },
    
    toggleStreamingChat: (state) => {
      state.streaming.chatVisible = !state.streaming.chatVisible;
    },
    
    // Reset all
    resetEventState: () => initialState,
  },
});

/**
 * Actions
 */
export const {
  setEventCreationStep,
  updateEventCreationData,
  resetEventCreation,
  setActiveEventId,
  setEventFilters,
  clearEventFilters,
  startTicketPurchase,
  addTicketTier,
  removeTicketTier,
  setTicketPurchaseStep,
  completeTicketPurchase,
  addMyTicket,
  moveTicketToPast,
  openTicketTransferModal,
  closeTicketTransferModal,
  setTransferRecipient,
  setTransferMessage,
  openTicketResaleModal,
  closeTicketResaleModal,
  setResalePrice,
  openAURAScanner,
  closeAURAScanner,
  setAURACheckInStatus,
  setSelectedBoothId,
  toggleTradeZoneConnections,
  setSelectedConnectionId,
  setStreamingStatus,
  toggleStreamingChat,
  resetEventState,
} = eventSlice.actions;

/**
 * Selectors
 */
export const selectEventCreation = (state: RootState) => state.event.eventCreation;
export const selectActiveEventId = (state: RootState) => state.event.activeEventId;
export const selectEventFilters = (state: RootState) => state.event.filters;
export const selectTicketPurchase = (state: RootState) => state.event.ticketPurchase;
export const selectMyTickets = (state: RootState) => state.event.myTickets;
export const selectTicketTransfer = (state: RootState) => state.event.ticketTransfer;
export const selectTicketResale = (state: RootState) => state.event.ticketResale;
export const selectAURACheckIn = (state: RootState) => state.event.auraCheckIn;
export const selectSelectedBoothId = (state: RootState) => state.event.selectedBoothId;
export const selectTradeZone = (state: RootState) => state.event.tradeZone;
export const selectStreaming = (state: RootState) => state.event.streaming;

/**
 * Reducer
 */
export default eventSlice.reducer;
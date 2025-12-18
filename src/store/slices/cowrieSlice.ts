// src/store/slices/cowrieSlice.ts
// Cowrie Wallet State Management

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

/**
 * Transaction type
 */
interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  timestamp: number;
  category: 'cowrie-drop' | 'marketplace' | 'tip' | 'event' | 'sorosoke' | 'reward' | 'transfer';
  relatedId?: string;
}

/**
 * Cowrie state interface
 */
interface CowrieState {
  // Balance
  balance: number;
  
  // Transactions
  transactions: Transaction[];
  
  // Pending transactions
  pendingTransactions: {
    [transactionId: string]: {
      amount: number;
      type: 'send' | 'receive';
      status: 'pending' | 'processing' | 'completed' | 'failed';
    };
  };
  
  // Wallet UI state
  showWallet: boolean;
  showTransactionHistory: boolean;
  
  // Send Cowrie modal
  showSendModal: boolean;
  sendRecipientId: string | null;
  sendAmount: number;
  sendMessage: string;
  
  // Receive Cowrie modal
  showReceiveModal: boolean;
  receiveQRCode: string | null;
  
  // Escrow
  activeEscrows: {
    [escrowId: string]: {
      amount: number;
      status: 'pending' | 'locked' | 'in_delivery' | 'released' | 'disputed';
      buyerId: string;
      sellerId: string;
    };
  };
  
  // Cowrie rain (celebration animation)
  showCowrieRain: boolean;
  cowrieRainAmount: number;
  
  // Statistics
  stats: {
    totalEarned: number;
    totalSpent: number;
    totalTipped: number;
    totalReceived: number;
  };
  
  // Tier badge
  tierBadge: 'bronze' | 'silver' | 'gold' | 'platinum';
}

/**
 * Initial state
 */
const initialState: CowrieState = {
  balance: 0,
  transactions: [],
  pendingTransactions: {},
  
  showWallet: false,
  showTransactionHistory: false,
  
  showSendModal: false,
  sendRecipientId: null,
  sendAmount: 0,
  sendMessage: '',
  
  showReceiveModal: false,
  receiveQRCode: null,
  
  activeEscrows: {},
  
  showCowrieRain: false,
  cowrieRainAmount: 0,
  
  stats: {
    totalEarned: 0,
    totalSpent: 0,
    totalTipped: 0,
    totalReceived: 0,
  },
  
  tierBadge: 'bronze',
};

/**
 * Cowrie slice
 */
export const cowrieSlice = createSlice({
  name: 'cowrie',
  initialState,
  reducers: {
    // Set balance
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
      
      // Update tier badge
      if (action.payload >= 100000) {
        state.tierBadge = 'platinum';
      } else if (action.payload >= 50000) {
        state.tierBadge = 'gold';
      } else if (action.payload >= 10000) {
        state.tierBadge = 'silver';
      } else {
        state.tierBadge = 'bronze';
      }
    },
    
    // Add transaction
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload);
      
      // Update balance
      if (action.payload.type === 'credit') {
        state.balance += action.payload.amount;
        state.stats.totalEarned += action.payload.amount;
        state.stats.totalReceived += action.payload.amount;
      } else {
        state.balance -= action.payload.amount;
        state.stats.totalSpent += action.payload.amount;
        
        if (action.payload.category === 'cowrie-drop' || action.payload.category === 'tip') {
          state.stats.totalTipped += action.payload.amount;
        }
      }
      
      // Keep only last 100 transactions
      if (state.transactions.length > 100) {
        state.transactions = state.transactions.slice(0, 100);
      }
    },
    
    // Pending transaction
    addPendingTransaction: (state, action: PayloadAction<{
      id: string;
      amount: number;
      type: 'send' | 'receive';
    }>) => {
      state.pendingTransactions[action.payload.id] = {
        amount: action.payload.amount,
        type: action.payload.type,
        status: 'pending',
      };
    },
    
    updatePendingTransaction: (state, action: PayloadAction<{
      id: string;
      status: 'pending' | 'processing' | 'completed' | 'failed';
    }>) => {
      if (state.pendingTransactions[action.payload.id]) {
        state.pendingTransactions[action.payload.id].status = action.payload.status;
      }
    },
    
    removePendingTransaction: (state, action: PayloadAction<string>) => {
      delete state.pendingTransactions[action.payload];
    },
    
    // Wallet visibility
    toggleWallet: (state) => {
      state.showWallet = !state.showWallet;
    },
    
    setShowWallet: (state, action: PayloadAction<boolean>) => {
      state.showWallet = action.payload;
    },
    
    // Transaction history
    toggleTransactionHistory: (state) => {
      state.showTransactionHistory = !state.showTransactionHistory;
    },
    
    setShowTransactionHistory: (state, action: PayloadAction<boolean>) => {
      state.showTransactionHistory = action.payload;
    },
    
    // Send modal
    openSendModal: (state, action: PayloadAction<string | null>) => {
      state.showSendModal = true;
      state.sendRecipientId = action.payload;
      state.sendAmount = 0;
      state.sendMessage = '';
    },
    
    closeSendModal: (state) => {
      state.showSendModal = false;
      state.sendRecipientId = null;
      state.sendAmount = 0;
      state.sendMessage = '';
    },
    
    setSendAmount: (state, action: PayloadAction<number>) => {
      state.sendAmount = action.payload;
    },
    
    setSendMessage: (state, action: PayloadAction<string>) => {
      state.sendMessage = action.payload;
    },
    
    // Receive modal
    openReceiveModal: (state, action: PayloadAction<string>) => {
      state.showReceiveModal = true;
      state.receiveQRCode = action.payload;
    },
    
    closeReceiveModal: (state) => {
      state.showReceiveModal = false;
      state.receiveQRCode = null;
    },
    
    // Escrow
    addEscrow: (state, action: PayloadAction<{
      escrowId: string;
      amount: number;
      buyerId: string;
      sellerId: string;
    }>) => {
      state.activeEscrows[action.payload.escrowId] = {
        amount: action.payload.amount,
        status: 'pending',
        buyerId: action.payload.buyerId,
        sellerId: action.payload.sellerId,
      };
    },
    
    updateEscrowStatus: (state, action: PayloadAction<{
      escrowId: string;
      status: 'pending' | 'locked' | 'in_delivery' | 'released' | 'disputed';
    }>) => {
      if (state.activeEscrows[action.payload.escrowId]) {
        state.activeEscrows[action.payload.escrowId].status = action.payload.status;
      }
    },
    
    removeEscrow: (state, action: PayloadAction<string>) => {
      delete state.activeEscrows[action.payload];
    },
    
    // Cowrie rain
    triggerCowrieRain: (state, action: PayloadAction<number>) => {
      state.showCowrieRain = true;
      state.cowrieRainAmount = action.payload;
    },
    
    hideCowrieRain: (state) => {
      state.showCowrieRain = false;
      state.cowrieRainAmount = 0;
    },
    
    // Set statistics
    setStats: (state, action: PayloadAction<Partial<CowrieState['stats']>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    
    // Reset all
    resetCowrieState: () => initialState,
  },
});

/**
 * Actions
 */
export const {
  setBalance,
  addTransaction,
  addPendingTransaction,
  updatePendingTransaction,
  removePendingTransaction,
  toggleWallet,
  setShowWallet,
  toggleTransactionHistory,
  setShowTransactionHistory,
  openSendModal,
  closeSendModal,
  setSendAmount,
  setSendMessage,
  openReceiveModal,
  closeReceiveModal,
  addEscrow,
  updateEscrowStatus,
  removeEscrow,
  triggerCowrieRain,
  hideCowrieRain,
  setStats,
  resetCowrieState,
} = cowrieSlice.actions;

/**
 * Selectors
 */
export const selectBalance = (state: RootState) => state.cowrie.balance;
export const selectTransactions = (state: RootState) => state.cowrie.transactions;
export const selectPendingTransactions = (state: RootState) => state.cowrie.pendingTransactions;
export const selectShowWallet = (state: RootState) => state.cowrie.showWallet;
export const selectShowTransactionHistory = (state: RootState) => state.cowrie.showTransactionHistory;

export const selectShowSendModal = (state: RootState) => state.cowrie.showSendModal;
export const selectSendRecipientId = (state: RootState) => state.cowrie.sendRecipientId;
export const selectSendAmount = (state: RootState) => state.cowrie.sendAmount;
export const selectSendMessage = (state: RootState) => state.cowrie.sendMessage;

export const selectShowReceiveModal = (state: RootState) => state.cowrie.showReceiveModal;
export const selectReceiveQRCode = (state: RootState) => state.cowrie.receiveQRCode;

export const selectActiveEscrows = (state: RootState) => state.cowrie.activeEscrows;
export const selectEscrow = (escrowId: string) => (state: RootState) => 
  state.cowrie.activeEscrows[escrowId];

export const selectShowCowrieRain = (state: RootState) => state.cowrie.showCowrieRain;
export const selectCowrieRainAmount = (state: RootState) => state.cowrie.cowrieRainAmount;

export const selectCowrieStats = (state: RootState) => state.cowrie.stats;
export const selectTierBadge = (state: RootState) => state.cowrie.tierBadge;

/**
 * Reducer
 */
export default cowrieSlice.reducer;
// src/store/slices/potSlice.ts
// POT System State Management

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

/**
 * POT interaction state interface
 */
interface PotState {
  // Active interactions
  activeInteractions: {
    [potId: string]: {
      hasHeard: boolean;
      hasSpoken: boolean;
      hasBlessed: boolean;
      hasCowried: boolean;
      hasEchoed: boolean;
      // Social Voice specific
      hasAmplified?: boolean;
      hasVerified?: boolean;
      hasUbuntu?: boolean;
      hasHelped?: boolean;
    };
  };
  
  // Cooldowns (in seconds)
  cooldowns: {
    speak: number;
    bless: number;
    cowrie: number;
    echo: number;
  };
  
  // UI state
  showInteractionBar: boolean;
  activeInteractionType: 'hear' | 'speak' | 'bless' | 'cowrie' | 'echo' | null;
  
  // Cowrie drop modal
  showCowrieModal: boolean;
  cowrieModalPotId: string | null;
  cowrieAmount: number;
  cowrieMessage: string;
  
  // Speak/Bless modal
  showMessageModal: boolean;
  messageModalPotId: string | null;
  messageModalType: 'speak' | 'bless' | null;
  messageText: string;
  messageVoiceUrl: string | null;
  
  // Echo modal
  showEchoModal: boolean;
  echoModalPotId: string | null;
  echoMessage: string;
  
  // Heat animation
  showHeatAnimation: boolean;
  heatAnimationPotId: string | null;
  heatAnimationDelta: number;
  
  // Interaction feedback
  lastInteraction: {
    potId: string;
    type: string;
    timestamp: number;
  } | null;
}

/**
 * Initial state
 */
const initialState: PotState = {
  activeInteractions: {},
  
  cooldowns: {
    speak: 0,
    bless: 0,
    cowrie: 0,
    echo: 0,
  },
  
  showInteractionBar: true,
  activeInteractionType: null,
  
  showCowrieModal: false,
  cowrieModalPotId: null,
  cowrieAmount: 10,
  cowrieMessage: '',
  
  showMessageModal: false,
  messageModalPotId: null,
  messageModalType: null,
  messageText: '',
  messageVoiceUrl: null,
  
  showEchoModal: false,
  echoModalPotId: null,
  echoMessage: '',
  
  showHeatAnimation: false,
  heatAnimationPotId: null,
  heatAnimationDelta: 0,
  
  lastInteraction: null,
};

/**
 * POT slice
 */
export const potSlice = createSlice({
  name: 'pot',
  initialState,
  reducers: {
    // Record interaction
    recordInteraction: (state, action: PayloadAction<{
      potId: string;
      type: 'hear' | 'speak' | 'bless' | 'cowrie' | 'echo' | 'amplify' | 'verify' | 'ubuntu' | 'help';
    }>) => {
      const { potId, type } = action.payload;
      
      if (!state.activeInteractions[potId]) {
        state.activeInteractions[potId] = {
          hasHeard: false,
          hasSpoken: false,
          hasBlessed: false,
          hasCowried: false,
          hasEchoed: false,
        };
      }
      
      // Mark interaction as done
      switch (type) {
        case 'hear':
          state.activeInteractions[potId].hasHeard = true;
          break;
        case 'speak':
          state.activeInteractions[potId].hasSpoken = true;
          break;
        case 'bless':
          state.activeInteractions[potId].hasBlessed = true;
          break;
        case 'cowrie':
          state.activeInteractions[potId].hasCowried = true;
          break;
        case 'echo':
          state.activeInteractions[potId].hasEchoed = true;
          break;
        case 'amplify':
          state.activeInteractions[potId].hasAmplified = true;
          break;
        case 'verify':
          state.activeInteractions[potId].hasVerified = true;
          break;
        case 'ubuntu':
          state.activeInteractions[potId].hasUbuntu = true;
          break;
        case 'help':
          state.activeInteractions[potId].hasHelped = true;
          break;
      }
      
      // Record last interaction
      state.lastInteraction = {
        potId,
        type,
        timestamp: Date.now(),
      };
    },
    
    // Set cooldown
    setCooldown: (state, action: PayloadAction<{
      type: 'speak' | 'bless' | 'cowrie' | 'echo';
      seconds: number;
    }>) => {
      state.cooldowns[action.payload.type] = action.payload.seconds;
    },
    
    // Decrement cooldown
    decrementCooldown: (state, action: PayloadAction<'speak' | 'bless' | 'cowrie' | 'echo'>) => {
      if (state.cooldowns[action.payload] > 0) {
        state.cooldowns[action.payload]--;
      }
    },
    
    // Interaction bar visibility
    setShowInteractionBar: (state, action: PayloadAction<boolean>) => {
      state.showInteractionBar = action.payload;
    },
    
    toggleInteractionBar: (state) => {
      state.showInteractionBar = !state.showInteractionBar;
    },
    
    // Active interaction type
    setActiveInteractionType: (state, action: PayloadAction<'hear' | 'speak' | 'bless' | 'cowrie' | 'echo' | null>) => {
      state.activeInteractionType = action.payload;
    },
    
    // Cowrie modal
    openCowrieModal: (state, action: PayloadAction<string>) => {
      state.showCowrieModal = true;
      state.cowrieModalPotId = action.payload;
      state.cowrieAmount = 10;
      state.cowrieMessage = '';
    },
    
    closeCowrieModal: (state) => {
      state.showCowrieModal = false;
      state.cowrieModalPotId = null;
      state.cowrieAmount = 10;
      state.cowrieMessage = '';
    },
    
    setCowrieAmount: (state, action: PayloadAction<number>) => {
      state.cowrieAmount = action.payload;
    },
    
    setCowrieMessage: (state, action: PayloadAction<string>) => {
      state.cowrieMessage = action.payload;
    },
    
    // Message modal (Speak/Bless)
    openMessageModal: (state, action: PayloadAction<{
      potId: string;
      type: 'speak' | 'bless';
    }>) => {
      state.showMessageModal = true;
      state.messageModalPotId = action.payload.potId;
      state.messageModalType = action.payload.type;
      state.messageText = '';
      state.messageVoiceUrl = null;
    },
    
    closeMessageModal: (state) => {
      state.showMessageModal = false;
      state.messageModalPotId = null;
      state.messageModalType = null;
      state.messageText = '';
      state.messageVoiceUrl = null;
    },
    
    setMessageText: (state, action: PayloadAction<string>) => {
      state.messageText = action.payload;
    },
    
    setMessageVoiceUrl: (state, action: PayloadAction<string | null>) => {
      state.messageVoiceUrl = action.payload;
    },
    
    // Echo modal
    openEchoModal: (state, action: PayloadAction<string>) => {
      state.showEchoModal = true;
      state.echoModalPotId = action.payload;
      state.echoMessage = '';
    },
    
    closeEchoModal: (state) => {
      state.showEchoModal = false;
      state.echoModalPotId = null;
      state.echoMessage = '';
    },
    
    setEchoMessage: (state, action: PayloadAction<string>) => {
      state.echoMessage = action.payload;
    },
    
    // Heat animation
    triggerHeatAnimation: (state, action: PayloadAction<{
      potId: string;
      delta: number;
    }>) => {
      state.showHeatAnimation = true;
      state.heatAnimationPotId = action.payload.potId;
      state.heatAnimationDelta = action.payload.delta;
    },
    
    hideHeatAnimation: (state) => {
      state.showHeatAnimation = false;
      state.heatAnimationPotId = null;
      state.heatAnimationDelta = 0;
    },
    
    // Clear interaction state for pot
    clearPotInteractions: (state, action: PayloadAction<string>) => {
      delete state.activeInteractions[action.payload];
    },
    
    // Reset all
    resetPotState: () => initialState,
  },
});

/**
 * Actions
 */
export const {
  recordInteraction,
  setCooldown,
  decrementCooldown,
  setShowInteractionBar,
  toggleInteractionBar,
  setActiveInteractionType,
  openCowrieModal,
  closeCowrieModal,
  setCowrieAmount,
  setCowrieMessage,
  openMessageModal,
  closeMessageModal,
  setMessageText,
  setMessageVoiceUrl,
  openEchoModal,
  closeEchoModal,
  setEchoMessage,
  triggerHeatAnimation,
  hideHeatAnimation,
  clearPotInteractions,
  resetPotState,
} = potSlice.actions;

/**
 * Selectors
 */
export const selectPotInteractions = (potId: string) => (state: RootState) => 
  state.pot.activeInteractions[potId] || {
    hasHeard: false,
    hasSpoken: false,
    hasBlessed: false,
    hasCowried: false,
    hasEchoed: false,
  };

export const selectCooldowns = (state: RootState) => state.pot.cooldowns;
export const selectCooldown = (type: 'speak' | 'bless' | 'cowrie' | 'echo') => (state: RootState) => 
  state.pot.cooldowns[type];

export const selectShowInteractionBar = (state: RootState) => state.pot.showInteractionBar;
export const selectActiveInteractionType = (state: RootState) => state.pot.activeInteractionType;

export const selectShowCowrieModal = (state: RootState) => state.pot.showCowrieModal;
export const selectCowrieModalPotId = (state: RootState) => state.pot.cowrieModalPotId;
export const selectCowrieAmount = (state: RootState) => state.pot.cowrieAmount;
export const selectCowrieMessage = (state: RootState) => state.pot.cowrieMessage;

export const selectShowMessageModal = (state: RootState) => state.pot.showMessageModal;
export const selectMessageModalPotId = (state: RootState) => state.pot.messageModalPotId;
export const selectMessageModalType = (state: RootState) => state.pot.messageModalType;
export const selectMessageText = (state: RootState) => state.pot.messageText;
export const selectMessageVoiceUrl = (state: RootState) => state.pot.messageVoiceUrl;

export const selectShowEchoModal = (state: RootState) => state.pot.showEchoModal;
export const selectEchoModalPotId = (state: RootState) => state.pot.echoModalPotId;
export const selectEchoMessage = (state: RootState) => state.pot.echoMessage;

export const selectShowHeatAnimation = (state: RootState) => state.pot.showHeatAnimation;
export const selectHeatAnimationPotId = (state: RootState) => state.pot.heatAnimationPotId;
export const selectHeatAnimationDelta = (state: RootState) => state.pot.heatAnimationDelta;

export const selectLastInteraction = (state: RootState) => state.pot.lastInteraction;

/**
 * Reducer
 */
export default potSlice.reducer;
// src/store/slices/tvSlice.ts
// Jollof TV & Sorosoke State Management

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

/**
 * TV mode types
 */
type TVMode = 'bubble' | 'half-screen' | 'floating' | 'native-pip' | 'fullscreen';

/**
 * TV state interface
 */
interface TVState {
  // Player state
  player: {
    isActive: boolean;
    channelId: string | null;
    programId: string | null;
    mode: TVMode;
    isPlaying: boolean;
    isMuted: boolean;
    volume: number;
    quality: 'auto' | '360p' | '480p' | '720p' | '1080p';
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  
  // Current program
  currentProgram: {
    title: string | null;
    description: string | null;
    startTime: string | null;
    endTime: string | null;
    isVillageHour: boolean;
  };
  
  // Viewer session
  viewerSession: {
    startedAt: number | null;
    interacted: boolean;
    cowrieDropped: number;
  };
  
  // Channel filters
  channelFilters: {
    type?: 'village' | 'region' | 'national' | 'pan-african' | 'community';
    villageId?: string;
    isLive?: boolean;
  };
  
  // TV booking
  booking: {
    showModal: boolean;
    channelId: string | null;
    selectedDate: string | null;
    selectedTimeSlot: { start: string; end: string } | null;
    programTitle: string;
    description: string;
  };
  
  // Sorosoke (Call-in system)
  sorosoke: {
    // Active session
    sessionId: string | null;
    isActive: boolean;
    
    // User's call state
    userCall: {
      callId: string | null;
      status: 'none' | 'queued' | 'live' | 'ended' | 'rejected';
      queuePosition: number | null;
      estimatedWaitTime: number | null;
    };
    
    // Call modal
    showCallModal: boolean;
    callType: 'voice' | 'video' | 'text';
    callQuestion: string;
    
    // Bundle purchase
    showBundleModal: boolean;
    selectedBundle: 'single' | '5-pack' | '10-pack' | '20-pack' | null;
    
    // Moderator view (for hosts)
    moderatorMode: boolean;
    callQueue: any[];
    liveCallers: any[];
    
    // Respect filter
    respectFilter: {
      enabled: boolean;
      strictness: 'low' | 'medium' | 'high';
    };
    
    // DJ Telemetry (live metrics)
    telemetry: {
      viewerCount: number;
      queueLength: number;
      avgWaitTime: number;
      totalHeat: number;
    };
  };
  
  // Cowrie rain
  showCowrieRain: boolean;
  cowrieRainAmount: number;
  
  // Schedule view
  showSchedule: boolean;
  scheduleDate: string | null;
}

/**
 * Initial state
 */
const initialState: TVState = {
  player: {
    isActive: false,
    channelId: null,
    programId: null,
    mode: 'bubble',
    isPlaying: false,
    isMuted: false,
    volume: 80,
    quality: 'auto',
    position: {
      x: 20,
      y: 80,
      width: 200,
      height: 150,
    },
  },
  
  currentProgram: {
    title: null,
    description: null,
    startTime: null,
    endTime: null,
    isVillageHour: false,
  },
  
  viewerSession: {
    startedAt: null,
    interacted: false,
    cowrieDropped: 0,
  },
  
  channelFilters: {},
  
  booking: {
    showModal: false,
    channelId: null,
    selectedDate: null,
    selectedTimeSlot: null,
    programTitle: '',
    description: '',
  },
  
  sorosoke: {
    sessionId: null,
    isActive: false,
    
    userCall: {
      callId: null,
      status: 'none',
      queuePosition: null,
      estimatedWaitTime: null,
    },
    
    showCallModal: false,
    callType: 'voice',
    callQuestion: '',
    
    showBundleModal: false,
    selectedBundle: null,
    
    moderatorMode: false,
    callQueue: [],
    liveCallers: [],
    
    respectFilter: {
      enabled: true,
      strictness: 'medium',
    },
    
    telemetry: {
      viewerCount: 0,
      queueLength: 0,
      avgWaitTime: 0,
      totalHeat: 0,
    },
  },
  
  showCowrieRain: false,
  cowrieRainAmount: 0,
  
  showSchedule: false,
  scheduleDate: null,
};

/**
 * TV slice
 */
export const tvSlice = createSlice({
  name: 'tv',
  initialState,
  reducers: {
    // Player control
    startTV: (state, action: PayloadAction<{ channelId: string; mode?: TVMode }>) => {
      state.player.isActive = true;
      state.player.channelId = action.payload.channelId;
      state.player.mode = action.payload.mode || 'bubble';
      state.player.isPlaying = true;
      state.viewerSession.startedAt = Date.now();
    },
    
    stopTV: (state) => {
      state.player.isActive = false;
      state.player.channelId = null;
      state.player.programId = null;
      state.player.isPlaying = false;
      state.viewerSession.startedAt = null;
    },
    
    changeChannel: (state, action: PayloadAction<string>) => {
      state.player.channelId = action.payload;
      state.player.programId = null;
    },
    
    setTVMode: (state, action: PayloadAction<TVMode>) => {
      state.player.mode = action.payload;
      
      // Adjust position based on mode
      switch (action.payload) {
        case 'bubble':
          state.player.position = { x: 20, y: 80, width: 200, height: 150 };
          break;
        case 'half-screen':
          state.player.position = { x: 0, y: 50, width: 50, height: 50 };
          break;
        case 'floating':
          state.player.position = { x: 70, y: 70, width: 25, height: 25 };
          break;
        case 'fullscreen':
          state.player.position = { x: 0, y: 0, width: 100, height: 100 };
          break;
      }
    },
    
    togglePlay: (state) => {
      state.player.isPlaying = !state.player.isPlaying;
    },
    
    toggleMute: (state) => {
      state.player.isMuted = !state.player.isMuted;
    },
    
    setVolume: (state, action: PayloadAction<number>) => {
      state.player.volume = Math.max(0, Math.min(100, action.payload));
    },
    
    setQuality: (state, action: PayloadAction<'auto' | '360p' | '480p' | '720p' | '1080p'>) => {
      state.player.quality = action.payload;
    },
    
    setPlayerPosition: (state, action: PayloadAction<Partial<TVState['player']['position']>>) => {
      state.player.position = { ...state.player.position, ...action.payload };
    },
    
    // Current program
    setCurrentProgram: (state, action: PayloadAction<Partial<TVState['currentProgram']>>) => {
      state.currentProgram = { ...state.currentProgram, ...action.payload };
    },
    
    // Viewer interaction
    recordViewerInteraction: (state) => {
      state.viewerSession.interacted = true;
    },
    
    addCowrieDropped: (state, action: PayloadAction<number>) => {
      state.viewerSession.cowrieDropped += action.payload;
    },
    
    // Channel filters
    setChannelFilters: (state, action: PayloadAction<Partial<TVState['channelFilters']>>) => {
      state.channelFilters = { ...state.channelFilters, ...action.payload };
    },
    
    clearChannelFilters: (state) => {
      state.channelFilters = {};
    },
    
    // TV booking
    openBookingModal: (state, action: PayloadAction<string>) => {
      state.booking.showModal = true;
      state.booking.channelId = action.payload;
    },
    
    closeBookingModal: (state) => {
      state.booking = {
        showModal: false,
        channelId: null,
        selectedDate: null,
        selectedTimeSlot: null,
        programTitle: '',
        description: '',
      };
    },
    
    updateBookingData: (state, action: PayloadAction<Partial<TVState['booking']>>) => {
      state.booking = { ...state.booking, ...action.payload };
    },
    
    // Sorosoke session
    startSorosokeSession: (state, action: PayloadAction<string>) => {
      state.sorosoke.sessionId = action.payload;
      state.sorosoke.isActive = true;
    },
    
    endSorosokeSession: (state) => {
      state.sorosoke.sessionId = null;
      state.sorosoke.isActive = false;
      state.sorosoke.userCall = {
        callId: null,
        status: 'none',
        queuePosition: null,
        estimatedWaitTime: null,
      };
    },
    
    // User call
    updateUserCall: (state, action: PayloadAction<Partial<TVState['sorosoke']['userCall']>>) => {
      state.sorosoke.userCall = { ...state.sorosoke.userCall, ...action.payload };
    },
    
    // Call modal
    openCallModal: (state) => {
      state.sorosoke.showCallModal = true;
      state.sorosoke.callQuestion = '';
    },
    
    closeCallModal: (state) => {
      state.sorosoke.showCallModal = false;
      state.sorosoke.callQuestion = '';
    },
    
    setCallType: (state, action: PayloadAction<'voice' | 'video' | 'text'>) => {
      state.sorosoke.callType = action.payload;
    },
    
    setCallQuestion: (state, action: PayloadAction<string>) => {
      state.sorosoke.callQuestion = action.payload;
    },
    
    // Bundle modal
    openBundleModal: (state) => {
      state.sorosoke.showBundleModal = true;
    },
    
    closeBundleModal: (state) => {
      state.sorosoke.showBundleModal = false;
      state.sorosoke.selectedBundle = null;
    },
    
    selectBundle: (state, action: PayloadAction<'single' | '5-pack' | '10-pack' | '20-pack'>) => {
      state.sorosoke.selectedBundle = action.payload;
    },
    
    // Moderator mode
    toggleModeratorMode: (state) => {
      state.sorosoke.moderatorMode = !state.sorosoke.moderatorMode;
    },
    
    updateCallQueue: (state, action: PayloadAction<any[]>) => {
      state.sorosoke.callQueue = action.payload;
    },
    
    updateLiveCallers: (state, action: PayloadAction<any[]>) => {
      state.sorosoke.liveCallers = action.payload;
    },
    
    // Respect filter
    updateRespectFilter: (state, action: PayloadAction<Partial<TVState['sorosoke']['respectFilter']>>) => {
      state.sorosoke.respectFilter = { ...state.sorosoke.respectFilter, ...action.payload };
    },
    
    // Telemetry
    updateTelemetry: (state, action: PayloadAction<Partial<TVState['sorosoke']['telemetry']>>) => {
      state.sorosoke.telemetry = { ...state.sorosoke.telemetry, ...action.payload };
    },
    
    // Cowrie rain
    triggerTVCowrieRain: (state, action: PayloadAction<number>) => {
      state.showCowrieRain = true;
      state.cowrieRainAmount = action.payload;
    },
    
    hideTVCowrieRain: (state) => {
      state.showCowrieRain = false;
      state.cowrieRainAmount = 0;
    },
    
    // Schedule
    toggleSchedule: (state) => {
      state.showSchedule = !state.showSchedule;
    },
    
    setScheduleDate: (state, action: PayloadAction<string | null>) => {
      state.scheduleDate = action.payload;
    },
    
    // Reset all
    resetTVState: () => initialState,
  },
});

/**
 * Actions
 */
export const {
  startTV,
  stopTV,
  changeChannel,
  setTVMode,
  togglePlay,
  toggleMute,
  setVolume,
  setQuality,
  setPlayerPosition,
  setCurrentProgram,
  recordViewerInteraction,
  addCowrieDropped,
  setChannelFilters,
  clearChannelFilters,
  openBookingModal,
  closeBookingModal,
  updateBookingData,
  startSorosokeSession,
  endSorosokeSession,
  updateUserCall,
  openCallModal,
  closeCallModal,
  setCallType,
  setCallQuestion,
  openBundleModal,
  closeBundleModal,
  selectBundle,
  toggleModeratorMode,
  updateCallQueue,
  updateLiveCallers,
  updateRespectFilter,
  updateTelemetry,
  triggerTVCowrieRain,
  hideTVCowrieRain,
  toggleSchedule,
  setScheduleDate,
  resetTVState,
} = tvSlice.actions;

/**
 * Selectors
 */
export const selectTVPlayer = (state: RootState) => state.tv.player;
export const selectCurrentProgram = (state: RootState) => state.tv.currentProgram;
export const selectViewerSession = (state: RootState) => state.tv.viewerSession;
export const selectChannelFilters = (state: RootState) => state.tv.channelFilters;
export const selectBooking = (state: RootState) => state.tv.booking;
export const selectSorosoke = (state: RootState) => state.tv.sorosoke;
export const selectUserCall = (state: RootState) => state.tv.sorosoke.userCall;
export const selectModeratorMode = (state: RootState) => state.tv.sorosoke.moderatorMode;
export const selectTelemetry = (state: RootState) => state.tv.sorosoke.telemetry;
export const selectShowTVCowrieRain = (state: RootState) => state.tv.showCowrieRain;
export const selectTVCowrieRainAmount = (state: RootState) => state.tv.cowrieRainAmount;
export const selectShowSchedule = (state: RootState) => state.tv.showSchedule;
export const selectScheduleDate = (state: RootState) => state.tv.scheduleDate;

/**
 * Reducer
 */
export default tvSlice.reducer;
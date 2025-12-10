import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QueuedAction {
  id: string;
  type: 'message' | 'post' | 'upload' | 'transaction' | 'update';
  action: string;
  timestamp: Date;
  status: 'pending' | 'syncing' | 'success' | 'failed';
  retryCount: number;
  data: any;
  error?: string;
}

interface SyncState {
  queue: QueuedAction[];
  isPaused: boolean;
  isOnline: boolean;
}

const initialState: SyncState = {
  queue: [],
  isPaused: false,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
};

export const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    addToQueue: (state, action: PayloadAction<QueuedAction>) => {
      state.queue.push(action.payload);
    },
    
    updateActionStatus: (state, action: PayloadAction<{
      id: string;
      status: 'pending' | 'syncing' | 'success' | 'failed';
      error?: string;
      retryCount?: number;
    }>) => {
      const queuedAction = state.queue.find(a => a.id === action.payload.id);
      if (queuedAction) {
        queuedAction.status = action.payload.status;
        if (action.payload.error) {
          queuedAction.error = action.payload.error;
        }
        if (action.payload.retryCount !== undefined) {
          queuedAction.retryCount = action.payload.retryCount;
        }
      }
    },
    
    removeFromQueue: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter(a => a.id !== action.payload);
    },
    
    clearSuccessful: (state) => {
      state.queue = state.queue.filter(a => a.status !== 'success');
    },
    
    clearQueue: (state) => {
      state.queue = [];
    },
    
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    
    setPauseStatus: (state, action: PayloadAction<boolean>) => {
      state.isPaused = action.payload;
    },
  },
});

export const {
  addToQueue,
  updateActionStatus,
  removeFromQueue,
  clearSuccessful,
  clearQueue,
  setOnlineStatus,
  setPauseStatus,
} = syncSlice.actions;

export default syncSlice.reducer;
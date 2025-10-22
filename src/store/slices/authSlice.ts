import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '@/types/auth.types';

const initialState: AuthState = {
  step: 'splash',
  isAuthenticated: false,
  isLoading: false,
  error: null,
  sessionId: null,
  userId: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<AuthState['step']>) => {
      state.step = action.payload;
      state.error = null;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    
    setTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        userId: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
      state.error = null;
    },
    
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
      state.isAuthenticated = false;
    },
    
    logout: (state) => {
      return { ...initialState, step: 'splash' };
    },
    
    resetAuth: () => initialState,
  },
});

export const {
  setStep,
  setLoading,
  setError,
  setSessionId,
  setTokens,
  clearTokens,
  logout,
  resetAuth,
} = authSlice.actions;

export default authSlice.reducer;
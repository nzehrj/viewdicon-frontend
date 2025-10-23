import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthStep = 
  | 'splash'
  | 'greeting'
  | 'terms'
  | 'consent'
  | 'phone'
  | 'otp'
  | 'three-circles'
  | 'heritage'
  | 'heritage-challenge'
  | 'device'
  | 'fingerprint'
  | 'face'
  | 'kyc'
  | 'voice-phrase'
  | 'voice-auth'
  | 'family-tree'
  | 'village';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  phoneNumber: string | null;
  userLocation: 'africa' | 'diaspora' | 'other' | null;
  userRole: string | null;
  userVillage: string | null;
  userName: string | null;
  selectedCircle: 'C1' | 'C2' | 'C3' | null;
  step: AuthStep;
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
  phoneNumber: null,
  userLocation: null,
  userRole: null,
  userVillage: null,
  userName: null,
  selectedCircle: null,
  step: 'splash',
  accessToken: null,
  refreshToken: null,
  userId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    setUserLocation: (state, action: PayloadAction<'africa' | 'diaspora' | 'other'>) => {
      state.userLocation = action.payload;
    },
    setUserRole: (state, action: PayloadAction<string>) => {
      state.userRole = action.payload;
    },
    setUserVillage: (state, action: PayloadAction<string>) => {
      state.userVillage = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setSelectedCircle: (state, action: PayloadAction<'C1' | 'C2' | 'C3'>) => {
      state.selectedCircle = action.payload;
    },
    setStep: (state, action: PayloadAction<AuthStep>) => {
      state.step = action.payload;
    },
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string; userId: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: () => {
      return initialState;
    },
  },
});

export const {
  setAuthenticated,
  setLoading,
  setError,
  setPhoneNumber,
  setUserLocation,
  setUserRole,
  setUserVillage,
  setUserName,
  setSelectedCircle,
  setStep,
  setTokens,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
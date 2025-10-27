import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthFlowStep = 
  | 'splash' 
  | 'greeting' 
  | 'terms' 
  | 'consent' 
  | 'phone' 
  | 'otp' 
  | 'fingerprint' 
  | 'voice' 
  | 'village' 
  | 'afro-id-welcome'    // ← ADDED THIS
  | 'circle_resolve' 
  | 'dashboard';

interface AuthFlowState {
  currentStep: AuthFlowStep;
  completedSteps: AuthFlowStep[];
  consentToken?: string;
  sessionId?: string;
  deviceId?: string;
  voiceNonceId?: string;
  selectedVillage?: string;
  selectedRole?: string;
  circleGate?: 'C1' | 'C2' | 'C3';
  canProceed: boolean;
  progress: number;
}

const initialState: AuthFlowState = {
  currentStep: 'splash',
  completedSteps: [],
  canProceed: true,
  progress: 0,
};

const authFlowSlice = createSlice({
  name: 'authFlow',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<AuthFlowStep>) => {
      state.currentStep = action.payload;
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload);
      }
      state.progress = Math.round((state.completedSteps.length / 11) * 100);  // ← UPDATED: 11 steps now
    },
    nextStep: (state) => {
      const steps: AuthFlowStep[] = [
        'splash', 
        'greeting', 
        'terms', 
        'consent', 
        'phone', 
        'otp', 
        'fingerprint', 
        'voice', 
        'village', 
        'afro-id-welcome',    // ← ADDED THIS
        'circle_resolve', 
        'dashboard'
      ];
      const currentIndex = steps.indexOf(state.currentStep);
      if (currentIndex < steps.length - 1) {
        const nextStep = steps[currentIndex + 1];
        state.currentStep = nextStep;
        if (!state.completedSteps.includes(nextStep)) {
          state.completedSteps.push(nextStep);
        }
        state.progress = Math.round((state.completedSteps.length / 11) * 100);  // ← UPDATED: 11 steps now
      }
    },
    previousStep: (state) => {
      const steps: AuthFlowStep[] = [
        'splash', 
        'greeting', 
        'terms', 
        'consent', 
        'phone', 
        'otp', 
        'fingerprint', 
        'voice', 
        'village', 
        'afro-id-welcome',    // ← ADDED THIS
        'circle_resolve', 
        'dashboard'
      ];
      const currentIndex = steps.indexOf(state.currentStep);
      if (currentIndex > 0) {
        state.currentStep = steps[currentIndex - 1];
      }
    },
    setConsentToken: (state, action: PayloadAction<string>) => {
      state.consentToken = action.payload;
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    setDeviceId: (state, action: PayloadAction<string>) => {
      state.deviceId = action.payload;
    },
    setVoiceNonceId: (state, action: PayloadAction<string>) => {
      state.voiceNonceId = action.payload;
    },
    setSelectedVillage: (state, action: PayloadAction<string>) => {
      state.selectedVillage = action.payload;
    },
    setSelectedRole: (state, action: PayloadAction<string>) => {
      state.selectedRole = action.payload;
    },
    setCircleGate: (state, action: PayloadAction<'C1' | 'C2' | 'C3'>) => {
      state.circleGate = action.payload;
    },
    setCanProceed: (state, action: PayloadAction<boolean>) => {
      state.canProceed = action.payload;
    },
    resetAuthFlow: () => initialState,
  },
});

export const { 
  setCurrentStep, 
  nextStep, 
  previousStep, 
  setConsentToken, 
  setSessionId, 
  setDeviceId, 
  setVoiceNonceId, 
  setSelectedVillage, 
  setSelectedRole, 
  setCircleGate, 
  setCanProceed, 
  resetAuthFlow 
} = authFlowSlice.actions;

export default authFlowSlice.reducer;
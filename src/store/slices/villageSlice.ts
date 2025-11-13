import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VillageId, GuildId, UserVillageState, ShieldColor, RealmLevel } from '@/types/village.types';

interface VillageState {
  userVillageState: UserVillageState | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: VillageState = {
  userVillageState: null,
  isLoading: false,
  error: null,
};

const villageSlice = createSlice({
  name: 'village',
  initialState,
  reducers: {
    setUserVillageState: (state, action: PayloadAction<UserVillageState>) => {
      state.userVillageState = action.payload;
    },

    updateActiveVillage: (state, action: PayloadAction<{ villageId: VillageId; guildId: GuildId }>) => {
      if (state.userVillageState) {
        state.userVillageState.activeVillageId = action.payload.villageId;
        state.userVillageState.activeGuildId = action.payload.guildId;
        state.userVillageState.joinedVillageAt = new Date();
        state.userVillageState.crestTier = 0; // Reset crest for new guild
      }
    },

    updateShield: (state, action: PayloadAction<{ color: ShieldColor; reasons: string[] }>) => {
      if (state.userVillageState) {
        state.userVillageState.shieldColor = action.payload.color;
        state.userVillageState.shieldReasons = action.payload.reasons;
      }
    },

    updateCrest: (state, action: PayloadAction<number>) => {
      if (state.userVillageState) {
        state.userVillageState.crestTier = action.payload;
      }
    },

    updateHonor: (state, action: PayloadAction<{ realm: RealmLevel; level: number; xp: number }>) => {
      if (state.userVillageState) {
        state.userVillageState.honorRealm = action.payload.realm;
        state.userVillageState.honorLevel = action.payload.level;
        state.userVillageState.xp = action.payload.xp;
      }
    },

    incrementJobsCompleted: (state) => {
      if (state.userVillageState) {
        state.userVillageState.jobsCompleted += 1;
      }
    },

    addCowriesEarned: (state, action: PayloadAction<number>) => {
      if (state.userVillageState) {
        state.userVillageState.totalCowriesEarned += action.payload;
      }
    },

    incrementComplaints: (state) => {
      if (state.userVillageState) {
        state.userVillageState.complaintCount += 1;
      }
    },

    incrementBlessings: (state) => {
      if (state.userVillageState) {
        state.userVillageState.blessingCount += 1;
      }
    },

    setVerified: (state, action: PayloadAction<{ verified: boolean; proof?: string[] }>) => {
      if (state.userVillageState) {
        state.userVillageState.verified = action.payload.verified;
        if (action.payload.proof) {
          state.userVillageState.verificationProof = action.payload.proof;
        }
      }
    },

    lockVillageSwitch: (state, action: PayloadAction<Date>) => {
      if (state.userVillageState) {
        state.userVillageState.switchLockedUntil = action.payload;
      }
    },

    clearVillageState: (state) => {
      state.userVillageState = null;
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUserVillageState,
  updateActiveVillage,
  updateShield,
  updateCrest,
  updateHonor,
  incrementJobsCompleted,
  addCowriesEarned,
  incrementComplaints,
  incrementBlessings,
  setVerified,
  lockVillageSwitch,
  clearVillageState,
  setLoading,
  setError,
} = villageSlice.actions;

export default villageSlice.reducer;
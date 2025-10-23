import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  user: {
    id: string | null;
    phoneNumber: string | null;
    name: string | null;
    full_name: string | null;
    afro_id: string | null;
    role_name: string | null;
    role_id: string | null;
    iwa_score: number | null;
    sankofa_totem: string | null;
    kinship_tier: 'continental_african' | 'african_diaspora' | 'global_partner' | null;
  } | null;
  village: {
    villageId: string;
    villageName: string;
  } | null;
  role: {
    roleId: string;
    roleName: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  village: null,
  role: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{
      id: string;
      phoneNumber: string;
      name?: string;
      full_name?: string;
      afro_id?: string;
      role_name?: string;
      role_id?: string;
      iwa_score?: number;
      sankofa_totem?: string;
      kinship_tier?: 'continental_african' | 'african_diaspora' | 'global_partner';
    }>) => {
      state.user = {
        id: action.payload.id,
        phoneNumber: action.payload.phoneNumber,
        name: action.payload.name || null,
        full_name: action.payload.full_name || null,
        afro_id: action.payload.afro_id || null,
        role_name: action.payload.role_name || null,
        role_id: action.payload.role_id || null,
        iwa_score: action.payload.iwa_score || null,
        sankofa_totem: action.payload.sankofa_totem || null,
        kinship_tier: action.payload.kinship_tier || null,
      };
      state.error = null;
    },
    setUserVillage: (state, action: PayloadAction<{ villageId: string; villageName: string }>) => {
      state.village = action.payload;
    },
    setUserRole: (state, action: PayloadAction<{ roleId: string; roleName: string }>) => {
      state.role = action.payload;
      // Also update user.role_id and user.role_name if user exists
      if (state.user) {
        state.user.role_id = action.payload.roleId;
        state.user.role_name = action.payload.roleName;
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<{
      name: string;
      full_name: string;
      afro_id: string;
      iwa_score: number;
      sankofa_totem: string;
      kinship_tier: 'continental_african' | 'african_diaspora' | 'global_partner';
    }>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.village = null;
      state.role = null;
      state.error = null;
    },
  },
});

export const {
  setUser,
  setUserVillage,
  setUserRole,
  updateUserProfile,
  setLoading,
  setError,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;
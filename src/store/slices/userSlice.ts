import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/user.types';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  selectedVillage: {
    villageId: string;
    villageName: string;
  } | null;
  selectedRole: {
    roleId: string;
    roleName: string;
  } | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
  selectedVillage: null,
  selectedRole: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set user after successful login
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    // Clear entire user state (for logout)
    clearUser: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
      state.selectedVillage = null;
      state.selectedRole = null;
    },

    setUserVillage: (
      state,
      action: PayloadAction<{ villageId: string; villageName: string }>
    ) => {
      state.selectedVillage = action.payload;
    },

    setUserRole: (
      state,
      action: PayloadAction<{ roleId: string; roleName: string }>
    ) => {
      state.selectedRole = action.payload;
    },

    clearUserSelection: (state) => {
      state.selectedVillage = null;
      state.selectedRole = null;
    },
  },
});

export const {
  setUser,
  clearUser,
  setUserVillage,
  setUserRole,
  clearUserSelection,
} = userSlice.actions;

export default userSlice.reducer;
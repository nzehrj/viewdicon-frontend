import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  user: {
    id: string | null;
    phoneNumber: string | null;
    name: string | null;
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
    setUser: (state, action: PayloadAction<{ id: string; phoneNumber: string; name?: string }>) => {
      state.user = {
        id: action.payload.id,
        phoneNumber: action.payload.phoneNumber,
        name: action.payload.name || null,
      };
      state.error = null;
    },
    setUserVillage: (state, action: PayloadAction<{ villageId: string; villageName: string }>) => {
      state.village = action.payload;
    },
    setUserRole: (state, action: PayloadAction<{ roleId: string; roleName: string }>) => {
      state.role = action.payload;
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
  setLoading,
  setError,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;

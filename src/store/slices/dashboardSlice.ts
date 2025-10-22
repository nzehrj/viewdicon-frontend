import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RoleManifest } from '@/types/role.types';

interface DashboardState {
  manifest: RoleManifest | null;
  selectedTool: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  manifest: null,
  selectedTool: null,
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setManifest: (state, action: PayloadAction<RoleManifest>) => {
      state.manifest = action.payload;
      state.error = null;
    },
    setSelectedTool: (state, action: PayloadAction<string | null>) => {
      state.selectedTool = action.payload;
    },
    setDashboardLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setDashboardError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearDashboard: (state) => {
      state.manifest = null;
      state.selectedTool = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { setManifest, setSelectedTool, setDashboardLoading, setDashboardError, clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
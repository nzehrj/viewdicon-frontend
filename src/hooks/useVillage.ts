import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setManifest, setDashboardLoading, setDashboardError } from '@store/slices/dashboardSlice';
import { roleApi } from '@services/api';

export const useVillage = () => {
  const dispatch = useAppDispatch();
  const manifest = useAppSelector((state) => state.dashboard.manifest);
  const selectedTool = useAppSelector((state) => state.dashboard.selectedTool);
  const isLoading = useAppSelector((state) => state.dashboard.isLoading);
  const user = useAppSelector((state) => state.user.user);

  const loadManifest = useCallback(async (roleId: string) => {
    dispatch(setDashboardLoading(true));
    
    try {
      const manifestData = await roleApi.getRoleManifest(roleId);
      dispatch(setManifest(manifestData));
    } catch (error) {
      console.error('Failed to load manifest:', error);
      dispatch(setDashboardError('Failed to load role manifest'));
    } finally {
      dispatch(setDashboardLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user?.role_id && !manifest) {
      loadManifest(user.role_id);
    }
  }, [user?.role_id, manifest, loadManifest]);

  return {
    manifest,
    selectedTool,
    isLoading,
    loadManifest,
  };
};
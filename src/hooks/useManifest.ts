import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { setManifest, setSelectedTool } from '@store/slices/dashboardSlice';
import { roleApi } from '@services/api';
import type { Tool } from '@/types/role.types';

/**
 * Hook for role manifest and tools
 */
export const useManifest = () => {
  const dispatch = useAppDispatch();
  const manifest = useAppSelector((state) => state.dashboard.manifest);
  const selectedTool = useAppSelector((state) => state.dashboard.selectedTool);

  const loadManifest = useCallback(async (roleId: string) => {
    try {
      const manifestData = await roleApi.getRoleManifest(roleId);
      dispatch(setManifest(manifestData));
      return manifestData;
    } catch (error) {
      console.error('Failed to load manifest:', error);
      return null;
    }
  }, [dispatch]);

  const selectTool = useCallback((toolId: string) => {
    dispatch(setSelectedTool(toolId));
  }, [dispatch]);

  const getToolById = useCallback((toolId: string): Tool | null => {
    if (!manifest?.tools) return null;
    return manifest.tools.find(tool => tool.id === toolId) || null;
  }, [manifest]);

  const tools = useMemo(() => {
    return manifest?.tools || [];
  }, [manifest]);

  const currentTool = useMemo(() => {
    if (!selectedTool || !manifest?.tools) return null;
    return manifest.tools.find(tool => tool.id === selectedTool) || null;
  }, [selectedTool, manifest]);

  const hasAccess = useCallback((toolId: string): boolean => {
    const tool = getToolById(toolId);
    if (!tool) return false;

    // All tools in a user's manifest are accessible by default
    // In a real implementation, you might have additional access checks
    // based on IWA score, subscription level, etc.
    return true;
  }, [getToolById]);

  return {
    manifest,
    tools,
    selectedTool: currentTool,
    loadManifest,
    selectTool,
    getToolById,
    hasAccess,
  };
};
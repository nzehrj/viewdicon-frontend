import { apiClient } from './client';
import type { CircleResolveResponse, FamilyGateStatusResponse } from '@/types/api.types';

export const dashboardApi = {
  // Get circle resolution (C1/C2/C3)
  getCircleResolution: async (userId: string): Promise<CircleResolveResponse> => {
    return apiClient.get(`/v1/policy/family_gate/${userId}`);
  },

  // Get family gate status (C1)
  getFamilyGateStatus: async (treeId: string): Promise<FamilyGateStatusResponse> => {
    return apiClient.get(`/v1/family/status/${treeId}`);
  },

  // Get dashboard data
  getDashboardData: async (userId: string): Promise<any> => {
    return apiClient.get(`/v1/dashboard/${userId}`);
  },

  // Get notifications
  getNotifications: async (userId: string): Promise<any[]> => {
    return apiClient.get(`/v1/notifications/${userId}`);
  },

  // Mark notification as read
  markNotificationRead: async (notificationId: string): Promise<void> => {
    return apiClient.patch(`/v1/notifications/${notificationId}/read`);
  },
};

export default dashboardApi;
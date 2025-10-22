import { apiClient } from './client';
import { GRIOT } from '@config/services.config';
import type { User, UserProfile, UserRegistry } from '@/types/user.types';

export const userApi = {
  // Get user profile
  getProfile: async (userId: string): Promise<UserProfile> => {
    return apiClient.get(`/v1/user/profile/${userId}`);
  },

  // Get user registry
  getUserRegistry: async (afroId: string): Promise<UserRegistry> => {
    const url = GRIOT.ENDPOINTS.GET_USER_REGISTRY.replace(':afro_id', afroId);
    return apiClient.get(`${GRIOT.BASE}${url}`);
  },

  // Update user profile
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    return apiClient.put(`/v1/user/profile/${userId}`, data);
  },

  // Get user stats
  getUserStats: async (userId: string): Promise<any> => {
    return apiClient.get(`/v1/user/stats/${userId}`);
  },
};

export default userApi;
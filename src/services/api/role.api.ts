import { apiClient } from './client';
import { GRIOT } from '@config/services.config';
import type { RoleManifest } from '@/types/role.types';
import type { KinshipTierResponse, GlobalPoliciesResponse } from '@/types/griot.types';

export const roleApi = {
  // Get role manifest
  getRoleManifest: async (roleId: string): Promise<RoleManifest> => {
    const url = GRIOT.ENDPOINTS.GET_ROLE_MANIFEST.replace(':role_id', roleId);
    return apiClient.get(`${GRIOT.BASE}${url}`);
  },

  // Get kinship tier
  getKinshipTier: async (userId: string): Promise<KinshipTierResponse> => {
    const url = GRIOT.ENDPOINTS.GET_KINSHIP_TIER.replace(':user_id', userId);
    return apiClient.get(`${GRIOT.BASE}${url}`);
  },

  // Get global policies
  getGlobalPolicies: async (): Promise<GlobalPoliciesResponse> => {
    return apiClient.get(`${GRIOT.BASE}${GRIOT.ENDPOINTS.GET_GLOBAL_POLICIES}`);
  },

  // Validate Afro ID
  validateAfroId: async (afroId: string): Promise<{ valid: boolean; exists: boolean }> => {
    return apiClient.post(`${GRIOT.BASE}${GRIOT.ENDPOINTS.VALIDATE_AFRO_ID}`, { afro_id: afroId });
  },
};

export default roleApi;
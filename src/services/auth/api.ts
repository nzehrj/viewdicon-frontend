import { apiClient } from '@services/api/client';
import { AUTH_FLOW } from '@config/services.config';
import type {
  LoginStartRequest,
  LoginStartResponse,
  LoginVerifyRequest,
  LoginVerifyResponse,
} from '@/types/auth.types';

export const loginStart = async (data: LoginStartRequest): Promise<LoginStartResponse> => {
  return apiClient.post(`${AUTH_FLOW.BASE}${AUTH_FLOW.ENDPOINTS.LOGIN_START}`, data);
};

export const loginVerify = async (data: LoginVerifyRequest): Promise<LoginVerifyResponse> => {
  return apiClient.post(`${AUTH_FLOW.BASE}${AUTH_FLOW.ENDPOINTS.LOGIN_VERIFY}`, data);
};
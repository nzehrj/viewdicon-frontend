import { apiClient } from './client';
import { AUTH_FLOW } from '@config/services.config';
import type {
  LoginStartRequest,
  LoginStartResponse,
  LoginVerifyRequest,
  LoginVerifyResponse,
  ConsentBundleResponse,
  ConsentAgreeRequest,
  ConsentAgreeResponse,
  PresenceCheckRequest,
  PresenceCheckResponse,
  GreetingResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types/auth.types';

// Create auth API client instance
const authClient = new (apiClient.constructor as any)(AUTH_FLOW.BASE);

export const authApi = {
  // Get greeting
  getGreeting: async (timezone?: string): Promise<GreetingResponse> => {
    return authClient.get(AUTH_FLOW.ENDPOINTS.LANG_GREET, {
      params: { tz: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone },
    });
  },

  // Get consent bundle
  getConsentBundle: async (): Promise<ConsentBundleResponse> => {
    return authClient.get(AUTH_FLOW.ENDPOINTS.CONSENT_BUNDLE);
  },

  // Agree to consent
  agreeToConsent: async (data: ConsentAgreeRequest): Promise<ConsentAgreeResponse> => {
    return authClient.post(AUTH_FLOW.ENDPOINTS.CONSENT_AGREE, data);
  },

  // Check presence (PoST)
  checkPresence: async (data: PresenceCheckRequest): Promise<PresenceCheckResponse> => {
    return authClient.post(AUTH_FLOW.ENDPOINTS.PRESENCE_CHECK, data);
  },

  // Verify presence
  verifyPresence: async (data: any): Promise<any> => {
    return authClient.post(AUTH_FLOW.ENDPOINTS.PRESENCE_VERIFY, data);
  },

  // Start login (send OTP)
  startLogin: async (data: LoginStartRequest): Promise<LoginStartResponse> => {
    return authClient.post(AUTH_FLOW.ENDPOINTS.LOGIN_START, data);
  },

  // Verify login (verify OTP)
  verifyLogin: async (data: LoginVerifyRequest): Promise<LoginVerifyResponse> => {
    return authClient.post(AUTH_FLOW.ENDPOINTS.LOGIN_VERIFY, data);
  },

  // Refresh token
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    return authClient.post('/auth/refresh', data);
  },

  // Logout
  logout: async (): Promise<void> => {
    return authClient.post('/auth/logout');
  },
};

export default authApi;
// Authentication & Onboarding Types

export type AuthStep = 
  | 'splash'
  | 'greeting'
  | 'terms'
  | 'consent'
  | 'phone'
  | 'otp'
  | 'fingerprint'
  | 'voice'
  | 'village'
  | 'circle_resolve'
  | 'dashboard';

export interface AuthState {
  step: AuthStep;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}

// Login Start
export interface LoginStartRequest {
  msisdn: string;
  consent_token?: string;
  post_token?: string;
}

export interface LoginStartResponse {
  session_id: string;
  delivery: 'sms' | 'voice' | 'ussd' | 'drum';
  carrier_hint?: {
    mcc: string;
    mnc: string;
    carrier: string;
  };
  cultural_hint?: {
    lang: string;
    otp_phrase?: string;
  };
}

// Login Verify (OTP)
export interface LoginVerifyRequest {
  session_id: string;
  otp: string;
}

export interface LoginVerifyResponse {
  user_id: string;
  access_token: string;
  refresh_token: string;
}

// Consent
export interface ConsentItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

export interface ConsentBundleResponse {
  items: ConsentItem[];
  version: string;
}

export interface ConsentAgreeRequest {
  consent_items: string[];
  version: string;
}

export interface ConsentAgreeResponse {
  consent_token: string;
  expires_at: string;
}

// Presence (PoST)
export interface PresenceCheckRequest {
  user_temp_id?: string;
  timezone?: string;
}

export interface PresenceCheckResponse {
  score: number;
  is_africa: boolean;
  hints: {
    mcc?: string;
    mnc?: string;
    asn?: string;
  };
}

// Greeting
export interface GreetingResponse {
  greeting: string;
  time_of_day: 'morning' | 'afternoon' | 'evening';
  language: string;
}

// Refresh Token
export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}
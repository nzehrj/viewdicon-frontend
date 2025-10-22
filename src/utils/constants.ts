// App-wide constants

export const APP_NAME = 'Viewdicon';
export const APP_VERSION = '1.0.0';

// Authentication
export const MAX_DEVICES = 3;
export const MAX_DEVICES_ELDER = 4;
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_SECONDS = 300; // 5 minutes
export const SESSION_TIMEOUT_MS = 1800000; // 30 minutes

// Supported Languages (Tier-1)
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' },
  { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

// Voice Authentication
export const VOICE_RECORDING_DURATION_MS = 5000; // 5 seconds
export const VOICE_MAX_RETRIES = 1;
export const VOICE_MIN_SCORE = 0.7;

// Device Binding
export const DPOP_KEY_ALGORITHM = 'Ed25519';
export const DEVICE_FINGERPRINT_KEY = 'device_fingerprint';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'afro_auth_token',
  REFRESH_TOKEN: 'afro_refresh_token',
  USER_DATA: 'afro_user_data',
  DEVICE_ID: 'afro_device_id',
  DPOP_KEY: 'afro_dpop_key',
  LANGUAGE: 'afro_language',
  THEME: 'afro_theme',
  AFRO_ID: 'afro_id',
  KINSHIP_TIER: 'afro_kinship_tier',
  ROLE_MANIFEST: 'afro_role_manifest',
} as const;

// Circle Gates (C1, C2, C3)
export const CIRCLE_GATES = {
  C1: 'family_gate', // Family Tree Required
  C2: 'heritage_gate', // Heritage Challenge
  C3: 'quick_path', // Direct Access
} as const;

export type CircleGate = typeof CIRCLE_GATES[keyof typeof CIRCLE_GATES];

// Auth Flow States
export const AUTH_STATES = {
  SPLASH: 'splash',
  GREETING: 'greeting',
  TERMS: 'terms',
  CONSENT: 'consent',
  PHONE: 'phone',
  OTP: 'otp',
  FINGERPRINT: 'fingerprint',
  VOICE: 'voice',
  VILLAGE: 'village',
  CIRCLE_RESOLVE: 'circle_resolve',
  DASHBOARD: 'dashboard',
} as const;

export type AuthState = typeof AUTH_STATES[keyof typeof AUTH_STATES];

// Villages
export const VILLAGES = [
  { id: 'healers', name: 'Village of Healers', icon: '🏥', color: 'from-green-400 to-emerald-600' },
  { id: 'farmers', name: 'Village of Harvesters', icon: '🌾', color: 'from-amber-400 to-orange-600' },
  { id: 'builders', name: 'Village of Master Builders', icon: '🏗️', color: 'from-blue-400 to-indigo-600' },
  { id: 'traders', name: 'Village of Merchants', icon: '🏪', color: 'from-purple-400 to-pink-600' },
  { id: 'artists', name: 'Village of Griots', icon: '🎨', color: 'from-red-400 to-rose-600' },
  { id: 'teachers', name: 'Village of Knowledge', icon: '📚', color: 'from-cyan-400 to-teal-600' },
  { id: 'civic', name: 'Village of Justice', icon: '⚖️', color: 'from-gray-400 to-slate-600' },
  { id: 'transport', name: 'Village of Pathfinders', icon: '🚗', color: 'from-yellow-400 to-amber-600' },
  { id: 'tech', name: 'Village of Innovators', icon: '💻', color: 'from-violet-400 to-purple-600' },
  { id: 'hospitality', name: 'Village of Welcome', icon: '🏨', color: 'from-pink-400 to-fuchsia-600' },
  { id: 'finance', name: 'Village of Prosperity', icon: '💰', color: 'from-emerald-400 to-green-600' },
  { id: 'environment', name: 'Village of Earth Keepers', icon: '🌍', color: 'from-lime-400 to-green-600' },
] as const;

export type VillageId = typeof VILLAGES[number]['id'];

// API Response Codes
export const API_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMIT: 429,
  SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_OTP: 'Invalid verification code. Please try again.',
  DEVICE_LIMIT_REACHED: 'You have reached the maximum number of devices.',
  VOICE_VERIFICATION_FAILED: 'Voice verification failed. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;
// Backend Services Configuration
// All microservices with their ports and endpoints

export const BACKEND_SERVICES = {
  // Base URL - change this for production
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost',
  
  // Auth Service
  AUTH: {
    PORT: 3001,
    BASE: 'http://localhost:3001',
    ENDPOINTS: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      LOGOUT: '/auth/logout',
    }
  },
  
  // Banking Core Service
  BANKING: {
    PORT: 3002,
    BASE: 'http://localhost:3002',
    ENDPOINTS: {
      GET_BALANCE: '/v1/banking/balance',
      TRANSFER: '/v1/banking/transfer',
      TRANSACTION_HISTORY: '/v1/banking/transactions',
      SETTLE_WARI: '/v2/settle-wari-token',
    }
  },
  
  // IWA Ledger Service
  IWA: {
    PORT: 3003,
    BASE: 'http://localhost:3003',
    ENDPOINTS: {
      SUBMIT_ATTESTATION: '/v1/iwa/submit-attestation',
      GET_SCORE: '/v1/iwa/get-score',
      GET_TOTEM: '/v1/iwa/totem',
      ATTESTATION_HISTORY: '/v1/iwa/attestations',
    }
  },
  
  // Griot Service (DRS - Dynamic Role System)
  GRIOT: {
    PORT: 3004,
    BASE: 'http://localhost:3004',
    ENDPOINTS: {
      GET_ROLE_MANIFEST: '/v1/role-manifest/:role_id',
      GET_USER_REGISTRY: '/v1/user/registry/:afro_id',
      GET_KINSHIP_TIER: '/v1/kinship/tier/:user_id',
      GET_GLOBAL_POLICIES: '/v1/policies',
      VALIDATE_AFRO_ID: '/v1/validate/afro-id',
    }
  },
  
  // Kinship Access Service
  KINSHIP: {
    PORT: 3005,
    BASE: 'http://localhost:3005',
    ENDPOINTS: {
      CHECK_TIER_ENTITLEMENT: '/v1/check-tier-entitlement',
      GET_USER_TIER: '/v1/kinship/user-tier/:user_id',
      UPGRADE_TIER: '/v1/kinship/upgrade',
    }
  },
  
  // Escrow Service
  ESCROW: {
    PORT: 3006,
    BASE: 'http://localhost:3006',
    ENDPOINTS: {
      CREATE_ESCROW: '/v1/escrow/create',
      LOCK_FUNDS: '/v1/escrow/lock',
      RAISE_DISPUTE: '/v1/escrow/dispute',
      GET_STATUS: '/v1/escrow/status/:escrow_id',
    }
  },
  
  // Digital Griot Archive (DGA)
  DGA: {
    PORT: 3007,
    BASE: 'http://localhost:3007',
    ENDPOINTS: {
      UPLOAD_ASSET: '/v1/dga/upload',
      GET_ASSET: '/v1/dga/asset/:asset_id',
      STREAM_ASSET: '/v1/dga/stream/:asset_id',
      SET_KSE_SPLITS: '/v1/dga/kse/splits',
      CHECK_ENTITLEMENT: '/v1/dga/entitlement/check',
    }
  },
  
  // Wari Transaction Protocol (WTP)
  WTP: {
    PORT: 3030,
    BASE: 'http://localhost:3030',
    ENDPOINTS: {
      GENERATE_TOKEN: '/v1/wari/generate-offline-token',
      SETTLE_TOKEN: '/v1/wari/settle-offline-token',
      GET_TOKEN_STATUS: '/v1/wari/token/status/:token_id',
    }
  },
  
  // Authentication Flow Endpoints (from AFRO Login & Onboarding spec)
  AUTH_FLOW: {
    PORT: 3001,
    BASE: 'http://localhost:3001',
    ENDPOINTS: {
      LANG_GREET: '/v1/lang/greet',
      CONSENT_BUNDLE: '/v1/consent/bundle',
      CONSENT_AGREE: '/v1/consent/agree',
      PRESENCE_CHECK: '/v1/presence/check',
      PRESENCE_VERIFY: '/v1/presence/verify',
      LOGIN_START: '/v1/login/start',
      LOGIN_VERIFY: '/v1/login/verify',
      DEVICE_ENROLL: '/v1/device/enroll',
      DEVICE_ATTEST: '/v1/device/attest',
      DEVICE_STATUS: '/v1/device/status/:id',
      VOICE_CHALLENGE_START: '/v1/voice/challenge/start',
      VOICE_CHALLENGE_VERIFY: '/v1/voice/challenge/verify',
      FAMILY_GATE: '/v1/policy/family_gate/:user_id',
      DASHBOARD_POLICY: '/v1/policy/dashboard/:user_id',
      HERITAGE_START: '/v1/heritage/challenge/start',
      HERITAGE_ANSWER: '/v1/heritage/challenge/answer',
      HERITAGE_STATE: '/v1/heritage/challenge/state',
      FAMILY_STATUS: '/v1/family/status/:tree_id',
    }
  },
  
  // Moot Resolution System
  MOOT: {
    PORT: 3008,
    BASE: 'http://localhost:3008',
    ENDPOINTS: {
      INITIATE_MOOT: '/v1/initiate-moot',
      GET_MOOT_STATUS: '/v1/moot/status/:moot_id',
      SUBMIT_EVIDENCE: '/v1/moot/evidence',
      GET_RESOLUTION: '/v1/moot/resolution/:moot_id',
    }
  },
} as const;

// Helper function to build full URL
export const buildUrl = (service: keyof typeof BACKEND_SERVICES, endpoint: string, params?: Record<string, string>): string => {
  const serviceConfig = BACKEND_SERVICES[service];
  if (!serviceConfig || typeof serviceConfig === 'string') return '';
  
  let url = `${serviceConfig.BASE}${endpoint}`;
  
  // Replace path parameters
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }
  
  return url;
};

// Export individual service configs for easy access
export const {
  AUTH,
  BANKING,
  IWA,
  GRIOT,
  KINSHIP,
  ESCROW,
  DGA,
  WTP,
  AUTH_FLOW,
  MOOT,
} = BACKEND_SERVICES;
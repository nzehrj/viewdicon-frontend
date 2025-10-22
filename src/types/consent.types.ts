// Consent Management Types

export interface ConsentItem {
  id: string;
  title: string;
  description: string;
  details?: string;
  required: boolean;
  category: 'essential' | 'functional' | 'analytics' | 'marketing';
}

export interface ConsentPreferences {
  consent_items: string[];
  version: string;
  timestamp: string;
}

export interface ConsentBundleResponse {
  items: ConsentItem[];
  version: string;
  last_updated: string;
}

export interface ConsentAgreeRequest {
  consent_items: string[];
  version: string;
  user_temp_id?: string;
}

export interface ConsentAgreeResponse {
  consent_token: string;
  expires_at: string;
}
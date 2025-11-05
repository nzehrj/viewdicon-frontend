/**
 * Location Truth Type Definitions
 * Upgrade 5 Implementation
 */

// ===== 3-LAYER LOCATION TRUTH =====

export interface NetworkLocationGuess {
  mcc_mnc: string; // Mobile Country Code / Network Code
  sim_country_code: string;
  cell_tower_region: string;
  time_zone_offset: number;
  device_locale: string;
  inferred_region: string; // "West Africa / NG"
}

export interface SpokenDeclaration {
  audio_url: string;
  transcription: string; // "I am in Abuja now"
  language_detected: string;
  declared_at: Date;
}

export interface ClanConfirmation {
  afro_id: string;
  display_name: string;
  confirmed_at: Date;
  location_claimed: string;
}

export interface LocationTruth {
  network_region_guess: string;
  spoken_declaration: string;
  clan_confirmations: ClanConfirmation[];
  last_verified_at: Date;
  confidence_score: number; // 0-100
}

export interface LocationVerificationStatus {
  verified: boolean;
  location: string;
  truth_layers: {
    network: boolean;
    spoken: boolean;
    clan: boolean;
  };
  last_check: Date;
}
// src/types/social/pot.types.ts
// POT System Type Definitions

/**
 * Core interaction types for POT system
 */
export enum InteractionType {
  HEAR = 'HEAR',
  SPEAK = 'SPEAK',
  BLESS = 'BLESS',
  COWRIE_DROP = 'COWRIE_DROP',
  ECHO = 'ECHO',
}

/**
 * Social Voice Feed specific interactions
 */
export enum SocialVoiceInteraction {
  AMPLIFY = 'AMPLIFY',
  VERIFY = 'VERIFY',
  UBUNTU = 'UBUNTU',
  TIP = 'TIP',
  HELP = 'HELP',
  PEACE = 'PEACE',
}

/**
 * Actor types for multiplier calculation
 */
export type ActorType = 'citizen' | 'witness' | 'elder' | 'guardian' | 'council';

/**
 * Heat levels
 */
export type HeatLevel = 'cold' | 'warm' | 'simmer' | 'boiling' | 'ancestral';

/**
 * Lift scopes
 */
export type LiftScope = 'local' | 'regional' | 'national' | 'pan_african';

/**
 * POT (ÀPÒ) - The engagement container
 */
export interface Pot {
  id: string;
  postId: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Heat metrics
  baseHeat: number;
  multipliedHeat: number;
  diversityBoost: number;
  finalHeat: number;
  heatLevel: HeatLevel;
  
  // Interaction counts
  hears: number;
  speaks: number;
  blessings: number;
  cowrieDrops: number;
  echos: number;
  
  // Actors
  uniqueActors: string[];
  actorTypes: Record<string, ActorType>;
  
  // Lift status
  liftScope: LiftScope | null;
  liftedAt: Date | null;
  
  // Council seals
  councilSeals: number;
  councilSealedBy: string[];
  
  // Village
  villageId?: string;
}

/**
 * Action receipt for interaction
 */
export interface ActionReceipt {
  id: string;
  potId: string;
  actorId: string;
  actorType: ActorType;
  interactionType: InteractionType | SocialVoiceInteraction;
  timestamp: Date;
  
  // Metrics
  heatContribution: number;
  cowrieAmount?: number;
  
  // Status
  processed: boolean;
  error?: string;
}

/**
 * Heat calculation result
 */
export interface HeatCalculation {
  baseHeat: number;
  actorMultiplier: number;
  villageBoost: number;
  diversityBoost: number;
  totalHeat: number;
}

/**
 * Lift event
 */
export interface LiftEvent {
  potId: string;
  fromScope: LiftScope | null;
  toScope: LiftScope;
  heat: number;
  timestamp: Date;
  reason: 'heat_threshold' | 'council_approved' | 'witness_verified';
}

/**
 * Thread chain (child pots)
 */
export interface ThreadChain {
  parentPotId: string;
  childPots: string[];
  depth: number;
  totalHeat: number;
  branchEarnings: number;
}

/**
 * Echo chain (reshare lineage)
 */
export interface EchoChain {
  originalPotId: string;
  echoPots: Array<{
    potId: string;
    echoedBy: string;
    echoedAt: Date;
    heat: number;
  }>;
  totalReach: number;
  amplifierRewards: Record<string, number>;
}

/**
 * Council seal
 */
export interface CouncilSeal {
  potId: string;
  councilMemberId: string;
  sealType: 'truth' | 'quality' | 'cultural' | 'safety';
  timestamp: Date;
  heatBoost: number;
}

/**
 * Interaction with full details
 */
export interface InteractionDetail {
  id: string;
  potId: string;
  actorId: string;
  actorName: string;
  actorAvatar?: string;
  actorType: ActorType;
  actorVillageId?: string;
  
  type: InteractionType | SocialVoiceInteraction;
  timestamp: Date;
  
  // Optional data
  message?: string;
  voiceUrl?: string;
  cowrieAmount?: number;
  
  // Metrics
  heatContribution: number;
}

/**
 * POT statistics
 */
export interface PotStats {
  totalInteractions: number;
  uniqueActors: number;
  totalCowrie: number;
  averageHeatPerActor: number;
  topInteractionType: InteractionType | SocialVoiceInteraction;
  growthRate: number;
}

/**
 * Voice class for Social Voice Feed
 */
export type VoiceClass = 
  | 'citizen'
  | 'witness'
  | 'voice_of_record'
  | 'council_elder'
  | 'guardian_voice'
  | 'creator_voice';

/**
 * Feed layer (geographic scope)
 */
export type FeedLayer = 'local_drum' | 'regional_stream' | 'national_beat' | 'pan_african_current';

/**
 * Post visibility
 */
export type PostVisibility = 'public' | 'village' | 'clan' | 'private';

/**
 * Safety status
 */
export type SafetyStatus = 'pass' | 'review' | 'block';

/**
 * Truth status
 */
export type TruthStatus = 'verified' | 'disputed' | 'unverified';
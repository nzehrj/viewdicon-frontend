// src/types/social/interaction.types.ts
// Social Interaction Type Definitions

import { InteractionType, SocialVoiceInteraction } from './pot.types';

/**
 * Interaction record
 */
export interface InteractionRecord {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  
  // Target
  potId: string;
  postId: string;
  
  // Interaction
  type: InteractionType | SocialVoiceInteraction;
  timestamp: Date;
  
  // Context
  actorType: 'citizen' | 'witness' | 'elder' | 'guardian' | 'council';
  villageId?: string;
  
  // Cowrie
  cowrieAmount?: number;
  
  // Message (for SPEAK)
  message?: string;
  voiceUrl?: string;
  
  // Heat contribution
  heatContribution: number;
}

/**
 * Interaction summary
 */
export interface InteractionSummary {
  potId: string;
  
  // Counts
  hears: number;
  speaks: number;
  blessings: number;
  cowrieDrops: number;
  echos: number;
  
  // Social Voice specific
  amplifies?: number;
  verifications?: number;
  ubuntuSupport?: number;
  helps?: number;
  peaceFlagged?: boolean;
  
  // Total
  totalInteractions: number;
  uniqueActors: number;
  
  // Cowrie
  totalCowrie: number;
  
  // Heat
  totalHeat: number;
}

/**
 * Interaction notification
 */
export interface InteractionNotification {
  id: string;
  recipientId: string;
  
  // Interaction
  actorId: string;
  actorName: string;
  actorAvatar?: string;
  
  type: InteractionType | SocialVoiceInteraction;
  postId: string;
  potId: string;
  
  // Message
  message?: string;
  cowrieAmount?: number;
  
  // Status
  read: boolean;
  
  // Timestamps
  createdAt: Date;
  readAt?: Date;
}
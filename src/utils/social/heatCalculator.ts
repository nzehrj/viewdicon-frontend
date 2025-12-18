// utils/social/heatCalculator.ts
// Heat Calculation Engine for POT System
// Implements: Base heat + Actor multipliers + Diversity boost + Village boost

import { InteractionType } from '@/types/social/pot.types';
import {
  ACTOR_MULTIPLIERS,
  DIVERSITY_CONFIG,
  VILLAGE_BOOST,
} from '@/constants/interactions';

/**
 * Actor types for multiplier calculation
 */
export type ActorType = 'citizen' | 'witness' | 'elder' | 'guardian' | 'council';

/**
 * Calculate base heat contribution for a single interaction
 */
export const calculateBaseHeat = (
  type: InteractionType,
  cowrieAmount?: number
): number => {
  // Heat weights per interaction type
  const HEAT_WEIGHTS = {
    [InteractionType.HEAR]: 1,
    [InteractionType.SPEAK]: 4,
    [InteractionType.BLESS]: 6,
    [InteractionType.COWRIE_DROP]: 2, // Base, varies by amount
    [InteractionType.ECHO]: 5,
  };

  switch (type) {
    case InteractionType.HEAR:
      return HEAT_WEIGHTS[InteractionType.HEAR];
    
    case InteractionType.SPEAK:
      return HEAT_WEIGHTS[InteractionType.SPEAK];
    
    case InteractionType.BLESS:
      return HEAT_WEIGHTS[InteractionType.BLESS];
    
    case InteractionType.COWRIE_DROP:
      // +min(2, ⌊log10(amount)⌋+1)
      if (!cowrieAmount || cowrieAmount <= 0) return 0;
      const logHeat = Math.floor(Math.log10(cowrieAmount)) + 1;
      return Math.min(2, Math.max(1, logHeat));
    
    case InteractionType.ECHO:
      return HEAT_WEIGHTS[InteractionType.ECHO];
    
    default:
      return 0;
  }
};

/**
 * Get actor multiplier based on role
 */
export const getActorMultiplier = (actorType: ActorType): number => {
  switch (actorType) {
    case 'citizen':
      return ACTOR_MULTIPLIERS.CITIZEN; // 1.0
    case 'witness':
      return ACTOR_MULTIPLIERS.WITNESS; // 1.3
    case 'elder':
      return ACTOR_MULTIPLIERS.ELDER; // 1.5
    case 'guardian':
      return ACTOR_MULTIPLIERS.GUARDIAN; // 1.8
    case 'council':
      return ACTOR_MULTIPLIERS.COUNCIL; // 2.0
    default:
      return 1.0;
  }
};

/**
 * Calculate diversity boost based on unique actors
 * +10% per 25 unique actors in 10-minute window, capped at +50%
 */
export const calculateDiversityBoost = (uniqueActorCount: number): number => {
  const boostSets = Math.floor(uniqueActorCount / 25);
  const boost = boostSets * DIVERSITY_CONFIG.BOOST_PER_25_ACTORS;
  return Math.min(boost, DIVERSITY_CONFIG.MAX_BOOST);
};

/**
 * Calculate village boost
 * ×1.25 if actor is from the same village as the pot
 */
export const calculateVillageBoost = (
  actorVillageId: string | undefined,
  potVillageId: string | undefined
): number => {
  if (!actorVillageId || !potVillageId) return 1.0;
  return actorVillageId === potVillageId ? VILLAGE_BOOST : 1.0;
};

/**
 * Calculate total heat contribution for a single interaction
 */
export const calculateInteractionHeat = (
  type: InteractionType,
  actorType: ActorType,
  actorVillageId?: string,
  potVillageId?: string,
  cowrieAmount?: number
): number => {
  // Step 1: Base heat
  const baseHeat = calculateBaseHeat(type, cowrieAmount);
  
  // Step 2: Actor multiplier
  const actorMultiplier = getActorMultiplier(actorType);
  
  // Step 3: Village boost
  const villageBoost = calculateVillageBoost(actorVillageId, potVillageId);
  
  // Final calculation: base × actor × village
  return baseHeat * actorMultiplier * villageBoost;
};

/**
 * Calculate total pot heat with all interactions
 */
export const calculateTotalPotHeat = (
  interactions: Array<{
    type: InteractionType;
    actorType: ActorType;
    actorVillageId?: string;
    cowrieAmount?: number;
    timestamp: Date;
  }>,
  potVillageId?: string,
  diversityTimeWindowMinutes: number = 10
): {
  baseHeat: number;
  multipliedHeat: number;
  diversityBoost: number;
  finalHeat: number;
} => {
  // Calculate base heat with multipliers
  let baseHeat = 0;
  let multipliedHeat = 0;
  
  interactions.forEach((interaction) => {
    const heat = calculateInteractionHeat(
      interaction.type,
      interaction.actorType,
      interaction.actorVillageId,
      potVillageId,
      interaction.cowrieAmount
    );
    
    baseHeat += calculateBaseHeat(interaction.type, interaction.cowrieAmount);
    multipliedHeat += heat;
  });
  
  // Calculate diversity boost (unique actors in time window)
  const now = new Date();
  const timeWindowMs = diversityTimeWindowMinutes * 60 * 1000;
  
  const recentInteractions = interactions.filter((interaction) => {
    const timeDiff = now.getTime() - interaction.timestamp.getTime();
    return timeDiff <= timeWindowMs;
  });
  
  const uniqueActors = new Set(
    recentInteractions.map((i) => `${i.actorType}-${i.actorVillageId}`)
  );
  
  const diversityBoostPercent = calculateDiversityBoost(uniqueActors.size);
  const diversityBoostAmount = multipliedHeat * diversityBoostPercent;
  
  // Final heat
  const finalHeat = Math.round(multipliedHeat + diversityBoostAmount);
  
  return {
    baseHeat: Math.round(baseHeat),
    multipliedHeat: Math.round(multipliedHeat),
    diversityBoost: diversityBoostPercent,
    finalHeat,
  };
};

/**
 * Get heat level based on total heat
 */
export const getHeatLevel = (
  heat: number
): 'cold' | 'warm' | 'simmer' | 'boiling' | 'ancestral' => {
  if (heat >= 1200) return 'ancestral';
  if (heat >= 400) return 'boiling';
  if (heat >= 300) return 'simmer';
  if (heat >= 120) return 'warm';
  return 'cold';
};

/**
 * Check if pot should be lifted to discovery
 */
export const shouldLiftToDiscovery = (heat: number): boolean => {
  return heat >= 120; // Warm threshold
};

/**
 * Get lift scope based on heat
 */
export const getLiftScope = (
  heat: number
): 'local' | 'regional' | 'national' | 'pan_african' | null => {
  if (heat >= 3000) return 'pan_african';
  if (heat >= 1200) return 'national';
  if (heat >= 400) return 'regional';
  if (heat >= 120) return 'local';
  return null;
};

/**
 * Calculate heat decay over time (if implemented)
 * Currently not used, but available for future decay mechanics
 */
export const calculateHeatDecay = (
  currentHeat: number,
  hoursSinceLastInteraction: number,
  decayRate: number = 0.05 // 5% per hour
): number => {
  const decayMultiplier = Math.pow(1 - decayRate, hoursSinceLastInteraction);
  return Math.round(currentHeat * decayMultiplier);
};

/**
 * Format heat for display
 */
export const formatHeat = (heat: number): string => {
  if (heat >= 1000) {
    return `${(heat / 1000).toFixed(1)}K`;
  }
  return heat.toString();
};

/**
 * Get heat color based on level
 */
export const getHeatColor = (heat: number): string => {
  const level = getHeatLevel(heat);
  
  switch (level) {
    case 'ancestral':
      return '#f59e0b'; // Amber
    case 'boiling':
      return '#f97316'; // Orange
    case 'simmer':
      return '#eab308'; // Yellow
    case 'warm':
      return '#10b981'; // Green
    case 'cold':
      return '#6b7280'; // Gray
    default:
      return '#6b7280';
  }
};

/**
 * Calculate heat percentage to next level
 */
export const getHeatProgress = (heat: number): {
  currentLevel: string;
  nextLevel: string;
  progress: number;
} => {
  const thresholds = [
    { name: 'cold', min: 0, max: 120 },
    { name: 'warm', min: 120, max: 300 },
    { name: 'simmer', min: 300, max: 400 },
    { name: 'boiling', min: 400, max: 1200 },
    { name: 'ancestral', min: 1200, max: Infinity },
  ];
  
  for (let i = 0; i < thresholds.length; i++) {
    const current = thresholds[i];
    if (heat >= current.min && heat < current.max) {
      const range = current.max - current.min;
      const progress = ((heat - current.min) / range) * 100;
      const nextLevel = thresholds[i + 1]?.name || 'max';
      
      return {
        currentLevel: current.name,
        nextLevel,
        progress: Math.min(progress, 100),
      };
    }
  }
  
  return {
    currentLevel: 'ancestral',
    nextLevel: 'max',
    progress: 100,
  };
};

export default {
  calculateBaseHeat,
  getActorMultiplier,
  calculateDiversityBoost,
  calculateVillageBoost,
  calculateInteractionHeat,
  calculateTotalPotHeat,
  getHeatLevel,
  shouldLiftToDiscovery,
  getLiftScope,
  calculateHeatDecay,
  formatHeat,
  getHeatColor,
  getHeatProgress,
};
// utils/social/honorSeedCalculator.ts
// Honor Seeds Calculation Engine
// HonorSeeds are respect currency earned from community service and contributions

import { HONOR_SEED_ACTIVITIES } from '@/constants/ranks';

/**
 * Activity types that earn HonorSeeds
 */
export type HonorSeedActivity =
  | 'RECEIVE_BLESSING'
  | 'RECEIVE_ELDER_BLESSING'
  | 'COMPLETE_SEALED_SESSION'
  | 'COUNCIL_SERVICE'
  | 'WITNESS_VERIFICATION'
  | 'MENTOR_APPRENTICE'
  | 'RESOLVE_DISPUTE';

/**
 * Calculate HonorSeeds from a blessing
 */
export const calculateBlessingSeeds = (
  blessorRank: number,
  isElder: boolean = false
): number => {
  if (isElder || blessorRank >= 6) {
    // Elder blessing (weighted by rank)
    const baseSeeds = HONOR_SEED_ACTIVITIES.RECEIVE_ELDER_BLESSING;
    const rankMultiplier = Math.min(blessorRank / 3, 2.5); // Max 2.5x
    return Math.round(baseSeeds * rankMultiplier);
  }
  
  // Regular blessing
  return HONOR_SEED_ACTIVITIES.RECEIVE_BLESSING;
};

/**
 * Calculate HonorSeeds from sealed session
 * (Healer/medical consults, work contracts, etc.)
 */
export const calculateSealedSessionSeeds = (
  sessionType: 'medical' | 'work' | 'consult' | 'other',
  durationMinutes: number
): number => {
  const baseSeeds = HONOR_SEED_ACTIVITIES.COMPLETE_SEALED_SESSION;
  
  // Longer sessions earn more seeds
  let durationMultiplier = 1.0;
  if (durationMinutes >= 60) durationMultiplier = 1.5;
  else if (durationMinutes >= 30) durationMultiplier = 1.2;
  
  // Medical sessions earn slightly more
  const typeMultiplier = sessionType === 'medical' ? 1.3 : 1.0;
  
  return Math.round(baseSeeds * durationMultiplier * typeMultiplier);
};

/**
 * Calculate HonorSeeds from council service
 */
export const calculateCouncilServiceSeeds = (
  serviceType: 'moderation' | 'dispute' | 'policy' | 'governance',
  hoursServed: number
): number => {
  const baseSeeds = HONOR_SEED_ACTIVITIES.COUNCIL_SERVICE;
  
  // More hours = more seeds
  const hoursMultiplier = Math.min(hoursServed / 2, 3); // Cap at 3x
  
  // Dispute resolution earns more
  const typeMultiplier = serviceType === 'dispute' ? 1.5 : 1.0;
  
  return Math.round(baseSeeds * hoursMultiplier * typeMultiplier);
};

/**
 * Calculate HonorSeeds from witness verification
 */
export const calculateWitnessSeeds = (
  verified: boolean,
  importance: 'low' | 'medium' | 'high' | 'critical'
): number => {
  if (!verified) return 0;
  
  const baseSeeds = HONOR_SEED_ACTIVITIES.WITNESS_VERIFICATION;
  
  // Importance multiplier
  const importanceMultipliers = {
    low: 1.0,
    medium: 1.5,
    high: 2.0,
    critical: 3.0,
  };
  
  return Math.round(baseSeeds * importanceMultipliers[importance]);
};

/**
 * Calculate HonorSeeds from mentoring
 */
export const calculateMentorSeeds = (
  sessionsCompleted: number,
  apprenticeProgress: number // 0-100
): number => {
  const baseSeeds = HONOR_SEED_ACTIVITIES.MENTOR_APPRENTICE;
  
  // More sessions = more seeds
  const sessionMultiplier = Math.min(sessionsCompleted / 5, 2); // Cap at 2x
  
  // Progress bonus
  const progressBonus = apprenticeProgress >= 80 ? 1.5 : 1.0;
  
  return Math.round(baseSeeds * sessionMultiplier * progressBonus);
};

/**
 * Calculate HonorSeeds from dispute resolution
 */
export const calculateDisputeSeeds = (
  resolutionSuccess: boolean,
  partySatisfaction: number // 0-100 average satisfaction
): number => {
  if (!resolutionSuccess) return 0;
  
  const baseSeeds = HONOR_SEED_ACTIVITIES.RESOLVE_DISPUTE;
  
  // Satisfaction bonus
  const satisfactionMultiplier = partySatisfaction / 100 + 0.5; // 0.5-1.5x
  
  return Math.round(baseSeeds * satisfactionMultiplier);
};

/**
 * Calculate total HonorSeeds from multiple activities
 */
export const calculateTotalHonorSeeds = (
  activities: Array<{
    type: HonorSeedActivity;
    metadata?: any;
  }>
): {
  totalSeeds: number;
  breakdown: Record<string, number>;
} => {
  const breakdown: Record<string, number> = {};
  let totalSeeds = 0;
  
  activities.forEach((activity) => {
    let seeds = 0;
    
    switch (activity.type) {
      case 'RECEIVE_BLESSING':
        seeds = calculateBlessingSeeds(
          activity.metadata?.blessorRank || 0,
          activity.metadata?.isElder || false
        );
        break;
        
      case 'RECEIVE_ELDER_BLESSING':
        seeds = calculateBlessingSeeds(
          activity.metadata?.blessorRank || 6,
          true
        );
        break;
        
      case 'COMPLETE_SEALED_SESSION':
        seeds = calculateSealedSessionSeeds(
          activity.metadata?.sessionType || 'other',
          activity.metadata?.durationMinutes || 30
        );
        break;
        
      case 'COUNCIL_SERVICE':
        seeds = calculateCouncilServiceSeeds(
          activity.metadata?.serviceType || 'moderation',
          activity.metadata?.hoursServed || 1
        );
        break;
        
      case 'WITNESS_VERIFICATION':
        seeds = calculateWitnessSeeds(
          activity.metadata?.verified !== false,
          activity.metadata?.importance || 'medium'
        );
        break;
        
      case 'MENTOR_APPRENTICE':
        seeds = calculateMentorSeeds(
          activity.metadata?.sessionsCompleted || 1,
          activity.metadata?.apprenticeProgress || 50
        );
        break;
        
      case 'RESOLVE_DISPUTE':
        seeds = calculateDisputeSeeds(
          activity.metadata?.resolutionSuccess !== false,
          activity.metadata?.partySatisfaction || 75
        );
        break;
    }
    
    breakdown[activity.type] = (breakdown[activity.type] || 0) + seeds;
    totalSeeds += seeds;
  });
  
  return {
    totalSeeds,
    breakdown,
  };
};

/**
 * Calculate HonorSeeds needed for next rank
 */
export const calculateSeedsToNextRank = (
  currentSeeds: number,
  currentRank: number,
  targetRank?: number
): number => {
  // This would use RANK_STAGES to calculate
  // For now, simplified calculation
  const nextRank = targetRank || currentRank + 1;
  
  // Exponential growth
  const requiredSeeds = Math.round(10 * Math.pow(3, nextRank));
  
  return Math.max(0, requiredSeeds - currentSeeds);
};

/**
 * Format HonorSeeds for display
 */
export const formatHonorSeeds = (seeds: number): string => {
  if (seeds >= 1000) {
    return `${(seeds / 1000).toFixed(1)}K`;
  }
  return seeds.toString();
};

/**
 * Get HonorSeeds color based on amount
 */
export const getHonorSeedsColor = (seeds: number): string => {
  if (seeds >= 3000) return '#f59e0b'; // Amber (ancestral)
  if (seeds >= 1200) return '#8b5cf6'; // Purple (elder)
  if (seeds >= 500) return '#3b82f6'; // Blue (voice)
  if (seeds >= 220) return '#10b981'; // Green (hands)
  if (seeds >= 90) return '#84cc16'; // Lime (steady)
  return '#6b7280'; // Gray (new)
};

/**
 * Calculate HonorSeeds growth rate
 */
export const calculateGrowthRate = (
  currentSeeds: number,
  seedsLastWeek: number
): {
  weeklyGrowth: number;
  percentageGrowth: number;
  trend: 'accelerating' | 'steady' | 'slowing';
} => {
  const weeklyGrowth = currentSeeds - seedsLastWeek;
  const percentageGrowth = seedsLastWeek > 0
    ? (weeklyGrowth / seedsLastWeek) * 100
    : 0;
  
  let trend: 'accelerating' | 'steady' | 'slowing' = 'steady';
  if (percentageGrowth > 20) trend = 'accelerating';
  else if (percentageGrowth < 5) trend = 'slowing';
  
  return {
    weeklyGrowth,
    percentageGrowth,
    trend,
  };
};

/**
 * Check if user qualifies for seed bonus
 * (Consistent activity bonuses)
 */
export const checkSeedBonus = (
  seedsEarnedToday: number,
  consecutiveDays: number
): {
  hasBonus: boolean;
  bonusAmount: number;
  reason: string;
} => {
  // Consistency bonus for earning seeds daily
  if (consecutiveDays >= 7 && seedsEarnedToday >= 5) {
    return {
      hasBonus: true,
      bonusAmount: Math.round(seedsEarnedToday * 0.2), // 20% bonus
      reason: '7-day streak bonus',
    };
  }
  
  // Daily goal bonus
  if (seedsEarnedToday >= 10) {
    return {
      hasBonus: true,
      bonusAmount: 2,
      reason: 'Daily goal achieved',
    };
  }
  
  return {
    hasBonus: false,
    bonusAmount: 0,
    reason: '',
  };
};

export default {
  calculateBlessingSeeds,
  calculateSealedSessionSeeds,
  calculateCouncilServiceSeeds,
  calculateWitnessSeeds,
  calculateMentorSeeds,
  calculateDisputeSeeds,
  calculateTotalHonorSeeds,
  calculateSeedsToNextRank,
  formatHonorSeeds,
  getHonorSeedsColor,
  calculateGrowthRate,
  checkSeedBonus,
};
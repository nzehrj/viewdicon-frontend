// utils/social/rankCalculator.ts
// Rank Calculation Engine - Hard 2GO Auto-Rank System
// Implements: Journey/HonorSeeds/Conduct progression with multi-axis validation

import {
  RANK_STAGES,
  JOURNEY_CAPS,
  JOURNEY_ACTIVITIES,
  HONOR_SEED_ACTIVITIES,
  DECAY_RULES,
} from '@/constants/ranks';

/**
 * User stat structure for rank calculation
 */
export interface UserRankStats {
  currentStage: number;
  journey: number;
  honorSeeds: number;
  conductDays: number;
  sealedSessions: number;
  witnessReports: number;
  councilDuty: number;
  peerVouches: number;
  lastActivityDate: Date;
  shieldStatus: 'green' | 'amber' | 'red';
}

/**
 * Progression axes for multi-axis requirement (need 3 of 5)
 */
export interface ProgressionAxes {
  service: boolean;      // Helping others, answering calls
  voice: boolean;        // Speaking truth, witness reports
  community: boolean;    // Building connections, mentoring
  truth: boolean;        // Verification, fact-checking
  stewardship: boolean;  // Council duty, governance
}

/**
 * Calculate journey energy from an activity
 */
export const calculateJourneyFromActivity = (
  activityType: keyof typeof JOURNEY_ACTIVITIES,
  currentDailyJourney: number,
  currentWeeklyJourney: number
): {
  journeyEarned: number;
  newDailyTotal: number;
  newWeeklyTotal: number;
  cappedOut: boolean;
} => {
  const baseJourney = JOURNEY_ACTIVITIES[activityType];
  
  // Check caps
  const remainingDaily = JOURNEY_CAPS.DAILY - currentDailyJourney;
  const remainingWeekly = JOURNEY_CAPS.WEEKLY - currentWeeklyJourney;
  
  // Apply the smallest cap
  const maxEarnable = Math.min(baseJourney, remainingDaily, remainingWeekly);
  const actualEarned = Math.max(0, maxEarnable);
  
  return {
    journeyEarned: actualEarned,
    newDailyTotal: currentDailyJourney + actualEarned,
    newWeeklyTotal: currentWeeklyJourney + actualEarned,
    cappedOut: actualEarned < baseJourney,
  };
};

/**
 * Calculate honor seeds from an activity
 */
export const calculateHonorSeedsFromActivity = (
  activityType: keyof typeof HONOR_SEED_ACTIVITIES,
  actorRank?: number
): number => {
  const baseSeeds = HONOR_SEED_ACTIVITIES[activityType];
  
  // Elder blessings are worth more based on the elder's rank
  if (activityType === 'RECEIVE_ELDER_BLESSING' && actorRank) {
    const multiplier = Math.min(actorRank / 2, 3); // Up to 3x for high-rank elders
    return Math.round(baseSeeds * multiplier);
  }
  
  return baseSeeds;
};

/**
 * Check if user meets requirements for next rank
 */
export const meetsRankRequirements = (
  stats: UserRankStats
): {
  meets: boolean;
  missingRequirements: string[];
  nextRankName: string | null;
} => {
  const nextRank = RANK_STAGES[stats.currentStage + 1];
  
  if (!nextRank) {
    return {
      meets: false,
      missingRequirements: ['Already at max rank'],
      nextRankName: null,
    };
  }
  
  const missing: string[] = [];
  const req = nextRank.requirements;
  
  // Check each requirement
  if (stats.journey < req.journey) {
    missing.push(`Journey: ${stats.journey}/${req.journey}`);
  }
  
  if (stats.honorSeeds < req.honorSeeds) {
    missing.push(`Honor Seeds: ${stats.honorSeeds}/${req.honorSeeds}`);
  }
  
  if (stats.conductDays < req.conductDays) {
    missing.push(`Conduct Days: ${stats.conductDays}/${req.conductDays}`);
  }
  
  if (stats.sealedSessions < req.sealedSessions) {
    missing.push(`Sealed Sessions: ${stats.sealedSessions}/${req.sealedSessions}`);
  }
  
  if (stats.witnessReports < req.witnessReports) {
    missing.push(`Witness Reports: ${stats.witnessReports}/${req.witnessReports}`);
  }
  
  if (stats.councilDuty < req.councilDuty) {
    missing.push(`Council Duty: ${stats.councilDuty}/${req.councilDuty}`);
  }
  
  if (stats.peerVouches < req.peerVouches) {
    missing.push(`Peer Vouches: ${stats.peerVouches}/${req.peerVouches}`);
  }
  
  // Check shield status
  if (stats.shieldStatus !== 'green') {
    missing.push(`Shield must be Green (currently ${stats.shieldStatus})`);
  }
  
  return {
    meets: missing.length === 0,
    missingRequirements: missing,
    nextRankName: nextRank.name,
  };
};

/**
 * Calculate progress percentage to next rank
 */
export const calculateRankProgress = (stats: UserRankStats): number => {
  const nextRank = RANK_STAGES[stats.currentStage + 1];
  if (!nextRank) return 100;
  
  const req = nextRank.requirements;
  
  // Calculate weighted progress across all requirements
  const journeyProgress = Math.min((stats.journey / req.journey) * 100, 100);
  const seedsProgress = Math.min((stats.honorSeeds / req.honorSeeds) * 100, 100);
  const conductProgress = Math.min((stats.conductDays / req.conductDays) * 100, 100);
  
  // Average of the three main metrics
  return (journeyProgress + seedsProgress + conductProgress) / 3;
};

/**
 * Check multi-axis progression (need 3 of 5 axes)
 */
export const checkProgressionAxes = (
  stats: UserRankStats
): {
  axes: ProgressionAxes;
  metCount: number;
  requirementMet: boolean;
} => {
  const axes: ProgressionAxes = {
    service: stats.sealedSessions > 0 || stats.journey > 100,
    voice: stats.witnessReports > 0,
    community: stats.peerVouches > 0 || stats.sealedSessions > 0,
    truth: stats.witnessReports > 0,
    stewardship: stats.councilDuty > 0,
  };
  
  const metCount = Object.values(axes).filter(Boolean).length;
  
  return {
    axes,
    metCount,
    requirementMet: metCount >= 3,
  };
};

/**
 * Apply journey decay for inactivity
 */
export const applyJourneyDecay = (
  currentJourney: number,
  daysSinceLastActivity: number
): number => {
  if (!DECAY_RULES.JOURNEY_DECAY_PER_WEEK) return currentJourney;
  
  const weeksSinceActivity = daysSinceLastActivity / 7;
  const decayRate = DECAY_RULES.JOURNEY_DECAY_PER_WEEK;
  const decayMultiplier = Math.pow(1 - decayRate, weeksSinceActivity);
  
  return Math.round(currentJourney * decayMultiplier);
};

/**
 * Check if conduct should be reset
 */
export const shouldResetConduct = (
  stats: UserRankStats,
  daysSinceLastActivity: number
): boolean => {
  // Reset if inactive for too long
  if (daysSinceLastActivity >= DECAY_RULES.CONDUCT_RESET_DAYS) {
    return true;
  }
  
  // Reset if shield is not green
  if (stats.shieldStatus !== 'green') {
    return true;
  }
  
  return false;
};

/**
 * Calculate time until next rank (estimated)
 */
export const estimateTimeToNextRank = (
  stats: UserRankStats,
  avgDailyJourney: number,
  avgDailySeeds: number
): {
  days: number;
  bottleneck: 'journey' | 'seeds' | 'conduct' | 'requirements';
} => {
  const nextRank = RANK_STAGES[stats.currentStage + 1];
  if (!nextRank) return { days: 0, bottleneck: 'journey' };
  
  const req = nextRank.requirements;
  
  // Calculate days needed for each metric
  const journeyDays = avgDailyJourney > 0 
    ? Math.ceil((req.journey - stats.journey) / avgDailyJourney)
    : Infinity;
    
  const seedsDays = avgDailySeeds > 0
    ? Math.ceil((req.honorSeeds - stats.honorSeeds) / avgDailySeeds)
    : Infinity;
    
  const conductDays = Math.max(0, req.conductDays - stats.conductDays);
  
  // Find bottleneck
  const maxDays = Math.max(journeyDays, seedsDays, conductDays);
  
  let bottleneck: 'journey' | 'seeds' | 'conduct' | 'requirements' = 'journey';
  if (maxDays === seedsDays) bottleneck = 'seeds';
  else if (maxDays === conductDays) bottleneck = 'conduct';
  else if (journeyDays === Infinity && seedsDays === Infinity) bottleneck = 'requirements';
  
  return {
    days: Math.min(maxDays, 365), // Cap at 1 year
    bottleneck,
  };
};

/**
 * Get rank benefits
 */
export const getRankBenefits = (stage: number) => {
  const rank = RANK_STAGES[stage];
  if (!rank) return null;
  
  return rank.benefits;
};

/**
 * Get rank color
 */
export const getRankColor = (stage: number): string => {
  const rank = RANK_STAGES[stage];
  return rank?.color || '#9ca3af';
};

/**
 * Get rank title
 */
export const getRankTitle = (stage: number): string => {
  const rank = RANK_STAGES[stage];
  return rank?.title || 'Newcomer';
};

/**
 * Format rank name with stage
 */
export const formatRankName = (stage: number): string => {
  const rank = RANK_STAGES[stage];
  if (!rank) return 'Unknown Rank';
  
  return `${rank.name} (Stage ${stage})`;
};

/**
 * Check if user can advance (complete validation)
 */
export const canAdvanceRank = (stats: UserRankStats): {
  canAdvance: boolean;
  reason: string;
  nextRank: string | null;
} => {
  // Check requirements
  const reqCheck = meetsRankRequirements(stats);
  if (!reqCheck.meets) {
    return {
      canAdvance: false,
      reason: `Missing: ${reqCheck.missingRequirements.join(', ')}`,
      nextRank: reqCheck.nextRankName,
    };
  }
  
  // Check multi-axis (for ranks 4+)
  if (stats.currentStage >= 3) {
    const axesCheck = checkProgressionAxes(stats);
    if (!axesCheck.requirementMet) {
      return {
        canAdvance: false,
        reason: `Need 3 of 5 progression axes (currently ${axesCheck.metCount}/5)`,
        nextRank: reqCheck.nextRankName,
      };
    }
  }
  
  // Check shield status
  if (stats.shieldStatus !== 'green') {
    return {
      canAdvance: false,
      reason: 'Shield must be Green',
      nextRank: reqCheck.nextRankName,
    };
  }
  
  return {
    canAdvance: true,
    reason: 'All requirements met',
    nextRank: reqCheck.nextRankName,
  };
};

export default {
  calculateJourneyFromActivity,
  calculateHonorSeedsFromActivity,
  meetsRankRequirements,
  calculateRankProgress,
  checkProgressionAxes,
  applyJourneyDecay,
  shouldResetConduct,
  estimateTimeToNextRank,
  getRankBenefits,
  getRankColor,
  getRankTitle,
  formatRankName,
  canAdvanceRank,
};
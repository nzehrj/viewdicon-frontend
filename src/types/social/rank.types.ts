// src/types/social/rank.types.ts
// Rank System Type Definitions

/**
 * User rank profile
 */
export interface UserRankProfile {
  userId: string;
  
  // Current rank
  currentStage: number;
  rankName: string;
  rankTitle: string;
  rankColor: string;
  
  // Journey
  journey: number;
  dailyJourney: number;
  weeklyJourney: number;
  journeyHistory: JourneyEntry[];
  
  // HonorSeeds
  honorSeeds: number;
  honorSeedsHistory: HonorSeedEntry[];
  
  // Conduct
  conductDays: number;
  conductStreak: number;
  lastActivityDate: Date;
  shieldStatus: 'green' | 'amber' | 'red';
  
  // Requirements completed
  sealedSessions: number;
  witnessReports: number;
  councilDuty: number;
  peerVouches: number;
  
  // Progression axes (3 of 5 required for ranks 4+)
  progressionAxes: {
    service: boolean;
    voice: boolean;
    community: boolean;
    truth: boolean;
    stewardship: boolean;
  };
  
  // Benefits
  benefits: RankBenefits;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastRankUpAt?: Date;
}

/**
 * Journey entry
 */
export interface JourneyEntry {
  id: string;
  activity: string;
  amount: number;
  date: Date;
  cappedOut: boolean;
}

/**
 * HonorSeed entry
 */
export interface HonorSeedEntry {
  id: string;
  activity: string;
  amount: number;
  fromUserId?: string;
  date: Date;
}

/**
 * Rank benefits
 */
export interface RankBenefits {
  canPost: boolean;
  canComment: boolean;
  canBless: boolean;
  canWitness: boolean;
  canMentor: boolean;
  cowrieLimit: number;
}

/**
 * Rank progress
 */
export interface RankProgress {
  currentStage: number;
  nextStage: number;
  nextRankName: string;
  
  // Progress percentages
  journeyProgress: number;
  honorSeedsProgress: number;
  conductProgress: number;
  overallProgress: number;
  
  // Missing requirements
  missingRequirements: string[];
  
  // Time estimate
  estimatedDaysToNextRank: number;
  bottleneck: 'journey' | 'seeds' | 'conduct' | 'requirements';
}

/**
 * Rank achievement
 */
export interface RankAchievement {
  id: string;
  userId: string;
  
  // Rank change
  fromStage: number;
  toStage: number;
  fromName: string;
  toName: string;
  
  // Celebration
  celebrated: boolean;
  celebrationMessage?: string;
  
  // Timestamp
  achievedAt: Date;
}

/**
 * Journey activity log
 */
export interface JourneyActivityLog {
  userId: string;
  date: Date;
  
  // Activities
  activities: Array<{
    type: string;
    count: number;
    journeyEarned: number;
  }>;
  
  // Daily totals
  totalJourney: number;
  cappedOut: boolean;
}

/**
 * Conduct tracker
 */
export interface ConductTracker {
  userId: string;
  
  // Streak
  currentStreak: number;
  longestStreak: number;
  
  // Daily activity
  lastActiveDate: Date;
  activeDaysThisWeek: number;
  activeDaysThisMonth: number;
  
  // Shield status history
  shieldHistory: ShieldHistoryEntry[];
}

/**
 * Shield history entry
 */
export interface ShieldHistoryEntry {
  status: 'green' | 'amber' | 'red';
  reason?: string;
  startDate: Date;
  endDate?: Date;
}

/**
 * Peer vouch
 */
export interface PeerVouch {
  id: string;
  voucherId: string;
  voucherName: string;
  recipientId: string;
  
  // Vouch details
  reason: string;
  category: 'skill' | 'character' | 'service' | 'leadership';
  
  // Verification
  verifiedByCouncil: boolean;
  
  // Timestamp
  vouchedAt: Date;
}

/**
 * Rank leaderboard entry
 */
export interface RankLeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  
  // Rank
  stage: number;
  rankName: string;
  
  // Stats
  journey: number;
  honorSeeds: number;
  conductDays: number;
  
  // Village
  villageId?: string;
}
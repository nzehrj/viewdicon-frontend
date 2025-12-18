// src/constants/ranks.ts
// Rank System Constants - 8 Stages

export const RANK_STAGES = [
  {
    stage: 0,
    name: 'New Voice',
    title: 'Newcomer',
    color: '#9ca3af',
    requirements: {
      journey: 0,
      honorSeeds: 0,
      conductDays: 0,
      sealedSessions: 0,
      witnessReports: 0,
      councilDuty: 0,
      peerVouches: 0,
    },
    benefits: {
      canPost: true,
      canComment: true,
      canBless: true,
      canWitness: false,
      canMentor: false,
      cowrieLimit: 1000,
    },
  },
  {
    stage: 1,
    name: 'First Step',
    title: 'Learner',
    color: '#84cc16',
    requirements: {
      journey: 50,
      honorSeeds: 10,
      conductDays: 3,
      sealedSessions: 0,
      witnessReports: 0,
      councilDuty: 0,
      peerVouches: 0,
    },
    benefits: {
      canPost: true,
      canComment: true,
      canBless: true,
      canWitness: false,
      canMentor: false,
      cowrieLimit: 5000,
    },
  },
  {
    stage: 2,
    name: 'Road Helper',
    title: 'Helper',
    color: '#10b981',
    requirements: {
      journey: 120,
      honorSeeds: 30,
      conductDays: 7,
      sealedSessions: 1,
      witnessReports: 0,
      councilDuty: 0,
      peerVouches: 2,
    },
    benefits: {
      canPost: true,
      canComment: true,
      canBless: true,
      canWitness: true,
      canMentor: false,
      cowrieLimit: 10000,
    },
  },
  {
    stage: 3,
    name: 'Steady Hand',
    title: 'Craftsman',
    color: '#3b82f6',
    requirements: {
      journey: 300,
      honorSeeds: 90,
      conductDays: 14,
      sealedSessions: 3,
      witnessReports: 2,
      councilDuty: 0,
      peerVouches: 5,
    },
    benefits: {
      canPost: true,
      canComment: true,
      canBless: true,
      canWitness: true,
      canMentor: true,
      cowrieLimit: 25000,
    },
  },
  {
    stage: 4,
    name: 'Hands That Gather',
    title: 'Builder',
    color: '#8b5cf6',
    requirements: {
      journey: 600,
      honorSeeds: 220,
      conductDays: 21,
      sealedSessions: 8,
      witnessReports: 5,
      councilDuty: 2,
      peerVouches: 10,
    },
    benefits: {
      canPost: true,
      canComment: true,
      canBless: true,
      canWitness: true,
      canMentor: true,
      cowrieLimit: 50000,
    },
  },
  {
    stage: 5,
    name: 'Voice That Carries',
    title: 'Speaker',
    color: '#ec4899',
    requirements: {
      journey: 1200,
      honorSeeds: 500,
      conductDays: 30,
      sealedSessions: 15,
      witnessReports: 10,
      councilDuty: 5,
      peerVouches: 20,
    },
    benefits: {
      canPost: true,
      canComment: true,
      canBless: true,
      canWitness: true,
      canMentor: true,
      cowrieLimit: 100000,
    },
  },
  {
    stage: 6,
    name: 'Elder Who Stands',
    title: 'Elder',
    color: '#f59e0b',
    requirements: {
      journey: 2400,
      honorSeeds: 1200,
      conductDays: 60,
      sealedSessions: 30,
      witnessReports: 20,
      councilDuty: 15,
      peerVouches: 40,
    },
    benefits: {
      canPost: true,
      canComment: true,
      canBless: true,
      canWitness: true,
      canMentor: true,
      cowrieLimit: 250000,
    },
  },
  {
    stage: 7,
    name: "Ancestor's Voice",
    title: 'Ancestor',
    color: '#dc2626',
    requirements: {
      journey: 5000,
      honorSeeds: 3000,
      conductDays: 90,
      sealedSessions: 60,
      witnessReports: 50,
      councilDuty: 30,
      peerVouches: 80,
    },
    benefits: {
      canPost: true,
      canComment: true,
      canBless: true,
      canWitness: true,
      canMentor: true,
      cowrieLimit: 1000000,
    },
  },
];

export const JOURNEY_CAPS = {
  DAILY: 30,
  WEEKLY: 160,
};

export const JOURNEY_ACTIVITIES = {
  POST_CONTENT: 5,
  GIVE_BLESSING: 3,
  REPLY_THREAD: 2,
  SEALED_SESSION: 10,
  WITNESS_REPORT: 8,
  COUNCIL_DUTY: 15,
  MENTORSHIP_SESSION: 12,
  DISPUTE_RESOLUTION: 20,
};

export const HONOR_SEED_ACTIVITIES = {
  RECEIVE_BLESSING: 2,
  RECEIVE_ELDER_BLESSING: 5,
  COMPLETE_SEALED_SESSION: 10,
  COUNCIL_SERVICE: 15,
  WITNESS_VERIFICATION: 5,
  MENTOR_APPRENTICE: 8,
  RESOLVE_DISPUTE: 12,
};

export const CONDUCT_REQUIREMENTS = {
  GREEN_SHIELD_DAYS: 'consecutive',
  RESET_ON_AMBER: true,
  RESET_ON_RED: true,
};

export const PROGRESSION_AXES = {
  SERVICE: 'Helping others, answering calls',
  VOICE: 'Speaking truth, witness reports',
  COMMUNITY: 'Building connections, mentoring',
  TRUTH: 'Verification, fact-checking',
  STEWARDSHIP: 'Council duty, governance',
};

export const DECAY_RULES = {
  JOURNEY_DECAY_PER_WEEK: 0.05,
  CONDUCT_RESET_DAYS: 7,
};

export const RANK_NAME_COMPONENTS = {
  STAGES: ['New Voice', 'First Step', 'Road Helper', 'Steady Hand', 'Hands That Gather', 'Voice That Carries', 'Elder Who Stands', "Ancestor's Voice"],
  PATHS: ['Bronze', 'Silver', 'Gold'],
  ADORNMENTS: ['Trowel', 'Hammer', 'Shield', 'Drum', 'Torch'],
  LINEAGES: ['Nile-Kin', 'Congo-Born', 'Sahel-Root', 'Coast-Seed'],
};

export const getRankColor = (stage: number): string => {
  return RANK_STAGES[stage]?.color || '#9ca3af';
};

export const getRankTitle = (stage: number): string => {
  return RANK_STAGES[stage]?.title || 'Newcomer';
};

export const meetsRequirements = (
  stats: {
    journey: number;
    honorSeeds: number;
    conductDays: number;
    sealedSessions: number;
    witnessReports: number;
    councilDuty: number;
    peerVouches: number;
  },
  targetStage: number
): boolean => {
  const req = RANK_STAGES[targetStage]?.requirements;
  if (!req) return false;

  return (
    stats.journey >= req.journey &&
    stats.honorSeeds >= req.honorSeeds &&
    stats.conductDays >= req.conductDays &&
    stats.sealedSessions >= req.sealedSessions &&
    stats.witnessReports >= req.witnessReports &&
    stats.councilDuty >= req.councilDuty &&
    stats.peerVouches >= req.peerVouches
  );
};

export const calculateProgress = (
  stats: {
    journey: number;
    honorSeeds: number;
    conductDays: number;
  },
  targetStage: number
): number => {
  const req = RANK_STAGES[targetStage]?.requirements;
  if (!req) return 100;

  const journeyProgress = Math.min((stats.journey / req.journey) * 100, 100);
  const seedsProgress = Math.min((stats.honorSeeds / req.honorSeeds) * 100, 100);
  const conductProgress = Math.min((stats.conductDays / req.conductDays) * 100, 100);

  return (journeyProgress + seedsProgress + conductProgress) / 3;
};
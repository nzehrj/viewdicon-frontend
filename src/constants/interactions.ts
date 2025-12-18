// constants/interactions.ts
// Social Interaction System Constants

import { InteractionType, SocialVoiceInteraction } from '@/types/social/pot.types';

/**
 * Interaction configurations with icons, labels, and colors
 */
export const INTERACTION_CONFIG = {
  // Core POT interactions
  [InteractionType.HEAR]: {
    id: 'hear',
    name: 'Gbọ́',
    englishName: 'Hear',
    icon: '👂🏽',
    color: '#10b981', // Emerald
    description: 'Basic acknowledgment',
    weight: 1,
    sound: '/sounds/hear.mp3',
  },
  [InteractionType.SPEAK]: {
    id: 'speak',
    name: 'Sọrọ',
    englishName: 'Speak',
    icon: '💬',
    color: '#3b82f6', // Blue
    description: 'Voice or text response',
    weight: 4,
    sound: '/sounds/speak.mp3',
  },
  [InteractionType.BLESS]: {
    id: 'bless',
    name: 'ÌBÙKÚN',
    englishName: 'Blessing',
    icon: '🪔',
    color: '#f59e0b', // Amber
    description: 'Respect, prayer, support',
    weight: 6,
    sound: '/sounds/blessing.mp3',
  },
  [InteractionType.COWRIE_DROP]: {
    id: 'cowrie',
    name: 'Kọ́wọ́',
    englishName: 'Cowrie Drop',
    icon: '💰',
    color: '#eab308', // Yellow
    description: 'Tip, gift, tribute',
    weight: 2, // Base, varies by amount
    sound: '/sounds/cowrie-drop.mp3',
  },
  [InteractionType.ECHO]: {
    id: 'echo',
    name: 'Tùsíkíẹ̀',
    englishName: 'Echo Drum',
    icon: '🪘',
    color: '#8b5cf6', // Purple
    description: 'Amplify, reshare',
    weight: 5,
    sound: '/sounds/drum-echo.mp3',
  },

  // Social Voice Feed specific
  [SocialVoiceInteraction.AMPLIFY]: {
    id: 'amplify',
    name: 'TUSIKIE',
    englishName: 'Amplify',
    icon: '📢',
    color: '#ec4899', // Pink
    description: 'Amplify/Repost',
    weight: 5,
    sound: '/sounds/amplify.mp3',
  },
  [SocialVoiceInteraction.VERIFY]: {
    id: 'verify',
    name: 'KUBALIKA',
    englishName: 'Verify',
    icon: '✓',
    color: '#10b981', // Green
    description: 'Verify/Vouch',
    weight: 7,
    sound: '/sounds/verify.mp3',
  },
  [SocialVoiceInteraction.UBUNTU]: {
    id: 'ubuntu',
    name: 'UBUNTU',
    englishName: 'Ubuntu',
    icon: '🤝',
    color: '#f97316', // Orange
    description: 'Blessing/Support',
    weight: 6,
    sound: '/sounds/ubuntu.mp3',
  },
  [SocialVoiceInteraction.TIP]: {
    id: 'tip',
    name: 'THANDANA',
    englishName: 'Show Love',
    icon: '💝',
    color: '#eab308', // Yellow
    description: 'Cowrie Tip',
    weight: 3,
    sound: '/sounds/tip.mp3',
  },
  [SocialVoiceInteraction.HELP]: {
    id: 'help',
    name: 'NGUVU',
    englishName: 'Power',
    icon: '💪🏽',
    color: '#dc2626', // Red
    description: "I'm going/I'll help",
    weight: 8,
    sound: '/sounds/help.mp3',
  },
  [SocialVoiceInteraction.PEACE]: {
    id: 'peace',
    name: 'RO™',
    englishName: 'Peace Flag',
    icon: '🕊️',
    color: '#06b6d4', // Cyan
    description: 'Peace flag - end conflict',
    weight: 10,
    sound: '/sounds/peace.mp3',
  },
} as const;

/**
 * Heat thresholds for pot lift
 */
export const HEAT_THRESHOLDS = {
  COLD: 0,
  WARM: 120,      // Local lift
  SIMMER: 300,    // Regional visibility boost
  BOILING: 400,   // Regional lift
  ANCESTRAL: 1200, // National/Pan-African lift
} as const;

/**
 * Actor multipliers based on role
 */
export const ACTOR_MULTIPLIERS = {
  CITIZEN: 1.0,
  WITNESS: 1.3,
  ELDER: 1.5,
  GUARDIAN: 1.8,
  COUNCIL: 2.0,
} as const;

/**
 * Diversity boost configuration
 */
export const DIVERSITY_CONFIG = {
  BOOST_PER_25_ACTORS: 0.1, // +10% per 25 unique actors
  MAX_BOOST: 0.5,           // Cap at +50%
  TIME_WINDOW_MINUTES: 10,
} as const;

/**
 * Village boost
 */
export const VILLAGE_BOOST = 1.25; // ×1.25 for same village

/**
 * Branch earnings (thread rewards)
 */
export const BRANCH_EARNINGS = {
  PERCENTAGE: 0.05,    // 5% of parent pot tips
  DURATION_HOURS: 48,
  MIN_HEAT_REQUIRED: 120, // Must reach "warm"
} as const;

/**
 * Amplifier rewards (echo earnings)
 */
export const AMPLIFIER_REWARDS = {
  MIN_PERCENTAGE: 0.005,  // 0.5%
  MAX_PERCENTAGE: 0.02,   // 2%
  DURATION_HOURS: 24,
} as const;

/**
 * Animation durations
 */
export const ANIMATION_DURATIONS = {
  INTERACTION_FEEDBACK: 300,
  HEAT_UPDATE: 500,
  POT_BOIL: 1000,
  COWRIE_DROP: 800,
  BLESSING_GLOW: 1200,
  ECHO_RIPPLE: 600,
} as const;

/**
 * Cooldown periods (prevent spam)
 */
export const COOLDOWNS = {
  HEAR: 0,           // No cooldown
  SPEAK: 5000,       // 5 seconds
  BLESS: 30000,      // 30 seconds
  COWRIE_DROP: 10000, // 10 seconds
  ECHO: 60000,       // 1 minute
} as const;

/**
 * Minimum Cowrie amounts
 */
export const MIN_COWRIE_AMOUNTS = {
  TIP: 1,
  SPRAY: 5,
  SUPPORT: 10,
  PLEDGE: 50,
} as const;
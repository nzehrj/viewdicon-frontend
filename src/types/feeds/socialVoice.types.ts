// src/types/feeds/socialVoice.types.ts
// Social Voice Feed Type Definitions

export type VoiceClass = 
  | 'citizen'
  | 'witness'
  | 'voice-of-record'
  | 'council-elder'
  | 'guardian'
  | 'creator';

export type PostType = 
  | 'voice-burst'
  | 'thread-chain'
  | 'image-caption'
  | 'live-room'
  | 'echo-snapshot'
  | 'proverb';

export type FeedScope = 
  | 'local-drum'
  | 'regional-stream'
  | 'national-beat'
  | 'pan-african';

export type ToneBadge = 
  | 'alert'
  | 'banter'
  | 'joy'
  | 'call'
  | 'proof'
  | 'wisdom';

export type SpecialMode = 
  | 'soro-now'
  | 'banter-zone'
  | 'debate-threads'
  | 'community-talk-room'
  | 'mentor-line';

/**
 * Social voice post
 */
export interface SocialVoicePost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  
  // Voice classification
  voiceClass: VoiceClass;
  verificationBadge?: VerificationBadge;
  
  // Content
  postType: PostType;
  text?: string;
  voiceUrl?: string; // 90-second max
  imageUrl?: string;
  
  // Context
  toneBadge: ToneBadge;
  purpose?: string;
  
  // Geographic
  location?: GeoLocation;
  geoLocked: boolean; // Witness posts
  
  // Thread
  isThread: boolean;
  threadId?: string;
  threadPosition?: number;
  maxThreadPosts?: number;
  
  // Witness
  isWitness: boolean;
  witnessProof?: WitnessProof;
  
  // Translation
  originalLanguage: string;
  translations?: Record<string, string>;
  
  // Scope & Lift
  currentScope: FeedScope;
  liftedScopes: FeedScope[];
  
  // Engagement
  potId: string;
  heat: number;
  
  // Interactions (Social Voice specific)
  amplifies: number; // TUSIKIE
  verifications: number; // KUBALIKA
  ubuntuSupport: number; // UBUNTU
  helps: number; // NGUVU
  peaceFlagged: boolean; // RO™
  
  // Safety
  safetyStatus: 'pass' | 'review' | 'flagged';
  truthStatus: 'verified' | 'disputed' | 'unverified';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Verification badge
 */
export interface VerificationBadge {
  type: 'crest' | 'witness' | 'journalist' | 'elder' | 'guardian' | 'creator';
  verifiedAt: Date;
  verifiedBy?: string;
  tier: 'bronze' | 'silver' | 'gold';
}

/**
 * Geographic location
 */
export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number; // meters
  city?: string;
  region?: string;
  country: string;
  capturedAt: Date;
}

/**
 * Witness proof
 */
export interface WitnessProof {
  geoLocation: GeoLocation;
  timestamp: Date;
  deviceFingerprint: string;
  networkInfo: string;
  
  // Corroboration
  corroboratingWitnesses: string[];
  counterEvidence: string[];
  
  // Verification
  orunmilaScore: number; // 0-100 truth confidence
  verifiedByCouncil: boolean;
}

/**
 * Thread chain
 */
export interface ThreadChain {
  id: string;
  authorId: string;
  
  // Thread content
  posts: SocialVoicePost[];
  totalPosts: number;
  
  // Summary
  title?: string;
  summary?: string;
  
  // Engagement
  combinedHeat: number;
  combinedPotId: string;
  
  // Status
  isComplete: boolean;
  
  // Timestamps
  startedAt: Date;
  completedAt?: Date;
}

/**
 * Live micro-room
 */
export interface LiveMicroRoom {
  id: string;
  hostId: string;
  hostName: string;
  
  // Room details
  title: string;
  description?: string;
  topic: string;
  
  // Participants
  speakers: RoomParticipant[];
  listeners: RoomParticipant[];
  maxSpeakers: number; // 50
  maxListeners: number; // 500
  
  // Status
  status: 'scheduled' | 'live' | 'ended';
  startedAt?: Date;
  endedAt?: Date;
  
  // Features
  liveTranslation: boolean;
  recordingEnabled: boolean;
  recordingUrl?: string;
  
  // Moderation
  moderators: string[];
  respectFilter: boolean;
  
  // Engagement
  heat: number;
  potId: string;
}

/**
 * Room participant
 */
export interface RoomParticipant {
  userId: string;
  userName: string;
  voiceClass: VoiceClass;
  role: 'host' | 'speaker' | 'listener' | 'moderator';
  joinedAt: Date;
  isMuted: boolean;
  handRaised: boolean;
}

/**
 * Echo snapshot (curated highlight)
 */
export interface EchoSnapshot {
  id: string;
  originalPostId: string;
  
  // Content
  videoUrl: string;
  duration: number; // 30 seconds
  caption: string;
  
  // Auto-curation
  curatedBy: 'ai' | 'user' | 'council';
  curatedAt: Date;
  
  // Context
  contextBefore: string;
  contextAfter: string;
  
  // Engagement
  views: number;
  echoes: number;
}

/**
 * Proverb/Quote drop
 */
export interface ProverbDrop {
  id: string;
  authorId: string;
  authorName: string;
  
  // Content
  text: string;
  voiceUrl?: string;
  
  // Classification
  type: 'proverb' | 'quote' | 'correction' | 'wisdom';
  language: string;
  origin?: string; // Ethnic group or source
  
  // Context
  targetPostId?: string; // If correcting another post
  purpose: 'teach' | 'correct' | 'inspire' | 'warn';
  
  // Engagement
  potId: string;
  heat: number;
  
  // Timestamps
  createdAt: Date;
}

/**
 * Soro-Now alert
 */
export interface SoroNowAlert {
  id: string;
  postId: string;
  
  // Alert details
  type: 'emergency' | 'urgent-news' | 'call-to-action' | 'witness-needed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Geographic
  location: GeoLocation;
  radius: number; // Alert radius in km
  
  // Status
  active: boolean;
  resolved: boolean;
  
  // Timestamps
  createdAt: Date;
  expiresAt: Date;
  resolvedAt?: Date;
}

/**
 * Debate thread
 */
export interface DebateThread {
  id: string;
  
  // Topic
  topic: string;
  description: string;
  
  // Positions
  sides: DebateSide[];
  
  // Moderation
  moderatorId: string;
  rules: string[];
  
  // Status
  status: 'open' | 'active' | 'concluded';
  
  // Timestamps
  startedAt: Date;
  endsAt?: Date;
  concludedAt?: Date;
}

/**
 * Debate side
 */
export interface DebateSide {
  id: string;
  position: string;
  speakers: string[];
  arguments: SocialVoicePost[];
  supportCount: number;
}

/**
 * Respect filter
 */
export interface RespectFilter {
  enabled: boolean;
  level: 'low' | 'medium' | 'high';
  blockedWords: string[];
  autoModerate: boolean;
}

/**
 * Social voice filters
 */
export interface SocialVoiceFilters {
  voiceClass?: VoiceClass;
  postType?: PostType;
  scope?: FeedScope;
  toneBadge?: ToneBadge;
  witnessOnly?: boolean;
  verifiedOnly?: boolean;
  location?: string;
  timeRange?: 'today' | 'week' | 'month' | 'all';
}

/**
 * Social voice stats
 */
export interface SocialVoiceStats {
  totalPosts: number;
  witnessPosts: number;
  verifiedPosts: number;
  liveRooms: number;
  avgHeatPerPost: number;
  topVoiceClass: VoiceClass;
  topTone: ToneBadge;
  topScope: FeedScope;
}
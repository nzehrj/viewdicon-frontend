// src/types/tv/sorosoke.types.ts
// Sorosoke (Speak Up / Call-In System) Type Definitions

export type SorosokeCallStatus = 
  | 'queued'
  | 'live'
  | 'ended'
  | 'rejected'
  | 'dropped';

export type CallType = 
  | 'voice'
  | 'video'
  | 'text';

export type ModeratorAction = 
  | 'approve'
  | 'reject'
  | 'mute'
  | 'kick'
  | 'promote';

/**
 * Sorosoke session (call-in show)
 */
export interface SorosokeSession {
  id: string;
  programId: string;
  channelId: string;
  
  // Host
  hostId: string;
  hostName: string;
  
  // Session details
  topic: string;
  description?: string;
  
  // Status
  active: boolean;
  
  // Queue
  callQueue: SorosokeCall[];
  maxQueueSize: number;
  
  // Live callers
  liveCallers: SorosokeCall[];
  maxLiveCallers: number; // Usually 1-3
  
  // Moderators
  moderators: string[];
  
  // Features
  respectFilterEnabled: boolean;
  translationEnabled: boolean;
  
  // Stats
  totalCalls: number;
  totalCallTime: number; // seconds
  
  // Timestamps
  startedAt: Date;
  endedAt?: Date;
}

/**
 * Sorosoke call
 */
export interface SorosokeCall {
  id: string;
  sessionId: string;
  
  // Caller
  callerId: string;
  callerName: string;
  callerAvatar?: string;
  callerVillageId?: string;
  
  // Call details
  type: CallType;
  question?: string;
  
  // Queue
  queuePosition: number;
  queuedAt: Date;
  
  // Live call
  status: SorosokeCallStatus;
  connectedAt?: Date;
  endedAt?: Date;
  duration?: number; // seconds
  
  // Moderation
  approved: boolean;
  approvedBy?: string;
  rejectionReason?: string;
  
  // Quality
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  
  // Engagement
  heat: number;
  cowrieReceived: number;
  
  // Recording
  recordingUrl?: string;
}

/**
 * Sorosoke bundle (pre-purchased call slots)
 */
export interface SorosokeBundle {
  id: string;
  userId: string;
  
  // Bundle details
  name: string;
  callsIncluded: number;
  callsUsed: number;
  callsRemaining: number;
  
  // Pricing
  price: number;
  pricePerCall: number;
  
  // Expiry
  expiresAt?: Date;
  
  // Timestamps
  purchasedAt: Date;
}

/**
 * Sorosoke purchase
 */
export interface SorosokePurchase {
  id: string;
  userId: string;
  
  // Purchase type
  type: 'single-call' | 'bundle';
  bundleId?: string;
  
  // Pricing
  amount: number;
  
  // Payment
  paymentMethod: 'cowrie' | 'external';
  transactionId: string;
  
  // Status
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  
  // Timestamps
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Call queue entry
 */
export interface CallQueueEntry {
  call: SorosokeCall;
  waitTime: number; // seconds
  estimatedTime: number; // Estimated time until live
}

/**
 * Moderator controls
 */
export interface ModeratorControls {
  sessionId: string;
  moderatorId: string;
  
  // Available actions
  canApprove: boolean;
  canReject: boolean;
  canMute: boolean;
  canKick: boolean;
  canPromote: boolean;
  
  // Current call
  currentCallId?: string;
}

/**
 * Respect filter
 */
export interface RespectFilter {
  sessionId: string;
  
  // Settings
  enabled: boolean;
  strictness: 'low' | 'medium' | 'high';
  
  // Rules
  blockedPhrases: string[];
  warningPhrases: string[];
  
  // Actions
  autoMute: boolean;
  autoKick: boolean;
  notifyModerator: boolean;
}

/**
 * Translation overlay
 */
export interface TranslationOverlay {
  callId: string;
  
  // Source
  originalLanguage: string;
  originalText: string;
  
  // Translations
  translations: Record<string, string>;
  
  // Display
  visible: boolean;
  targetLanguage: string;
  
  // Timestamp
  timestamp: Date;
}

/**
 * Call rating
 */
export interface CallRating {
  callId: string;
  sessionId: string;
  
  // Ratings
  hostRating?: number; // 1-5
  callerRating?: number; // 1-5
  viewerRatings: ViewerRating[];
  
  // Aggregate
  avgViewerRating: number;
  totalRatings: number;
}

/**
 * Viewer rating
 */
export interface ViewerRating {
  userId: string;
  rating: number; // 1-5
  comment?: string;
  timestamp: Date;
}

/**
 * DJ telemetry (live metrics)
 */
export interface DJTelemetry {
  sessionId: string;
  
  // Live metrics
  viewerCount: number;
  peakViewers: number;
  queueLength: number;
  averageWaitTime: number; // seconds
  
  // Call metrics
  totalCallsToday: number;
  avgCallDuration: number; // seconds
  
  // Engagement
  totalHeat: number;
  totalCowrie: number;
  
  // Quality
  avgConnectionQuality: number; // 0-100
  droppedCalls: number;
  
  // Timestamp
  lastUpdated: Date;
}

/**
 * Sorosoke analytics
 */
export interface SorosokeAnalytics {
  sessionId: string;
  
  // Call stats
  totalCalls: number;
  approvedCalls: number;
  rejectedCalls: number;
  avgCallDuration: number;
  
  // Caller demographics
  uniqueCallers: number;
  topVillages: Array<{ villageId: string; count: number }>;
  
  // Engagement
  totalHeat: number;
  totalCowrie: number;
  avgHeatPerCall: number;
  
  // Quality
  avgConnectionQuality: number;
  technicalIssues: number;
  
  // Timing
  peakCallTime: Date;
  slowestQueueTime: number;
}

/**
 * Sorosoke filters
 */
export interface SorosokeFilters {
  channelId?: string;
  callStatus?: SorosokeCallStatus;
  callType?: CallType;
  villageId?: string;
  minDuration?: number;
  timeRange?: 'today' | 'week' | 'month' | 'all';
}

/**
 * Sorosoke stats
 */
export interface SorosokeStats {
  totalSessions: number;
  activeSessions: number;
  totalCalls: number;
  totalCallTime: number; // seconds
  avgCallDuration: number;
  totalBundlesSold: number;
  totalRevenue: number;
  uniqueCallers: number;
  repeatCallers: number;
}
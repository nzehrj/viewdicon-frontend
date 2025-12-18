// src/types/feeds/performance.types.ts
// Performance Feed Type Definitions

export type EntrySkin = 'work' | 'public' | 'clan';

export type RecordingMode = 
  | 'quick-clip'
  | 'knowledge-drop'
  | 'proof-of-hand'
  | 'clan-voice'
  | 'live-classroom'
  | 'open-drum'
  | 'whisper-mode';

export type AudienceScope = 
  | 'village'
  | 'clan'
  | 'nation'
  | 'private';

export type RecordingDestination = 
  | 'feed'
  | 'knowledge-basket'
  | 'live'
  | 'safety';

/**
 * Performance post
 */
export interface PerformancePost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userVillageId: string;
  
  // Content
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description?: string;
  duration: number; // seconds
  
  // Recording context
  entrySkin: EntrySkin;
  recordingMode: RecordingMode;
  audienceScope: AudienceScope;
  
  // Safety & Trust
  trustBandVisible: boolean;
  skinMode: EntrySkin;
  safetyShield: 'green' | 'amber' | 'red';
  
  // Metadata
  tags: string[];
  villageId: string;
  knowledgeBasket: boolean; // Saved for future reference
  
  // Engagement
  potId: string;
  heat: number;
  views: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Recording session
 */
export interface RecordingSession {
  id: string;
  userId: string;
  mode: RecordingMode;
  entrySkin: EntrySkin;
  
  // Recording state
  status: 'recording' | 'paused' | 'stopped' | 'processing' | 'published';
  startTime: Date;
  duration: number;
  
  // Media
  videoBlob?: Blob;
  thumbnailBlob?: Blob;
  
  // Settings
  audienceScope: AudienceScope;
  trustBandVisible: boolean;
  safetyToggles: SafetyToggles;
}

/**
 * Safety toggles for recording
 */
export interface SafetyToggles {
  locationVisible: boolean;
  timestampVisible: boolean;
  deviceInfoVisible: boolean;
  networkVisible: boolean;
}

/**
 * Knowledge basket item
 */
export interface KnowledgeBasketItem {
  id: string;
  postId: string;
  userId: string;
  
  // Organization
  category: string;
  subcategory?: string;
  tags: string[];
  
  // Content
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  
  // Metadata
  savedAt: Date;
  views: number;
  usefulness: number; // User rating
}

/**
 * Live classroom session
 */
export interface LiveClassroom {
  id: string;
  hostId: string;
  hostName: string;
  
  // Session details
  title: string;
  description: string;
  villageId: string;
  
  // Status
  status: 'scheduled' | 'live' | 'ended';
  scheduledFor?: Date;
  startedAt?: Date;
  endedAt?: Date;
  
  // Participants
  maxParticipants: number;
  currentParticipants: number;
  participantIds: string[];
  
  // Access
  isPrivate: boolean;
  cowriePrice?: number;
  
  // Engagement
  heat: number;
  potId: string;
}

/**
 * Whisper mode post (safety/sensitive)
 */
export interface WhisperPost {
  id: string;
  userId: string;
  
  // Content
  videoUrl: string;
  duration: number;
  encryptionKey?: string; // For sensitive content
  
  // Visibility
  visibleTo: 'council' | 'guardian' | 'specific-users';
  allowedUserIds?: string[];
  
  // Safety
  reason: 'safety' | 'testimony' | 'confidential';
  verifiedBy?: string; // Council member ID
  
  // Timestamps
  createdAt: Date;
  expiresAt?: Date; // Auto-delete after time
}

/**
 * Performance filter options
 */
export interface PerformanceFilters {
  entrySkin?: EntrySkin;
  recordingMode?: RecordingMode;
  villageId?: string;
  minHeat?: number;
  timeRange?: 'today' | 'week' | 'month' | 'all';
  knowledgeBasketOnly?: boolean;
}

/**
 * Performance stats
 */
export interface PerformanceStats {
  totalPosts: number;
  totalViews: number;
  totalHeat: number;
  knowledgeBasketItems: number;
  liveClassrooms: number;
  avgViewsPerPost: number;
  topRecordingMode: RecordingMode;
}
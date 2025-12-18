// src/types/tv/tv.types.ts
// Jollof TV System Type Definitions

export type TVMode = 
  | 'bubble'
  | 'half-screen'
  | 'floating'
  | 'native-pip'
  | 'fullscreen';

export type ChannelType = 
  | 'village'
  | 'region'
  | 'national'
  | 'pan-african'
  | 'community';

export type ProgramType = 
  | 'live-event'
  | 'performance'
  | 'news'
  | 'education'
  | 'entertainment'
  | 'documentary'
  | 'sorosoke-show';

export type StreamQuality = 
  | 'auto'
  | '360p'
  | '480p'
  | '720p'
  | '1080p';

/**
 * TV channel
 */
export interface TVChannel {
  id: string;
  name: string;
  slug: string;
  
  // Branding
  logo: string;
  bannerImage: string;
  color: string;
  
  // Type & Scope
  type: ChannelType;
  villageId?: string;
  region?: string;
  country?: string;
  
  // Description
  description: string;
  categories: string[];
  
  // Schedule
  schedule: TVProgram[];
  currentProgram?: TVProgram;
  upcomingPrograms: TVProgram[];
  
  // Stream
  streamUrl: string;
  isLive: boolean;
  viewerCount: number;
  
  // Subscribers
  subscriberCount: number;
  
  // Status
  active: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * TV program
 */
export interface TVProgram {
  id: string;
  channelId: string;
  
  // Content
  title: string;
  description: string;
  type: ProgramType;
  
  // Media
  thumbnailUrl: string;
  videoUrl?: string;
  
  // Schedule
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  
  // Village hour (17:00-19:00 daily)
  isVillageHour: boolean;
  villageId?: string;
  
  // Event integration
  eventId?: string;
  
  // Status
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  
  // Engagement
  potId?: string;
  heat: number;
  viewerCount: number;
  peakViewers: number;
  
  // Recording
  recordingAvailable: boolean;
  recordingUrl?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * TV booking
 */
export interface TVBooking {
  id: string;
  channelId: string;
  bookerId: string;
  bookerName: string;
  
  // Program details
  title: string;
  description: string;
  type: ProgramType;
  
  // Timing
  requestedDate: Date;
  requestedTimeSlot: TimeSlot;
  duration: number; // minutes
  
  // Pricing
  price: number;
  villageDiscount?: number;
  finalPrice: number;
  
  // Payment
  paid: boolean;
  paymentId?: string;
  
  // Approval
  status: 'pending' | 'approved' | 'rejected' | 'scheduled' | 'completed';
  approvedBy?: string;
  rejectionReason?: string;
  
  // Scheduled program
  programId?: string;
  
  // Timestamps
  requestedAt: Date;
  approvedAt?: Date;
  scheduledAt?: Date;
}

/**
 * Time slot
 */
export interface TimeSlot {
  start: string; // HH:mm
  end: string; // HH:mm
}

/**
 * TV viewer session
 */
export interface TVViewerSession {
  id: string;
  userId: string;
  channelId: string;
  programId?: string;
  
  // Viewing
  startedAt: Date;
  endedAt?: Date;
  duration: number; // seconds
  
  // Engagement
  interacted: boolean;
  cowrieDropped: number;
  sorosokeParticipated: boolean;
  
  // Quality
  quality: StreamQuality;
  buffering: number; // Total seconds buffered
}

/**
 * TV player state
 */
export interface TVPlayerState {
  // Current playback
  channelId: string;
  programId?: string;
  
  // Mode
  mode: TVMode;
  position: PlayerPosition;
  
  // Playback
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  quality: StreamQuality;
  
  // Picture-in-Picture
  isPiP: boolean;
  
  // Telemetry
  viewerCount: number;
  heat: number;
  
  // Sorosoke
  sorosokeActive: boolean;
}

/**
 * Player position (for floating/bubble modes)
 */
export interface PlayerPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Village hour slot
 */
export interface VillageHourSlot {
  id: string;
  channelId: string;
  villageId: string;
  
  // Schedule (daily 17:00-19:00)
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  startTime: string; // "17:00"
  endTime: string; // "19:00"
  
  // Assignment
  assignedTo?: string; // User/org ID
  programTitle?: string;
  
  // Status
  active: boolean;
  
  // Booking
  availableForBooking: boolean;
  bookingPrice: number;
}

/**
 * TV scheduler
 */
export interface TVScheduler {
  channelId: string;
  
  // Schedule
  programs: TVProgram[];
  villageHours: VillageHourSlot[];
  
  // Conflicts
  conflicts: ScheduleConflict[];
  
  // Stats
  totalSlots: number;
  bookedSlots: number;
  availableSlots: number;
}

/**
 * Schedule conflict
 */
export interface ScheduleConflict {
  id: string;
  type: 'overlap' | 'gap' | 'overrun';
  program1Id: string;
  program2Id?: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Cowrie rain event
 */
export interface CowrieRainEvent {
  id: string;
  programId: string;
  
  // Rain details
  totalCowrie: number;
  participants: string[];
  
  // Animation
  startTime: Date;
  duration: number; // seconds
  
  // Trigger
  triggeredBy: 'milestone' | 'manual' | 'heat-threshold';
}

/**
 * TV filters
 */
export interface TVFilters {
  channelType?: ChannelType;
  programType?: ProgramType;
  villageId?: string;
  region?: string;
  isLive?: boolean;
  hasVillageHour?: boolean;
}

/**
 * TV stats
 */
export interface TVStats {
  totalChannels: number;
  activeChannels: number;
  livePrograms: number;
  totalViewers: number;
  totalProgramsToday: number;
  villageHoursToday: number;
  avgViewersPerProgram: number;
  peakViewers: number;
  totalCowrieDropped: number;
}
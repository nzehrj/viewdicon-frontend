// src/types/events/event.types.ts
// Event System Type Definitions

export type EventCategory = 
  | 'performance'
  | 'conference'
  | 'workshop'
  | 'networking'
  | 'marketplace'
  | 'cultural';

export type EventStatus = 
  | 'draft'
  | 'published'
  | 'live'
  | 'ended'
  | 'cancelled';

export type StreamingMode = 
  | 'none'
  | 'watch-party'
  | 'tv-broadcast'
  | 'hybrid';

/**
 * Event
 */
export interface Event {
  id: string;
  organizerId: string;
  organizerName: string;
  organizerAvatar?: string;
  
  // Event details
  title: string;
  description: string;
  category: EventCategory;
  tags: string[];
  
  // Location
  isVirtual: boolean;
  physicalLocation?: string;
  virtualLink?: string;
  
  // Date & Time
  startDate: Date;
  endDate: Date;
  timezone: string;
  
  // Capacity
  maxAttendees?: number;
  currentAttendees: number;
  
  // Media
  coverImage: string;
  promoVideo?: string;
  
  // Tickets
  tickets: EventTicketTier[];
  totalTicketsSold: number;
  totalRevenue: number;
  
  // Streaming
  streamingMode: StreamingMode;
  tvChannelId?: string;
  streamUrl?: string;
  
  // Features
  hasShowcase: boolean; // Exhibitor booths
  hasTradeZone: boolean; // Business networking
  hasLiveStream: boolean;
  
  // Status
  status: EventStatus;
  
  // Engagement
  potId: string;
  heat: number;
  views: number;
  
  // Village
  villageId?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Event ticket tier
 */
export interface EventTicketTier {
  id: string;
  name: string;
  description: string;
  
  // Pricing
  price: number;
  originalPrice?: number; // For early bird
  
  // Capacity
  capacity: number;
  sold: number;
  available: number;
  
  // Benefits
  benefits: string[];
  
  // Access
  accessLevel: 'general' | 'vip' | 'backstage' | 'premium';
  includesRecording: boolean;
  includesShowcase: boolean;
  
  // Sale period
  saleStartDate?: Date;
  saleEndDate?: Date;
}

/**
 * Event schedule
 */
export interface EventSchedule {
  eventId: string;
  
  // Sessions
  sessions: EventSession[];
  
  // Timeline
  totalDuration: number; // minutes
}

/**
 * Event session
 */
export interface EventSession {
  id: string;
  eventId: string;
  
  // Details
  title: string;
  description: string;
  type: 'talk' | 'workshop' | 'panel' | 'performance' | 'networking' | 'break';
  
  // Timing
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  
  // Speakers/Performers
  speakers: EventSpeaker[];
  
  // Location (for hybrid events)
  location?: string;
  virtualRoom?: string;
  
  // Recording
  recordingUrl?: string;
}

/**
 * Event speaker
 */
export interface EventSpeaker {
  userId: string;
  name: string;
  avatar?: string;
  title: string;
  bio: string;
  villageId?: string;
}

/**
 * Event showcase (exhibitor booth)
 */
export interface EventShowcase {
  id: string;
  eventId: string;
  exhibitorId: string;
  exhibitorName: string;
  
  // Booth details
  boothNumber?: string;
  title: string;
  description: string;
  
  // Media
  bannerImage: string;
  videoUrl?: string;
  documents: string[];
  
  // Products/Services
  offerings: ShowcaseOffering[];
  
  // Staff
  staff: string[];
  
  // Engagement
  visitors: number;
  connections: number;
  
  // Virtual booth
  virtualRoomUrl?: string;
  chatEnabled: boolean;
}

/**
 * Showcase offering
 */
export interface ShowcaseOffering {
  id: string;
  name: string;
  description: string;
  price?: number;
  imageUrl?: string;
  link?: string;
}

/**
 * Event trade zone
 */
export interface EventTradeZone {
  eventId: string;
  
  // Networking
  connections: TradeConnection[];
  
  // Business chat threads
  chatThreads: string[];
  
  // Scheduled meetings
  meetings: TradeMeeting[];
}

/**
 * Trade connection
 */
export interface TradeConnection {
  id: string;
  user1Id: string;
  user2Id: string;
  
  // Context
  connectedAt: Date;
  meetingScheduled: boolean;
  
  // Follow-up
  notes?: string;
  status: 'pending' | 'active' | 'completed';
}

/**
 * Trade meeting
 */
export interface TradeMeeting {
  id: string;
  participants: string[];
  
  // Meeting details
  title: string;
  agenda?: string;
  
  // Timing
  scheduledFor: Date;
  duration: number; // minutes
  
  // Location
  location?: string;
  virtualRoom?: string;
  
  // Status
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

/**
 * Event attendee
 */
export interface EventAttendee {
  userId: string;
  eventId: string;
  
  // Ticket
  ticketId: string;
  ticketTier: string;
  
  // Check-in
  checkedIn: boolean;
  checkInTime?: Date;
  auraBeaconId?: string;
  
  // Engagement
  sessionsAttended: string[];
  showcasesVisited: string[];
  connectionsUserId: string[];
  
  // Status
  status: 'registered' | 'attended' | 'no-show';
}

/**
 * Event recording
 */
export interface EventRecording {
  id: string;
  eventId: string;
  sessionId?: string;
  
  // Content
  title: string;
  videoUrl: string;
  duration: number;
  
  // Access
  publicAccess: boolean;
  ticketHolderOnly: boolean;
  
  // Timestamps
  recordedAt: Date;
  publishedAt?: Date;
}

/**
 * Event filters
 */
export interface EventFilters {
  category?: EventCategory;
  status?: EventStatus;
  isVirtual?: boolean;
  villageId?: string;
  startDate?: Date;
  endDate?: Date;
  priceMin?: number;
  priceMax?: number;
  hasTickets?: boolean;
}

/**
 * Event stats
 */
export interface EventStats {
  totalEvents: number;
  liveEvents: number;
  totalAttendees: number;
  totalRevenue: number;
  avgAttendeesPerEvent: number;
  topCategory: EventCategory;
  upcomingEvents: number;
}
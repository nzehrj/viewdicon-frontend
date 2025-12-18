// src/types/feeds/marketplace.types.ts
// Marketplace Feed Type Definitions

export type MarketSection = 'market' | 'stage' | 'hall' | 'collab' | 'fair';

export type ItemType = 
  | 'product'
  | 'service'
  | 'event'
  | 'mentorship'
  | 'collaboration';

export type PriceModel = 
  | 'fixed'
  | 'range'
  | 'bid'
  | 'slots'
  | 'bulk';

export type DeliveryMode = 
  | 'pickup'
  | 'courier'
  | 'bulk'
  | 'digital';

export type ListingStatus = 
  | 'active'
  | 'sold-out'
  | 'paused'
  | 'archived';

/**
 * Marketplace listing
 */
export interface MarketplaceListing {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  sellerVillageId: string;
  
  // Content
  itemType: ItemType;
  section: MarketSection;
  title: string;
  description: string;
  images: string[];
  videoUrl?: string;
  
  // Pricing
  priceModel: PriceModel;
  price?: number; // Fixed price
  minPrice?: number; // Range or bid
  maxPrice?: number; // Range
  bulkPricing?: BulkPricing[];
  slotsAvailable?: number;
  slotsSold?: number;
  
  // Delivery
  deliveryModes: DeliveryMode[];
  location?: string;
  
  // Status
  status: ListingStatus;
  stock?: number;
  
  // Engagement
  potId: string;
  heat: number;
  views: number;
  addedToPotCount: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

/**
 * Bulk pricing tier
 */
export interface BulkPricing {
  minQuantity: number;
  maxQuantity?: number;
  pricePerUnit: number;
}

/**
 * Event listing (for Stage/Hall)
 */
export interface EventListing extends MarketplaceListing {
  itemType: 'event';
  
  // Event details
  eventDate: Date;
  eventDuration: number; // minutes
  location: string;
  isVirtual: boolean;
  virtualLink?: string;
  
  // Tickets
  tickets: TicketTier[];
  totalCapacity: number;
  soldTickets: number;
  
  // Event type
  eventType: 'performance' | 'conference' | 'workshop' | 'networking';
  
  // Streaming
  streamToTV: boolean;
  tvChannelId?: string;
}

/**
 * Ticket tier for events
 */
export interface TicketTier {
  id: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;
  benefits: string[];
}

/**
 * Service listing
 */
export interface ServiceListing extends MarketplaceListing {
  itemType: 'service';
  
  // Service details
  serviceType: string;
  duration?: number; // minutes
  availability: ServiceAvailability;
  
  // Booking
  requiresBooking: boolean;
  instantBook: boolean;
}

/**
 * Service availability
 */
export interface ServiceAvailability {
  days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  timeSlots: TimeSlot[];
}

/**
 * Time slot
 */
export interface TimeSlot {
  start: string; // HH:mm
  end: string; // HH:mm
}

/**
 * Mentorship listing
 */
export interface MentorshipListing extends MarketplaceListing {
  itemType: 'mentorship';
  
  // Mentor details
  expertise: string[];
  experience: string;
  languages: string[];
  
  // Program
  programDuration: number; // weeks
  sessionsPerWeek: number;
  sessionDuration: number; // minutes
  
  // Availability
  spotsAvailable: number;
  spotsTaken: number;
}

/**
 * Collaboration listing
 */
export interface CollaborationListing extends MarketplaceListing {
  itemType: 'collaboration';
  
  // Collaboration details
  collaborationType: 'partnership' | 'joint-venture' | 'skill-exchange' | 'co-creation';
  lookingFor: string[];
  offering: string[];
  
  // Requirements
  villagePreference?: string[];
  rankMinimum?: number;
  
  // Pot mechanics
  sharedPotId?: string; // For joint projects
}

/**
 * Purchase transaction
 */
export interface MarketplaceTransaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  
  // Items
  quantity: number;
  totalAmount: number;
  
  // Escrow
  escrowId: string;
  escrowStatus: 'pending' | 'locked' | 'in_delivery' | 'released' | 'disputed';
  
  // Delivery
  deliveryMode: DeliveryMode;
  deliveryAddress?: string;
  voicePickupCode?: string;
  riderId?: string;
  
  // Business chat
  chatThreadId: string;
  
  // Status
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  
  // Timestamps
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Business chat thread
 */
export interface BusinessChatThread {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  
  // Participants
  participants: ChatParticipant[];
  
  // Guardian AI
  guardianActive: boolean;
  guardianAlerts: GuardianAlert[];
  
  // Messages
  messages: ChatMessage[];
  
  // Status
  status: 'active' | 'completed' | 'disputed';
  
  // Timestamps
  createdAt: Date;
  lastMessageAt: Date;
}

/**
 * Chat participant
 */
export interface ChatParticipant {
  userId: string;
  role: 'buyer' | 'seller' | 'guardian' | 'rider';
  joinedAt: Date;
}

/**
 * Chat message
 */
export interface ChatMessage {
  id: string;
  senderId: string;
  text?: string;
  voiceUrl?: string;
  imageUrl?: string;
  
  // Guardian scan
  scannedByGuardian: boolean;
  flagged: boolean;
  
  timestamp: Date;
}

/**
 * Guardian AI alert
 */
export interface GuardianAlert {
  id: string;
  type: 'scam' | 'pressure' | 'unsafe-meetup' | 'fake-item';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: Date;
}

/**
 * Marketplace filters
 */
export interface MarketplaceFilters {
  section?: MarketSection;
  itemType?: ItemType;
  villageId?: string;
  priceMin?: number;
  priceMax?: number;
  deliveryMode?: DeliveryMode;
  location?: string;
  searchQuery?: string;
}

/**
 * Marketplace stats
 */
export interface MarketplaceStats {
  totalListings: number;
  activeListings: number;
  totalTransactions: number;
  totalRevenue: number;
  avgTransactionValue: number;
  topCategory: ItemType;
  topSection: MarketSection;
}
// src/types/events/ticket.types.ts
// Ticketing System Type Definitions

export type TicketStatus = 
  | 'active'
  | 'used'
  | 'transferred'
  | 'resold'
  | 'cancelled'
  | 'expired';

export type TransferStatus = 
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'expired';

/**
 * Event ticket (Cowrie Pass)
 */
export interface EventTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  
  // Owner
  ownerId: string;
  ownerName: string;
  originalBuyerId: string;
  
  // Ticket details
  tierName: string;
  tierLevel: 'general' | 'vip' | 'backstage' | 'premium';
  
  // Pricing
  originalPrice: number;
  paidAmount: number;
  
  // QR/AURA
  qrCode: string;
  auraBeaconId?: string;
  
  // Access
  benefits: string[];
  includesRecording: boolean;
  includesShowcase: boolean;
  
  // Status
  status: TicketStatus;
  
  // Check-in
  checkedIn: boolean;
  checkInTime?: Date;
  checkInLocation?: string;
  
  // Transfer history
  transferHistory: TicketTransfer[];
  
  // Resale
  listedForResale: boolean;
  resalePrice?: number;
  
  // Timestamps
  purchasedAt: Date;
  validUntil: Date;
  usedAt?: Date;
}

/**
 * Ticket transfer
 */
export interface TicketTransfer {
  id: string;
  ticketId: string;
  
  // Transfer details
  fromUserId: string;
  toUserId: string;
  toUserEmail?: string;
  
  // Status
  status: TransferStatus;
  
  // Message
  message?: string;
  
  // Timestamps
  initiatedAt: Date;
  acceptedAt?: Date;
  declinedAt?: Date;
  expiresAt: Date;
}

/**
 * Ticket resale listing
 */
export interface TicketResaleListing {
  id: string;
  ticketId: string;
  sellerId: string;
  
  // Pricing
  originalPrice: number;
  askingPrice: number;
  
  // Event details
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  tierName: string;
  
  // Status
  status: 'active' | 'sold' | 'cancelled';
  
  // Escrow
  escrowId?: string;
  
  // Timestamps
  listedAt: Date;
  soldAt?: Date;
}

/**
 * Ticket purchase
 */
export interface TicketPurchase {
  id: string;
  eventId: string;
  buyerId: string;
  
  // Items
  tickets: PurchasedTicket[];
  totalQuantity: number;
  
  // Pricing
  subtotal: number;
  platformFee: number;
  total: number;
  
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
 * Purchased ticket
 */
export interface PurchasedTicket {
  tierId: string;
  tierName: string;
  quantity: number;
  pricePerTicket: number;
  total: number;
}

/**
 * AURA beacon (check-in device)
 */
export interface AURABeacon {
  id: string;
  eventId: string;
  
  // Device
  deviceId: string;
  location: string;
  
  // Status
  active: boolean;
  
  // Stats
  totalCheckIns: number;
  lastCheckIn?: Date;
  
  // Timestamps
  activatedAt: Date;
  deactivatedAt?: Date;
}

/**
 * Check-in record
 */
export interface CheckInRecord {
  id: string;
  ticketId: string;
  eventId: string;
  
  // User
  userId: string;
  userName: string;
  
  // Check-in details
  beaconId?: string;
  location: string;
  method: 'qr' | 'aura' | 'manual';
  
  // Verification
  verified: boolean;
  verifiedBy?: string;
  
  // Timestamp
  checkedInAt: Date;
}

/**
 * Attendee list entry
 */
export interface AttendeeListEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  
  // Ticket
  ticketTier: string;
  ticketStatus: TicketStatus;
  
  // Check-in
  checkedIn: boolean;
  checkInTime?: Date;
  
  // Village
  villageId?: string;
}

/**
 * Ticket validation result
 */
export interface TicketValidationResult {
  valid: boolean;
  ticket?: EventTicket;
  error?: string;
  warnings?: string[];
}

/**
 * Ticket stats
 */
export interface TicketStats {
  totalSold: number;
  totalRevenue: number;
  checkedIn: number;
  checkInRate: number;
  transferred: number;
  resold: number;
  cancelled: number;
  avgTicketPrice: number;
}
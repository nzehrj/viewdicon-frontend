// src/types/feeds/familyRoot.types.ts
// Family Root Feed Type Definitions

export type HouseType = 
  | 'blood'
  | 'hometown'
  | 'tribe'
  | 'diaspora'
  | 'age-grade';

export type FamilyPostType = 
  | 'announcement'
  | 'contribution'
  | 'heritage'
  | 'call-for-hands'
  | 'quiet-cry'
  | 'ceremony'
  | 'blessing';

export type PrivacyMode = 
  | 'true-face'
  | 'masked-cousin'
  | 'ghost-seat';

export type CowrieFlowType = 
  | 'clan-purse'
  | 'pledge-stone'
  | 'diaspora-wire'
  | 'bride-support';

/**
 * Family house
 */
export interface FamilyHouse {
  id: string;
  type: HouseType;
  
  // Identity
  name: string;
  description: string;
  crest?: string; // Image URL
  
  // Membership
  ownerId: string;
  elders: string[];
  members: string[];
  pendingMembers: string[];
  
  // Privacy
  isPrivate: boolean;
  inviteOnly: boolean;
  requiresApproval: boolean;
  
  // Location (for hometown/tribe houses)
  location?: HouseLocation;
  
  // Stats
  memberCount: number;
  totalContributions: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * House location
 */
export interface HouseLocation {
  country: string;
  region?: string;
  city?: string;
  village?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Family post
 */
export interface FamilyPost {
  id: string;
  houseId: string;
  authorId: string;
  authorName: string;
  
  // Content
  postType: FamilyPostType;
  title: string;
  content: string;
  mediaUrls: string[];
  voiceUrl?: string;
  
  // Privacy
  privacyMode: PrivacyMode;
  visibleToElders: boolean;
  visibleToAllMembers: boolean;
  specificViewers?: string[];
  
  // Engagement
  potId: string;
  heat: number;
  blessings: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date; // For sensitive posts
}

/**
 * Clan announcement
 */
export interface ClanAnnouncement extends FamilyPost {
  postType: 'announcement';
  
  // Event details
  eventType: 'naming' | 'wedding' | 'burial' | 'initiation' | 'reunion' | 'meeting';
  eventDate?: Date;
  eventLocation?: string;
  
  // RSVP
  rsvpRequired: boolean;
  attendees: string[];
  maxAttendees?: number;
  
  // Documents
  attachments: string[];
}

/**
 * Contribution board (Ajo/Esusu/Stokvel)
 */
export interface ContributionBoard extends FamilyPost {
  postType: 'contribution';
  
  // Contribution details
  contributionType: 'ajo' | 'esusu' | 'stokvel' | 'emergency-fund' | 'project';
  targetAmount: number;
  currentAmount: number;
  
  // Schedule
  frequency: 'weekly' | 'monthly' | 'one-time';
  nextDueDate?: Date;
  
  // Participants
  contributors: Contributor[];
  
  // Disbursement
  beneficiaryOrder: string[];
  currentBeneficiary?: string;
  
  // Status
  status: 'active' | 'paused' | 'completed';
}

/**
 * Contributor
 */
export interface Contributor {
  userId: string;
  userName: string;
  amountPledged: number;
  amountPaid: number;
  lastPaymentDate?: Date;
  paymentHistory: Payment[];
}

/**
 * Payment
 */
export interface Payment {
  id: string;
  amount: number;
  date: Date;
  method: 'cowrie' | 'external';
  transactionId?: string;
}

/**
 * Heritage drop
 */
export interface HeritageDrop extends FamilyPost {
  postType: 'heritage';
  
  // Heritage content
  heritageType: 'story' | 'photo' | 'praise-song' | 'proverb' | 'recipe' | 'tradition';
  era?: string; // Time period
  
  // Preservation
  archiveId?: string;
  nftMinted: boolean;
  nftId?: string;
  
  // Attribution
  storyteller?: string;
  source?: string;
  originalDate?: Date;
  
  // Language
  originalLanguage: string;
  translations?: Record<string, string>;
}

/**
 * Call for hands (help request)
 */
export interface CallForHands extends FamilyPost {
  postType: 'call-for-hands';
  
  // Request details
  helpType: 'physical' | 'financial' | 'advice' | 'resources' | 'skills';
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  
  // Requirements
  what: string;
  when: Date;
  where: string;
  howMany?: number;
  
  // Responses
  volunteers: Volunteer[];
  fulfilled: boolean;
  
  // Deadline
  deadline?: Date;
}

/**
 * Volunteer
 */
export interface Volunteer {
  userId: string;
  userName: string;
  offering: string;
  availability: string;
  respondedAt: Date;
}

/**
 * Quiet cry (private need)
 */
export interface QuietCry extends FamilyPost {
  postType: 'quiet-cry';
  
  // Privacy (only elders can see)
  privacyMode: 'masked-cousin' | 'ghost-seat';
  eldersOnly: true;
  
  // Need
  needType: 'financial' | 'medical' | 'legal' | 'personal' | 'family-crisis';
  amountNeeded?: number;
  
  // Support
  supporters: Supporter[];
  totalSupport: number;
  
  // Status
  resolved: boolean;
  resolvedAt?: Date;
}

/**
 * Supporter
 */
export interface Supporter {
  userId: string;
  amount?: number;
  supportType: 'financial' | 'prayer' | 'advice' | 'connection';
  message?: string;
  providedAt: Date;
}

/**
 * Ceremony record
 */
export interface CeremonyRecord extends FamilyPost {
  postType: 'ceremony';
  
  // Ceremony details
  ceremonyType: 'wedding' | 'naming' | 'initiation' | 'graduation' | 'burial' | 'anniversary';
  date: Date;
  location: string;
  
  // Participants
  honorees: Honoree[];
  officiant?: string;
  
  // Media
  photos: string[];
  videos: string[];
  
  // Preservation
  archiveId: string;
  permanentRecord: boolean;
}

/**
 * Honoree
 */
export interface Honoree {
  name: string;
  role: string;
  userId?: string;
}

/**
 * Blessing chain
 */
export interface BlessingChain extends FamilyPost {
  postType: 'blessing';
  
  // Blessing content
  blessing: string;
  voiceUrl?: string;
  language: string;
  
  // Chain
  originElderIdId: string;
  elderName: string;
  elderRank: number;
  
  // Recipients
  targetedAt?: string[]; // Specific members
  forAllMembers: boolean;
  
  // Responses
  acknowledgedBy: string[];
}

/**
 * Clan purse (shared wallet)
 */
export interface ClanPurse {
  id: string;
  houseId: string;
  
  // Balance
  balance: number;
  
  // Purpose
  purpose: string;
  obligations: ClanObligation[];
  
  // Contributions
  contributors: string[];
  totalContributed: number;
  
  // Management
  treasurers: string[];
  requiresApproval: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Clan obligation
 */
export interface ClanObligation {
  id: string;
  type: 'burial' | 'wedding' | 'education' | 'emergency' | 'tradition';
  description: string;
  amount: number;
  deadline?: Date;
  fulfilled: boolean;
}

/**
 * Pledge stone (commitment tracker)
 */
export interface PledgeStone {
  id: string;
  houseId: string;
  pledgerId: string;
  
  // Pledge
  pledge: string;
  amount?: number;
  action?: string;
  
  // Tracking
  deadline?: Date;
  progress: number; // 0-100%
  milestones: Milestone[];
  
  // Public
  isPublic: boolean;
  witnesses: string[];
  
  // Status
  status: 'pending' | 'in-progress' | 'completed' | 'broken';
  
  // Timestamps
  pledgedAt: Date;
  completedAt?: Date;
}

/**
 * Milestone
 */
export interface Milestone {
  description: string;
  completed: boolean;
  completedAt?: Date;
}

/**
 * Diaspora wire (international transfer)
 */
export interface DiasporaWire {
  id: string;
  senderId: string;
  recipientId: string;
  houseId: string;
  
  // Transfer
  amount: number;
  currency: 'cowrie' | 'USD' | 'EUR' | 'GBP';
  
  // Purpose
  purpose: string;
  category: 'family-support' | 'emergency' | 'celebration' | 'investment';
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed';
  
  // Timestamps
  initiatedAt: Date;
  completedAt?: Date;
}

/**
 * Family tree map
 */
export interface FamilyTreeMap {
  houseId: string;
  rootMemberId: string;
  
  // Nodes
  members: FamilyTreeNode[];
  
  // Metadata
  generations: number;
  totalMembers: number;
  
  // Timestamps
  lastUpdated: Date;
}

/**
 * Family tree node
 */
export interface FamilyTreeNode {
  userId: string;
  name: string;
  generation: number;
  parentIds: string[];
  childrenIds: string[];
  spouseId?: string;
  
  // Metadata
  birthYear?: number;
  location?: string;
  praiseNames?: string[];
}

/**
 * Family root filters
 */
export interface FamilyRootFilters {
  houseType?: HouseType;
  postType?: FamilyPostType;
  privacyMode?: PrivacyMode;
  elderPostsOnly?: boolean;
  timeRange?: 'today' | 'week' | 'month' | 'all';
}

/**
 * Family root stats
 */
export interface FamilyRootStats {
  totalHouses: number;
  totalMembers: number;
  activePosts: number;
  totalContributions: number;
  activeObligations: number;
  completedCeremonies: number;
}
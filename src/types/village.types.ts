// ===================================
// VILLAGE SYSTEM TYPES
// ===================================

export type VillageId = 
  | 'getting_started'    // Village 0: Getting Started (for users without roles)
  | 'agriculture'        // Village 1: SHAMBA (Agriculture)
  | 'business'           // Village 2: UMI (Commerce/Business)
  | 'construction'       // Village 3: WAKANDA (Construction)
  | 'crafts'             // Village 4: SANAA (Crafts & Artisans)
  | 'creative'           // Village 5: GRIOT (Creative Arts)
  | 'education'          // Village 6: SANKOFA (Education)
  | 'finance'            // Village 7: UMI (Finance)
  | 'governance'         // Village 8: BARAZA (Governance)
  | 'government'         // Village 9: UHURU (Government)
  | 'healthcare'         // Village 10: UHAI (Healthcare)
  | 'hospitality'        // Village 11: KARIBU (Hospitality)
  | 'media'              // Village 12: HABARI (Media)
  | 'security'           // Village 13: NGUVU (Security)
  | 'spiritual'          // Village 14: IMANI (Spiritual)
  | 'technology'         // Village 15: NURU (Technology)
  | 'transport';         // Village 16: SAFARI (Transport)

export type GuildId = string; // e.g., 'healer_doctor', 'builder_plumber'

export type AIGuardian = 
  | 'Thunder'           // Security / Violence / Fraud
  | 'Iron'              // Commerce Proof / Delivery
  | 'Oracle'            // Identity Truth / Cultural Authenticity
  | 'Creator'           // Creative Ownership / Deepfake Block
  | 'Mother';           // Emotional Safety / Crisis Support

export type DisputeEscalation = 
  | 'manual_review' 
  | 'ai_guardian' 
  | 'hybrid';

export type RiskClass = 'low' | 'medium' | 'high' | 'critical';

export type ShieldColor = 'GREEN' | 'AMBER' | 'RED';

export type RealmLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// ===================================
// REALM NAMES (African English)
// ===================================

export const REALM_NAMES = {
  1: 'Birth',           // Levels 1-10
  2: 'Initiation',      // Levels 11-25
  3: 'Warrior',         // Levels 26-45
  4: 'Builder',         // Levels 46-70
  5: 'Elder',           // Levels 71-95
  6: 'Royalty',         // Levels 96-99
  7: 'Ancestral',       // Level 100
} as const;

// ===================================
// VILLAGE STRUCTURE
// ===================================

export interface VillageVisual {
  colorPrimary: string;          // Main color
  colorSecondary?: string;       // Accent color
  iconSet: string[];             // Icon names
  backgroundTexture: string;     // Texture name
  symbols: string[];             // Cultural symbols
}

export interface CouncilStructure {
  hasElders: boolean;
  canSuspendMembers: boolean;
  canBoostMembers: boolean;
  disputeEscalation: DisputeEscalation;
  votingThreshold?: number;
}

export interface RevenueChannel {
  type: 'paid_service' | 'tipping' | 'subscription' | 'commission' | 'sponsored_listing' | 'licensing';
  description: string;
  enabled: boolean;
}

export interface VerificationRequirement {
  type: 'license' | 'council_oath' | 'elder_vouch' | 'experience_proof' | 'video_demo' | 'before_after' | 'client_voice';
  description: string;
  required: boolean;
}

export interface ToolModule {
  toolId: string;
  toolName: string;
  description: string;
  icon?: string;
  category?: string;
  requiresVerification?: boolean;
  cowrieCost?: number;
}

export interface CrestTier {
  tier: number;                  // 0 = probation, 1-5 = progression
  name: string;                  // e.g., "Fresh Hand", "Bronze Hand"
  icon: string;
  requirements: {
    jobsCompleted?: number;
    xpRequired?: number;
    councilApproval?: boolean;
    zeroComplaints?: boolean;
  };
  visual: {
    color: string;
    glow?: boolean;
  };
}

export interface HonorStage {
  realm: RealmLevel;
  levelRange: [number, number];
  titles: string[];
  visual: {
    regalia: string[];
    aura?: string;
  };
  access: {
    canModerate?: boolean;
    canTeach?: boolean;
    canJudge?: boolean;
    canBless?: boolean;
  };
}

export interface CAWSRule {
  ruleId: string;
  ruleText: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'warn' | 'mute' | 'delay_payout' | 'amber_shield' | 'red_shield' | 'council_review';
}

export interface Guild {
  guildId: GuildId;
  guildName: string;
  description: string;
  icon: string;
  verificationRequired: VerificationRequirement[];
  extraTools: string[];
  crestPath: CrestTier[];
  honorPath?: HonorStage[];
  riskClass: RiskClass;
  specialRules?: string[];
}

export interface Village {
  villageId: VillageId;
  displayName: string;
  englishName: string;
  isPublic: boolean;
  selectableAtOnboarding: boolean;
  selectableAsHome: boolean;
  visual: VillageVisual;
  promiseTagline: string;
  description: string;
  defaultTools: string[];
  guilds: Guild[];
  councilStructure: CouncilStructure;
  revenueChannels: RevenueChannel[];
  specialAIWatch: AIGuardian[];
  cawsRules: CAWSRule[];
  dashboardLayout?: {
    welcomeMessage: string;
    statusTiles: string[];
    quickActions: string[];
  };
}

// ===================================
// USER VILLAGE STATE
// ===================================

export interface UserVillageState {
  userId: string;
  activeVillageId: VillageId;
  activeGuildId: GuildId;
  
  // Trust & Progression
  crestTier: number;
  honorRealm: RealmLevel;
  honorLevel: number;
  xp: number;
  
  // Shield & Safety
  shieldColor: ShieldColor;
  shieldReasons: string[];
  
  // History
  joinedVillageAt: Date;
  lastSwitchAt?: Date;
  switchLockedUntil?: Date;
  
  // Work Record
  jobsCompleted: number;
  totalCowriesEarned: number;
  complaintCount: number;
  blessingCount: number;
  
  // Verification
  verified: boolean;
  verificationProof?: string[];
}

// ===================================
// PLACEMENT STATE (for Village 0)
// ===================================

export type PlacementStatus = 
  | 'holding'
  | 'provisional'
  | 'placed';

export interface PlacementState {
  userId: string;
  status: PlacementStatus;
  
  // Proof Collection
  workDescription?: string;
  videoProofUrl?: string;
  voiceProofUrl?: string;
  whoTheyServe?: string;
  whatPeoplePay?: string;
  risksAccused?: string;
  
  // Matcher Results
  proposedVillageId?: VillageId;
  proposedGuildId?: GuildId;
  matchConfidence?: number;
  isNewGuild?: boolean;
  
  // Council Review
  councilTicketId?: string;
  councilDecision?: 'approved' | 'rejected' | 'needs_more_proof';
  councilNotes?: string;
  
  // Timestamps
  enteredAt: Date;
  lastUpdatedAt: Date;
  placedAt?: Date;
}

// ===================================
// ROLE SWITCH REQUEST
// ===================================

export interface RoleSwitchRequest {
  requestId: string;
  userId: string;
  
  fromVillageId: VillageId;
  fromGuildId: GuildId;
  
  toVillageId: VillageId;
  toGuildId: GuildId;
  
  // Proof
  proofMedia: string[];
  proofDescription: string;
  
  // AI Verdicts
  aiVerdicts: {
    oracle?: 'approve' | 'reject' | 'review';
    iron?: 'approve' | 'reject' | 'review';
    mother?: 'approve' | 'reject' | 'review';
    thunder?: 'approve' | 'reject' | 'review';
  };
  
  // Council Decision
  councilVerdict?: 'approved' | 'rejected' | 'needs_more_proof';
  councilNotes?: string;
  
  finalStatus: 'pending' | 'approved' | 'rejected';
  
  submittedAt: Date;
  processedAt?: Date;
}

// ===================================
// WORK LEDGER (Memory of Hands)
// ===================================

export interface WorkLedgerEntry {
  entryId: string;
  userId: string;
  type: 'healing' | 'repair' | 'delivery' | 'escort' | 'teaching' | 'sale' | 'other';
  summary: string;
  timestamp: Date;
  sessionId?: string;
  
  // Effects
  crestEffect?: number;
  honorEffect?: number;
  cowriesEarned?: number;
  
  // Social Proof
  clanTreeRefs?: string[];
  councilRefs?: string[];
  blessingCount?: number;
  
  // Flags
  cawsFlags?: string[];
  complaintFlags?: string[];
}

export interface WorkLedger {
  userId: string;
  entries: WorkLedgerEntry[];
  totalJobsCompleted: number;
  totalCowriesEarned: number;
  lifetimeXP: number;
  clanTreeHonors: number;
}
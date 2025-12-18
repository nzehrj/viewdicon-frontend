// utils/feeds/liftLogic.ts
// Discovery Lift Logic - Routes content from Family → Village → Local → Regional → National/Pan-African
// Implements safety gates, truth verification, and council approvals

import { getLiftScope, shouldLiftToDiscovery } from '../social/heatCalculator';

export type LiftScope = 'family' | 'village' | 'local' | 'regional' | 'national' | 'pan_african';
export type SafetyStatus = 'pass' | 'review' | 'block';
export type TruthStatus = 'verified' | 'disputed' | 'unverified';

export interface LiftEvaluation {
  canLift: boolean;
  currentScope: LiftScope;
  targetScope: LiftScope | null;
  blockers: string[];
  requirements: string[];
}

/**
 * Evaluate if content can be lifted to discovery
 */
export const evaluateLiftEligibility = (
  heat: number,
  currentScope: LiftScope,
  safetyStatus: SafetyStatus,
  truthStatus: TruthStatus,
  councilApproved: boolean = false,
  witnessCount: number = 0
): LiftEvaluation => {
  const blockers: string[] = [];
  const requirements: string[] = [];
  
  // Check minimum heat threshold
  if (!shouldLiftToDiscovery(heat)) {
    blockers.push('Insufficient heat (need ≥120)');
  }
  
  // Safety gate
  if (safetyStatus === 'block') {
    blockers.push('Content blocked by safety AI (Yemoja/Sàngó)');
  } else if (safetyStatus === 'review') {
    requirements.push('Pending safety review');
  }
  
  // Truth verification gate (for witness posts)
  if (witnessCount > 0 && truthStatus === 'disputed') {
    blockers.push('Content disputed by Òrúnmìlà truth verification');
  }
  
  // Determine target scope based on heat
  const heatBasedScope = getLiftScope(heat);
  
  // Council approval required for national/pan-african lift
  if (heatBasedScope === 'national' || heatBasedScope === 'pan_african') {
    if (!councilApproved) {
      requirements.push('Requires council approval for national lift');
    }
  }
  
  const canLift = blockers.length === 0;
  
  return {
    canLift,
    currentScope,
    targetScope: canLift && heatBasedScope ? heatBasedScope : null,
    blockers,
    requirements,
  };
};

/**
 * Get lift path (progression through scopes)
 */
export const getLiftPath = (fromScope: LiftScope): LiftScope[] => {
  const scopeHierarchy: LiftScope[] = [
    'family',
    'village',
    'local',
    'regional',
    'national',
    'pan_african',
  ];
  
  const startIndex = scopeHierarchy.indexOf(fromScope);
  return scopeHierarchy.slice(startIndex + 1);
};

/**
 * Check if lift requires council approval
 */
export const requiresCouncilApproval = (
  targetScope: LiftScope,
  contentType: 'family' | 'village' | 'public'
): boolean => {
  // Family content lifted to public requires council
  if (contentType === 'family' && targetScope !== 'family') {
    return true;
  }
  
  // National/Pan-African always requires council
  if (targetScope === 'national' || targetScope === 'pan_african') {
    return true;
  }
  
  return false;
};

/**
 * Calculate lift radius (in kilometers)
 */
export const getLiftRadius = (scope: LiftScope): number => {
  const radiusMap: Record<LiftScope, number> = {
    family: 0, // No geographic limit
    village: 0, // No geographic limit
    local: 10, // 0-10km
    regional: 500, // Province/state
    national: Infinity, // Country-wide
    pan_african: Infinity, // Continental
  };
  
  return radiusMap[scope];
};

/**
 * Apply safety gates (Yemoja/Sàngó/Òrúnmìlà AI)
 */
export const applySafetyGates = (
  content: string,
  mediaUrls: string[],
  authorShieldStatus: 'green' | 'amber' | 'red'
): {
  status: SafetyStatus;
  flags: string[];
  aiGuardian: 'Yemoja' | 'Sàngó' | 'Òrúnmìlà' | null;
} => {
  const flags: string[] = [];
  let status: SafetyStatus = 'pass';
  let aiGuardian: 'Yemoja' | 'Sàngó' | 'Òrúnmìlà' | null = null;
  
  // Shield status check
  if (authorShieldStatus === 'red') {
    flags.push('Author has red shield status');
    status = 'block';
    aiGuardian = 'Sàngó';
    return { status, flags, aiGuardian };
  }
  
  if (authorShieldStatus === 'amber') {
    flags.push('Author has amber shield status');
    status = 'review';
    aiGuardian = 'Yemoja';
  }
  
  // Content checks (simplified - would integrate with actual AI)
  const lowerContent = content.toLowerCase();
  
  // Yemoja: Emotional safety, dignity protection
  const dignityViolations = [
    'body-shaming',
    'harassment',
    'doxxing',
    'personal attack',
  ];
  if (dignityViolations.some(v => lowerContent.includes(v))) {
    flags.push('Potential dignity violation detected');
    status = 'review';
    aiGuardian = 'Yemoja';
  }
  
  // Sàngó: Threat detection, violence
  const threatKeywords = [
    'violence',
    'weapon',
    'threat',
    'harm',
  ];
  if (threatKeywords.some(k => lowerContent.includes(k))) {
    flags.push('Potential threat detected');
    status = 'block';
    aiGuardian = 'Sàngó';
  }
  
  // Media safety check
  if (mediaUrls.length > 0) {
    // Would integrate with image/video AI moderation
    // For now, placeholder
  }
  
  return { status, flags, aiGuardian };
};

/**
 * Verify truth/witness claims (Òrúnmìlà AI)
 */
export const verifyTruthClaims = (
  content: string,
  witnessCount: number,
  hasGeoProof: boolean,
  hasTimestamp: boolean
): {
  status: TruthStatus;
  confidence: number;
  counterEvidenceCount: number;
} => {
  let confidence = 50; // Base confidence
  let counterEvidenceCount = 0;
  
  // Content quality check (basic validation)
  const contentLength = content.trim().length;
  if (contentLength < 10) {
    confidence -= 20; // Too short, likely not detailed enough
  } else if (contentLength > 100) {
    confidence += 10; // Detailed content gets bonus
  }
  
  // Witness corroboration boost
  if (witnessCount >= 3) {
    confidence += 30;
  } else if (witnessCount >= 1) {
    confidence += 15;
  }
  
  // Geo-proof boost
  if (hasGeoProof) {
    confidence += 15;
  }
  
  // Timestamp verification
  if (hasTimestamp) {
    confidence += 10;
  }
  
  // Determine status
  let status: TruthStatus = 'unverified';
  if (confidence >= 80) {
    status = 'verified';
  } else if (counterEvidenceCount >= 2) {
    status = 'disputed';
  }
  
  return {
    status,
    confidence: Math.min(confidence, 100),
    counterEvidenceCount,
  };
};

/**
 * Calculate lift priority score
 */
export const calculateLiftPriority = (
  heat: number,
  witnessCount: number,
  councilSealCount: number,
  ageInHours: number
): number => {
  // Base score from heat
  let score = heat;
  
  // Witness boost
  score += witnessCount * 50;
  
  // Council seal boost
  score += councilSealCount * 100;
  
  // Recency boost (favor newer content)
  const recencyMultiplier = Math.max(0.5, 1 - (ageInHours / 48)); // Decay over 48 hours
  score *= recencyMultiplier;
  
  return Math.round(score);
};

/**
 * Determine trending status
 */
export const determineTrendingStatus = (
  currentHeat: number,
  previousHeat: number,
  timeWindowHours: number = 6
): {
  isTrending: boolean;
  growthRate: number;
  trend: 'rising' | 'stable' | 'falling';
} => {
  const heatChange = currentHeat - previousHeat;
  const growthRate = previousHeat > 0 ? (heatChange / previousHeat) * 100 : 0;
  
  // Adjust thresholds based on time window
  // Shorter windows = higher growth expected for "trending"
  const trendingThreshold = timeWindowHours <= 3 ? 100 : 50;
  const risingThreshold = timeWindowHours <= 3 ? 75 : 50;
  const fallingThreshold = -20;
  
  let trend: 'rising' | 'stable' | 'falling' = 'stable';
  if (growthRate > risingThreshold) trend = 'rising';
  else if (growthRate < fallingThreshold) trend = 'falling';
  
  const isTrending = growthRate > trendingThreshold && currentHeat >= 300;
  
  return {
    isTrending,
    growthRate,
    trend,
  };
};

/**
 * Get lift display label
 */
export const getLiftLabel = (scope: LiftScope): string => {
  const labels: Record<LiftScope, string> = {
    family: 'Family Only',
    village: 'Village',
    local: 'Local Drum (0-10km)',
    regional: 'Regional Stream',
    national: 'National Beat',
    pan_african: 'Pan-African Current',
  };
  
  return labels[scope];
};

/**
 * Get lift icon
 */
export const getLiftIcon = (scope: LiftScope): string => {
  const icons: Record<LiftScope, string> = {
    family: '🏠',
    village: '🏘️',
    local: '📍',
    regional: '🗺️',
    national: '🌍',
    pan_african: '🌐',
  };
  
  return icons[scope];
};

/**
 * Check if content should be stamped on-chain
 */
export const shouldStampOnChain = (
  targetScope: LiftScope,
  contentType: 'witness' | 'council' | 'sealed' | 'regular'
): boolean => {
  // All witness reports get stamped
  if (contentType === 'witness') return true;
  
  // All council decisions get stamped
  if (contentType === 'council') return true;
  
  // All sealed sessions get stamped
  if (contentType === 'sealed') return true;
  
  // Regular content only stamped at national/pan-african
  if (contentType === 'regular') {
    return targetScope === 'national' || targetScope === 'pan_african';
  }
  
  return false;
};

/**
 * Format lift notification message
 */
export const formatLiftNotification = (
  fromScope: LiftScope,
  toScope: LiftScope,
  heat: number
): string => {
  return `🚀 Your post lifted from ${getLiftLabel(fromScope)} to ${getLiftLabel(toScope)}! (${heat} heat)`;
};

export default {
  evaluateLiftEligibility,
  getLiftPath,
  requiresCouncilApproval,
  getLiftRadius,
  applySafetyGates,
  verifyTruthClaims,
  calculateLiftPriority,
  determineTrendingStatus,
  getLiftLabel,
  getLiftIcon,
  shouldStampOnChain,
  formatLiftNotification,
};
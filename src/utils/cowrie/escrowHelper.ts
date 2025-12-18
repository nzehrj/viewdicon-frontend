// utils/cowrie/escrowHelper.ts
// Escrow Helper for Marketplace Transactions
// POT → PICKUP/DELIVERY → RELEASE flow

export type EscrowStatus = 
  | 'pending'
  | 'locked'
  | 'in_delivery'
  | 'ready_for_release'
  | 'released'
  | 'disputed'
  | 'refunded'
  | 'cancelled';

export interface EscrowTransaction {
  id: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: EscrowStatus;
  createdAt: Date;
  lockedAt?: Date;
  releasedAt?: Date;
  deliveryMethod?: 'pickup' | 'courier' | 'bulk' | 'digital';
  voicePickupCode?: string;
  riderId?: string;
}

/**
 * Create escrow (Add to Pot)
 */
export const createEscrow = (
  buyerId: string,
  sellerId: string,
  amount: number,
  deliveryMethod: 'pickup' | 'courier' | 'bulk' | 'digital'
): EscrowTransaction => {
  return {
    id: `escrow_${Date.now()}`,
    buyerId,
    sellerId,
    amount,
    status: 'pending',
    createdAt: new Date(),
    deliveryMethod,
  };
};

/**
 * Lock escrow funds
 */
export const lockEscrow = (
  escrow: EscrowTransaction
): EscrowTransaction => {
  if (escrow.status !== 'pending') {
    throw new Error(`Cannot lock escrow in status: ${escrow.status}`);
  }
  
  return {
    ...escrow,
    status: 'locked',
    lockedAt: new Date(),
  };
};

/**
 * Generate Voice Pickup Code (Ọ̀RỌ̀-KEY)
 */
export const generateVoicePickupCode = (): string => {
  const words = [
    'OBA', 'RED', 'SEVEN', 'BLUE', 'LION', 'TREE', 'MOON', 'FIRE',
    'GOLD', 'DRUM', 'STAR', 'RAIN', 'WIND', 'KING', 'ROOT', 'STONE'
  ];
  
  const word1 = words[Math.floor(Math.random() * words.length)];
  const word2 = words[Math.floor(Math.random() * words.length)];
  const number = Math.floor(Math.random() * 10);
  
  return `${word1}-${word2}-${number}`;
};

/**
 * Start delivery
 */
export const startDelivery = (
  escrow: EscrowTransaction,
  riderId?: string
): EscrowTransaction => {
  if (escrow.status !== 'locked') {
    throw new Error(`Cannot start delivery for escrow in status: ${escrow.status}`);
  }
  
  const updates: Partial<EscrowTransaction> = {
    status: 'in_delivery',
  };
  
  if (escrow.deliveryMethod === 'pickup') {
    updates.voicePickupCode = generateVoicePickupCode();
  }
  
  if (escrow.deliveryMethod === 'courier' && riderId) {
    updates.riderId = riderId;
  }
  
  return {
    ...escrow,
    ...updates,
  };
};

/**
 * Confirm delivery/pickup
 */
export const confirmDelivery = (
  escrow: EscrowTransaction
): EscrowTransaction => {
  if (escrow.status !== 'in_delivery' && escrow.status !== 'locked') {
    throw new Error(`Cannot confirm delivery for escrow in status: ${escrow.status}`);
  }
  
  return {
    ...escrow,
    status: 'ready_for_release',
  };
};

/**
 * Release escrow to seller
 */
export const releaseEscrow = (
  escrow: EscrowTransaction
): EscrowTransaction => {
  if (escrow.status !== 'ready_for_release') {
    throw new Error(`Cannot release escrow in status: ${escrow.status}`);
  }
  
  return {
    ...escrow,
    status: 'released',
    releasedAt: new Date(),
  };
};

/**
 * Calculate escrow splits (Seller/Platform/Council)
 */
export const calculateEscrowSplits = (
  amount: number,
  platformFee: number = 0.05, // 5%
  councilFee: number = 0.02 // 2%
): {
  sellerAmount: number;
  platformAmount: number;
  councilAmount: number;
} => {
  const platformAmount = Math.round(amount * platformFee);
  const councilAmount = Math.round(amount * councilFee);
  const sellerAmount = amount - platformAmount - councilAmount;
  
  return {
    sellerAmount,
    platformAmount,
    councilAmount,
  };
};

/**
 * Dispute escrow
 */
export const disputeEscrow = (
  escrow: EscrowTransaction,
  reason: string
): EscrowTransaction & { disputeReason: string } => {
  return {
    ...escrow,
    status: 'disputed',
    disputeReason: reason,
  };
};

/**
 * Refund escrow to buyer
 */
export const refundEscrow = (
  escrow: EscrowTransaction
): EscrowTransaction => {
  return {
    ...escrow,
    status: 'refunded',
  };
};

/**
 * Check escrow timeout (auto-release after X days)
 */
export const checkEscrowTimeout = (
  escrow: EscrowTransaction,
  timeoutDays: number = 7
): boolean => {
  if (escrow.status !== 'ready_for_release') return false;
  
  const now = new Date();
  const lockedTime = escrow.lockedAt || escrow.createdAt;
  const hoursSinceLocked = (now.getTime() - lockedTime.getTime()) / (1000 * 60 * 60);
  
  return hoursSinceLocked >= (timeoutDays * 24);
};

/**
 * Get escrow status label
 */
export const getEscrowStatusLabel = (status: EscrowStatus): string => {
  const labels: Record<EscrowStatus, string> = {
    pending: 'Pending Payment',
    locked: 'Funds Locked',
    in_delivery: 'In Delivery',
    ready_for_release: 'Ready for Release',
    released: 'Completed',
    disputed: 'Under Dispute',
    refunded: 'Refunded',
    cancelled: 'Cancelled',
  };
  
  return labels[status];
};

/**
 * Get escrow status color
 */
export const getEscrowStatusColor = (status: EscrowStatus): string => {
  const colors: Record<EscrowStatus, string> = {
    pending: '#eab308', // Yellow
    locked: '#3b82f6', // Blue
    in_delivery: '#8b5cf6', // Purple
    ready_for_release: '#10b981', // Green
    released: '#059669', // Dark green
    disputed: '#dc2626', // Red
    refunded: '#f97316', // Orange
    cancelled: '#6b7280', // Gray
  };
  
  return colors[status];
};

export default {
  createEscrow,
  lockEscrow,
  generateVoicePickupCode,
  startDelivery,
  confirmDelivery,
  releaseEscrow,
  calculateEscrowSplits,
  disputeEscrow,
  refundEscrow,
  checkEscrowTimeout,
  getEscrowStatusLabel,
  getEscrowStatusColor,
};
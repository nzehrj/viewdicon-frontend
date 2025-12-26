// src/types/cowrie.types.ts
// Cowrie Currency & Transaction Types

export type TransactionType = 'earned' | 'spent' | 'rewarded' | 'bonus';

export type TransactionCategory = 
  | 'cowrie-drop' 
  | 'marketplace' 
  | 'tip' 
  | 'event' 
  | 'sorosoke' 
  | 'reward' 
  | 'transfer';

export interface CowrieTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  source: string;
  category?: TransactionCategory;
  timestamp: Date;
  relatedId?: string;
}

export interface CowrieStats {
  totalEarned: number;
  totalSpent: number;
  totalTipped: number;
  totalReceived: number;
}

export type TierBadge = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface EscrowStatus {
  escrowId: string;
  amount: number;
  status: 'pending' | 'locked' | 'in_delivery' | 'released' | 'disputed';
  buyerId: string;
  sellerId: string;
}

export interface PendingTransaction {
  id: string;
  amount: number;
  type: 'send' | 'receive';
  status: 'pending' | 'processing' | 'completed' | 'failed';
}
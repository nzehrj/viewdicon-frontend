// Wari Transaction Protocol (WTP) Types

export interface WariGenerateRequest {
  amount: number;
  currency: string;
  recipient_id?: string;
  transaction_type: 'p2p' | 'p2b' | 'b2p';
  kinship_discount?: boolean;
}

export interface WariGenerateResponse {
  token_id: string;
  token_string: string;
  qr_code_data: string;
  amount: number;
  currency: string;
  expires_at: string;
  kinship_discount_applied?: number;
}

export interface WariSettleRequest {
  token_string: string;
  payer_id?: string;
}

export interface WariSettleResponse {
  transaction_id: string;
  status: 'success' | 'pending' | 'failed';
  amount: number;
  currency: string;
  timestamp: string;
  kinship_discount?: number;
}

export interface WariTokenStatusResponse {
  token_id: string;
  status: 'active' | 'used' | 'expired' | 'cancelled';
  amount: number;
  created_at: string;
  expires_at: string;
  used_at?: string;
}
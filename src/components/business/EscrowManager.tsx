import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock,
  ArrowRight,
  Info,
  DollarSign,
  XCircle
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface EscrowManagerProps {
  escrowId: string;
  amount: number;
  currency?: string;
  payerId: string;
  beneficiaryId: string;
  payerName: string;
  beneficiaryName: string;
  status: EscrowStatus;
  disputeId?: string;
  createdAt?: string;
  onFund?: () => void;
  onRelease?: () => void;
  onRefund?: () => void;
  onRaiseDispute?: (reason: string, evidence?: string[]) => void;
}

type EscrowStatus = 
  | 'created'       // Escrow created, awaiting funding
  | 'funded'        // Client has deposited funds
  | 'locked'        // Funds locked for work in progress
  | 'disputed'      // Under moot resolution
  | 'released'      // Payment sent to professional
  | 'refunded'      // Payment returned to client
  | 'cancelled';    // Escrow cancelled

interface EscrowTransaction {
  id: string;
  timestamp: Date;
  action: 'deposit' | 'release' | 'refund' | 'dispute';
  amount: number;
  actor: string;
  note?: string;
}

/**
 * ESCROW MANAGER COMPONENT
 * 
 * Manages secure payment holds for business sessions.
 * All payments are protected until work is verified.
 * 
 * Features:
 * - Secure fund holding
 * - Automated release on approval
 * - Refund protection
 * - Transaction history
 * - Dispute lock
 * - Multi-signature verification
 * 
 * How Escrow Works:
 * 
 * 1. DEPOSIT
 *    - Client agrees to price
 *    - Funds moved to escrow wallet
 *    - Professional notified
 *    - Work can begin
 * 
 * 2. HOLD
 *    - Funds locked during work
 *    - Neither party can access
 *    - Protected by smart contract
 *    - Tracked on blockchain
 * 
 * 3. RELEASE
 *    - Client approves work
 *    - Funds sent to professional
 *    - Platform fee deducted (5%)
 *    - Transaction complete
 * 
 * 4. REFUND (if needed)
 *    - Work not completed
 *    - Dispute resolved for client
 *    - Funds returned to client
 *    - Platform fee waived
 * 
 * Location: src/components/business/EscrowManager.tsx
 */
export const EscrowManager: React.FC<EscrowManagerProps> = ({
  escrowId,
  amount,
  currency = 'NGN',
  payerId: _payerId,
  beneficiaryId: _beneficiaryId,
  payerName,
  beneficiaryName,
  status,
  disputeId,
  createdAt: _createdAt,
  onFund,
  onRelease,
  onRefund,
  onRaiseDispute,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [showDetails, setShowDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Mock transaction history
  const transactions: EscrowTransaction[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      action: 'deposit',
      amount: amount,
      actor: payerName,
      note: 'Initial deposit to escrow',
    },
  ];
  
  const platformFee = amount * 0.05; // 5% platform fee
  const professionalReceives = amount - platformFee;
  
  const getStatusInfo = () => {
    switch (status) {
      case 'created':
        return {
          icon: Clock,
          color: 'text-amber-500',
          bgColor: theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50',
          borderColor: 'border-amber-500/30',
          label: 'Awaiting Funding',
          description: 'Escrow created, waiting for client to deposit funds',
        };
      case 'funded':
        return {
          icon: Shield,
          color: 'text-blue-500',
          bgColor: theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50',
          borderColor: 'border-blue-500/30',
          label: 'Funds Deposited',
          description: 'Payment has been deposited and is ready to be locked',
        };
      case 'locked':
        return {
          icon: Lock,
          color: 'text-purple-500',
          bgColor: theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50',
          borderColor: 'border-purple-500/30',
          label: 'Funds Locked',
          description: 'Payment is safely secured in escrow during work',
        };
      case 'disputed':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          bgColor: theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50',
          borderColor: 'border-red-500/30',
          label: 'Under Moot Resolution',
          description: `Dispute raised. Moot ID: ${disputeId || 'Pending'}`,
        };
      case 'released':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: theme === 'dark' ? 'bg-green-500/10' : 'bg-green-50',
          borderColor: 'border-green-500/30',
          label: 'Payment Released',
          description: 'Funds have been sent to the beneficiary',
        };
      case 'refunded':
        return {
          icon: Unlock,
          color: 'text-gray-500',
          bgColor: theme === 'dark' ? 'bg-gray-500/10' : 'bg-gray-50',
          borderColor: 'border-gray-500/30',
          label: 'Refunded',
          description: 'Payment has been returned to the payer',
        };
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'text-gray-500',
          bgColor: theme === 'dark' ? 'bg-gray-500/10' : 'bg-gray-50',
          borderColor: 'border-gray-500/30',
          label: 'Cancelled',
          description: 'Escrow has been cancelled',
        };
      default:
        return {
          icon: Shield,
          color: 'text-gray-500',
          bgColor: theme === 'dark' ? 'bg-gray-500/10' : 'bg-gray-50',
          borderColor: 'border-gray-500/30',
          label: 'Unknown',
          description: '',
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  
  const handleAction = async (action: 'fund' | 'release' | 'refund' | 'dispute', disputeReason?: string) => {
    setIsProcessing(true);
    
    // TODO: API call and payment processing
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
    
    if (action === 'fund') {
      onFund?.();
    } else if (action === 'release') {
      onRelease?.();
    } else if (action === 'refund') {
      onRefund?.();
    } else if (action === 'dispute' && disputeReason) {
      onRaiseDispute?.(disputeReason, []);
    }
    
    setIsProcessing(false);
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className={`rounded-xl border overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.bgColor}`}>
            <Shield className={`w-5 h-5 ${statusInfo.color}`} />
          </div>
          
          <div className="flex-1">
            <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Escrow Protection
            </h3>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              ID: {escrowId.substring(0, 12)}...
            </p>
          </div>
        </div>
      </div>
      
      {/* Status */}
      <div className={`p-4 border-b ${statusInfo.bgColor} border ${statusInfo.borderColor}`}>
        <div className="flex items-center gap-3">
          <StatusIcon className={`w-6 h-6 ${statusInfo.color}`} />
          
          <div className="flex-1">
            <p className={`font-bold ${statusInfo.color}`}>
              {statusInfo.label}
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {statusInfo.description}
            </p>
          </div>
        </div>
      </div>
      
      {/* Amount */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Escrow Amount
          </span>
          <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            ₵{amount.toLocaleString()}
          </span>
        </div>
        
        {/* Breakdown */}
        {(status === 'locked' || status === 'released') ? (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`w-full p-3 rounded-lg border transition-colors ${
              theme === 'dark'
                ? 'bg-gray-750 border-gray-700 hover:border-gray-600'
                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Payment Breakdown
                </span>
              </div>
              <motion.div
                animate={{ rotate: showDetails ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              </motion.div>
            </div>
            
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-gray-700 space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Total Amount
                  </span>
                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    ₵{amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    Platform Fee (5%)
                  </span>
                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    - ₵{platformFee.toLocaleString()}
                  </span>
                </div>
                
                <div className="pt-2 border-t border-gray-700 flex justify-between text-sm font-bold">
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                    Professional Receives
                  </span>
                  <span className="text-green-500">
                    ₵{professionalReceives.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            )}
          </button>
        ) : null}
        
        {/* Parties */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Payer
            </span>
            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {payerName}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Beneficiary
            </span>
            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {beneficiaryName}
            </span>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      {status === 'created' && (
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => handleAction('fund')}
            disabled={isProcessing}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
              isProcessing
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="w-5 h-5" />
                Fund Escrow: {currency} {amount.toLocaleString()}
              </>
            )}
          </button>
        </div>
      )}
      
      {status === 'locked' && (
        <div className="p-4 border-t border-gray-700 space-y-2">
          <button
            onClick={() => handleAction('release')}
            disabled={isProcessing}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
              isProcessing
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Releasing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Release Payment
              </>
            )}
          </button>
          
          <button
            onClick={() => handleAction('dispute', 'Quality issues with work')}
            disabled={isProcessing}
            className={`w-full py-3 rounded-lg border font-semibold flex items-center justify-center gap-2 transition-colors ${
              isProcessing
                ? 'border-gray-500 text-gray-400 cursor-not-allowed'
                : theme === 'dark'
                ? 'border-red-600/30 hover:bg-red-600/10 text-red-400'
                : 'border-red-200 hover:bg-red-50 text-red-600'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            Raise Dispute (Moot)
          </button>
        </div>
      )}
      
      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <h4 className={`text-sm font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Transaction History
          </h4>
          
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  tx.action === 'deposit'
                    ? theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-50'
                    : tx.action === 'release'
                    ? theme === 'dark' ? 'bg-green-500/20' : 'bg-green-50'
                    : theme === 'dark' ? 'bg-red-500/20' : 'bg-red-50'
                }`}>
                  <DollarSign className={`w-4 h-4 ${
                    tx.action === 'deposit'
                      ? 'text-blue-500'
                      : tx.action === 'release'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {tx.action === 'deposit' ? 'Deposited' : tx.action === 'release' ? 'Released' : 'Refunded'}
                    </p>
                    <span className={`text-sm font-bold ${
                      tx.action === 'deposit'
                        ? 'text-blue-500'
                        : tx.action === 'release'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}>
                      ₵{tx.amount.toLocaleString()}
                    </span>
                  </div>
                  
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {tx.note}
                  </p>
                  
                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {formatDate(tx.timestamp)} • {tx.actor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Security Notice */}
      <div className={`p-4 ${theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50'}`}>
        <div className="flex items-start gap-2">
          <Shield className={`w-4 h-4 flex-shrink-0 mt-0.5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
          <div>
            <p className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
              Protected by Viewdicon Escrow
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Your payment is secured until work is complete and verified. Blockchain-backed protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowManager;
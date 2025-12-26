// src/components/social/CowrieFlow.tsx
// Cowrie Flow - Currency & Reward Display

import React from 'react';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import type { CowrieTransaction } from '@/types/social/cowrie.types';

interface CowrieFlowProps {
  balance: number;
  recentTransactions?: CowrieTransaction[];
  showTransactions?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CowrieFlow: React.FC<CowrieFlowProps> = ({
  balance,
  recentTransactions = [],
  showTransactions = false,
  animated = true,
  size = 'md',
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const sizeClasses = {
    sm: {
      icon: 'w-4 h-4',
      text: 'text-sm',
      amount: 'text-base',
    },
    md: {
      icon: 'w-5 h-5',
      text: 'text-base',
      amount: 'text-xl',
    },
    lg: {
      icon: 'w-6 h-6',
      text: 'text-lg',
      amount: 'text-2xl',
    },
  };

  const sizeConfig = sizeClasses[size];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'spent':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'rewarded':
        return <Award className="w-4 h-4 text-purple-500" />;
      case 'bonus':
        return <Coins className="w-4 h-4 text-amber-500" />;
      default:
        return <Coins className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Balance Display */}
      <motion.div
        animate={animated ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{
          duration: 0.5,
          repeat: 0,
        }}
        className={`
          flex items-center gap-3 p-4 rounded-xl
          bg-gradient-to-r from-amber-600 to-orange-600
        `}
      >
        <div className="relative">
          <Coins className={`${sizeConfig.icon} text-white`} />
          {animated && (
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="absolute inset-0"
            >
              <Coins className={`${sizeConfig.icon} text-white`} />
            </motion.div>
          )}
        </div>
        
        <div className="flex-1">
          <p className={`${sizeConfig.text} text-white/80 font-medium`}>
            Cowries Balance
          </p>
          <p className={`${sizeConfig.amount} text-white font-bold`}>
            ₵{balance.toLocaleString()}
          </p>
        </div>
      </motion.div>

      {/* Recent Transactions */}
      {showTransactions && recentTransactions.length > 0 && (
        <div className={`
          p-4 rounded-xl
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
        `}>
          <h4 className={`text-sm font-semibold mb-3 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Recent Activity
          </h4>
          <div className="space-y-2">
            {recentTransactions.slice(0, 5).map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  flex items-center justify-between p-3 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}
                `}
              >
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {transaction.source}
                    </p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {formatTimestamp(transaction.timestamp)}
                    </p>
                  </div>
                </div>
                
                <span className={`
                  font-bold text-sm
                  ${transaction.type === 'spent'
                    ? 'text-red-500'
                    : 'text-green-500'
                  }
                `}>
                  {transaction.type === 'spent' ? '-' : '+'}₵{transaction.amount.toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CowrieFlow;
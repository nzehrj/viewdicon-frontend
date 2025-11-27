import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock,
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  Star,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  User,
  Package,
  MessageCircle
} from 'lucide-react';

import { useAppSelector } from '@store/hooks';

// Types
type SessionStatus = 
  | 'completed'
  | 'cancelled'
  | 'disputed'
  | 'in_progress'
  | 'pending';

type FilterOption = SessionStatus | 'all';

interface Transaction {
  id: string;
  sessionId: string;
  otherParty: {
    id: string;
    name: string;
    afroId: string;
    village: string;
    crest: number;
  };
  service: {
    name: string;
    category: string;
  };
  amount: number;
  status: SessionStatus;
  userRole: 'payer' | 'beneficiary';
  createdAt: string;
  completedAt?: string;
  cancelledAt?: string;
  rating?: {
    given: number;
    received: number;
  };
  dispute?: {
    resolved: boolean;
    outcome?: string;
  };
  escrowId?: string;
  receiptId?: string;
}

interface SessionHistoryProps {
  userId: string;
  transactions: Transaction[];
  isLoading: boolean;
  onViewDetails: (sessionId: string) => void;
  onDownloadReceipt: (receiptId: string) => void;
  onViewDispute: (sessionId: string) => void;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({
  transactions,
  isLoading,
  onViewDetails,
  onDownloadReceipt,
  onViewDispute
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by status
    if (selectedFilter !== 'all' && transaction.status !== selectedFilter) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        transaction.otherParty.name.toLowerCase().includes(query) ||
        transaction.otherParty.afroId.toLowerCase().includes(query) ||
        transaction.service.name.toLowerCase().includes(query) ||
        transaction.sessionId.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'date') {
      const dateA = new Date(a.completedAt || a.createdAt).getTime();
      const dateB = new Date(b.completedAt || b.createdAt).getTime();
      comparison = dateB - dateA;
    } else {
      comparison = b.amount - a.amount;
    }

    return sortOrder === 'asc' ? -comparison : comparison;
  });

  // Calculate stats
  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'completed').length,
    inProgress: transactions.filter(t => t.status === 'in_progress').length,
    disputed: transactions.filter(t => t.status === 'disputed').length,
    totalEarned: transactions
      .filter(t => t.userRole === 'beneficiary' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    totalSpent: transactions
      .filter(t => t.userRole === 'payer' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    averageRating: transactions
      .filter(t => t.rating?.received)
      .reduce((sum, t) => sum + (t.rating?.received || 0), 0) / 
      transactions.filter(t => t.rating?.received).length || 0,
  };

  const getStatusInfo = (status: SessionStatus) => {
    const statusMap = {
      completed: { 
        color: 'green', 
        label: 'Completed', 
        icon: CheckCircle,
        bgColor: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50',
        textColor: theme === 'dark' ? 'text-green-400' : 'text-green-700',
        borderColor: theme === 'dark' ? 'border-green-700' : 'border-green-200'
      },
      cancelled: { 
        color: 'gray', 
        label: 'Cancelled', 
        icon: XCircle,
        bgColor: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50',
        textColor: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
        borderColor: theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
      },
      disputed: { 
        color: 'red', 
        label: 'Disputed', 
        icon: AlertCircle,
        bgColor: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50',
        textColor: theme === 'dark' ? 'text-red-400' : 'text-red-700',
        borderColor: theme === 'dark' ? 'border-red-700' : 'border-red-200'
      },
      in_progress: { 
        color: 'blue', 
        label: 'In Progress', 
        icon: Clock,
        bgColor: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50',
        textColor: theme === 'dark' ? 'text-blue-400' : 'text-blue-700',
        borderColor: theme === 'dark' ? 'border-blue-700' : 'border-blue-200'
      },
      pending: { 
        color: 'yellow', 
        label: 'Pending', 
        icon: Clock,
        bgColor: theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-50',
        textColor: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700',
        borderColor: theme === 'dark' ? 'border-yellow-700' : 'border-yellow-200'
      },
    };
    return statusMap[status];
  };

  const toggleSort = (newSortBy: 'date' | 'amount') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  return (
    <div className={`rounded-2xl shadow-lg overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Header */}
      <div className={`px-4 sm:px-6 py-4 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-indigo-900 to-indigo-800' 
          : 'bg-gradient-to-r from-indigo-600 to-indigo-700'
      } text-white`}>
        <h2 className="text-lg sm:text-xl font-bold mb-1">Session History</h2>
        <p className={`text-xs sm:text-sm ${
          theme === 'dark' ? 'text-indigo-200' : 'text-indigo-100'
        }`}>
          All your business transactions and sessions
        </p>
      </div>

      {/* Stats */}
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 border-b ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-700' 
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className={`rounded-lg p-3 sm:p-4 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
            <p className={`text-xs uppercase ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>Total Sessions</p>
          </div>
          <p className={`text-xl sm:text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{stats.total}</p>
        </div>

        <div className={`rounded-lg p-3 sm:p-4 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
            <p className={`text-xs uppercase ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>Completed</p>
          </div>
          <p className={`text-xl sm:text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{stats.completed}</p>
        </div>

        <div className={`rounded-lg p-3 sm:p-4 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
            <p className={`text-xs uppercase ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>Earned</p>
          </div>
          <p className={`text-xl sm:text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            ₦{stats.totalEarned.toLocaleString()}
          </p>
        </div>

        <div className={`rounded-lg p-3 sm:p-4 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
            <p className={`text-xs uppercase ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>Avg Rating</p>
          </div>
          <p className={`text-xl sm:text-2xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className={`px-4 sm:px-6 py-4 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, Afro-ID, or service..."
              className={`w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`w-full sm:w-auto px-4 py-2 border rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm sm:text-base ${
                selectedFilter !== 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">
                {selectedFilter === 'all' ? 'All Status' : getStatusInfo(selectedFilter).label}
              </span>
              <span className="sm:hidden">
                {selectedFilter === 'all' ? 'Filter' : getStatusInfo(selectedFilter).label}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Filter Dropdown */}
            <AnimatePresence>
              {showFilterMenu && (
                <>
                  {/* Mobile backdrop */}
                  <div 
                    className="sm:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setShowFilterMenu(false)}
                  />
                  
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 top-full mt-2 rounded-lg shadow-lg border py-2 z-50 min-w-[180px] ${
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    {(['all', 'completed', 'in_progress', 'disputed', 'cancelled', 'pending'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setSelectedFilter(status);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                          selectedFilter === status 
                            ? theme === 'dark'
                              ? 'bg-indigo-900/50 text-indigo-300 font-medium'
                              : 'bg-indigo-50 text-indigo-700 font-medium'
                            : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {status === 'all' ? 'All Status' : getStatusInfo(status).label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Sort Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => toggleSort('date')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 border rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm sm:text-base ${
                sortBy === 'date'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {sortBy === 'date' && (
                sortOrder === 'desc' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => toggleSort('amount')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 border rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm sm:text-base ${
                sortBy === 'amount'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              {sortBy === 'amount' && (
                sortOrder === 'desc' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Info */}
        {(searchQuery || selectedFilter !== 'all') && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3">
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Showing <strong>{sortedTransactions.length}</strong> of <strong>{transactions.length}</strong> sessions
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Transactions List */}
      <div className={`divide-y max-h-[600px] overflow-y-auto ${
        theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
      }`}>
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3" />
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Loading sessions...</p>
          </div>
        ) : sortedTransactions.length === 0 ? (
          <div className="py-12 text-center px-4">
            <Package className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <p className={`font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>No sessions found</p>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              {searchQuery || selectedFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Your transaction history will appear here'}
            </p>
          </div>
        ) : (
          sortedTransactions.map((transaction) => {
            const statusInfo = getStatusInfo(transaction.status);
            const isExpanded = expandedTransaction === transaction.id;

            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="px-4 sm:px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2">
                        <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                          theme === 'dark' ? 'bg-indigo-900/50' : 'bg-indigo-100'
                        }`}>
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className={`font-semibold text-sm sm:text-base truncate ${
                              theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                              {transaction.otherParty.name}
                            </h3>
                            <span className={`px-2 py-0.5 ${statusInfo.bgColor} ${statusInfo.textColor} text-xs font-semibold rounded-full whitespace-nowrap`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className={`text-xs sm:text-sm ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                          }`}>{transaction.service.name}</p>
                          <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
                            <span className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {transaction.otherParty.village} Village
                            </span>
                            <span className={`text-xs ${
                              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                            }`}>•</span>
                            <span className={`text-xs ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {transaction.userRole === 'payer' ? 'You paid' : 'You earned'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Date */}
                    <div className="text-right flex-shrink-0">
                      <p className={`text-base sm:text-lg font-bold ${
                        transaction.userRole === 'beneficiary' ? 'text-green-600' : theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {transaction.userRole === 'beneficiary' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                      </p>
                      <p className={`text-xs mt-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {new Date(transaction.completedAt || transaction.createdAt).toLocaleDateString('en-NG', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <button
                      onClick={() => setExpandedTransaction(isExpanded ? null : transaction.id)}
                      className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      {isExpanded ? 'Hide' : 'Details'}
                    </button>

                    {transaction.status === 'completed' && transaction.receiptId && (
                      <button
                        onClick={() => onDownloadReceipt(transaction.receiptId!)}
                        className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                          theme === 'dark'
                            ? 'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-900/70'
                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        }`}
                      >
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        Receipt
                      </button>
                    )}

                    {transaction.status === 'disputed' && (
                      <button
                        onClick={() => onViewDispute(transaction.sessionId)}
                        className={`px-3 py-1.5 text-xs sm:text-sm rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                          theme === 'dark'
                            ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">View Dispute</span>
                        <span className="sm:hidden">Dispute</span>
                      </button>
                    )}

                    <button
                      onClick={() => onViewDetails(transaction.sessionId)}
                      className="px-3 py-1.5 text-xs sm:text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">View Session</span>
                      <span className="sm:hidden">View</span>
                    </button>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className={`mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4 ${
                          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}>
                          <div>
                            <p className={`text-xs mb-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>Session ID</p>
                            <p className={`text-xs sm:text-sm font-mono break-all ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                            }`}>{transaction.sessionId}</p>
                          </div>

                          {transaction.escrowId && (
                            <div>
                              <p className={`text-xs mb-1 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>Escrow ID</p>
                              <p className={`text-xs sm:text-sm font-mono break-all ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                              }`}>{transaction.escrowId}</p>
                            </div>
                          )}

                          <div>
                            <p className={`text-xs mb-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>Afro-ID</p>
                            <p className={`text-xs sm:text-sm font-mono break-all ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                            }`}>{transaction.otherParty.afroId}</p>
                          </div>

                          <div>
                            <p className={`text-xs mb-1 ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>Crest Level</p>
                            <p className={`text-xs sm:text-sm ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-900'
                            }`}>Level {transaction.otherParty.crest}</p>
                          </div>

                          {transaction.rating && (
                            <>
                              <div>
                                <p className={`text-xs mb-1 ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>Rating Given</p>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                        i < transaction.rating!.given
                                          ? 'text-yellow-500 fill-yellow-500'
                                          : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className={`text-xs mb-1 ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>Rating Received</p>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                        i < transaction.rating!.received
                                          ? 'text-yellow-500 fill-yellow-500'
                                          : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                          {transaction.dispute && (
                            <div className="col-span-1 sm:col-span-2">
                              <p className={`text-xs mb-1 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>Dispute Status</p>
                              <div className={`px-3 py-2 rounded-lg ${
                                transaction.dispute.resolved
                                  ? theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-700'
                                  : theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-700'
                              }`}>
                                <p className="text-sm font-medium">
                                  {transaction.dispute.resolved ? 'Resolved' : 'Under Review'}
                                </p>
                                {transaction.dispute.outcome && (
                                  <p className="text-xs mt-1">{transaction.dispute.outcome}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer Summary */}
      {sortedTransactions.length > 0 && (
        <div className={`px-4 sm:px-6 py-4 border-t ${
          theme === 'dark' 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Total Earned:</span>
                <span className="font-bold text-green-600">
                  ₦{stats.totalEarned.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className={`w-4 h-4 flex-shrink-0 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`} />
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Total Spent:</span>
                <span className={`font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  ₦{stats.totalSpent.toLocaleString()}
                </span>
              </div>
            </div>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}>
              Net: <span className={`font-bold ${stats.totalEarned - stats.totalSpent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₦{(stats.totalEarned - stats.totalSpent).toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionHistory;
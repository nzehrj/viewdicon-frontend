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
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200'
      },
      cancelled: { 
        color: 'gray', 
        label: 'Cancelled', 
        icon: XCircle,
        bgColor: 'bg-gray-50',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-200'
      },
      disputed: { 
        color: 'red', 
        label: 'Disputed', 
        icon: AlertCircle,
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200'
      },
      in_progress: { 
        color: 'blue', 
        label: 'In Progress', 
        icon: Clock,
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200'
      },
      pending: { 
        color: 'yellow', 
        label: 'Pending', 
        icon: Clock,
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200'
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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-white">
        <h2 className="text-xl font-bold mb-1">Session History</h2>
        <p className="text-sm text-indigo-100">
          All your business transactions and sessions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50 border-b border-gray-200">
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-indigo-600" />
            <p className="text-xs text-gray-500 uppercase">Total Sessions</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-xs text-gray-500 uppercase">Completed</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
        </div>

        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-gray-500 uppercase">Earned</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ₦{stats.totalEarned.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-yellow-600" />
            <p className="text-xs text-gray-500 uppercase">Avg Rating</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, Afro-ID, or service..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`px-4 py-2 border rounded-lg font-medium flex items-center gap-2 transition-colors ${
                selectedFilter !== 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">
                {selectedFilter === 'all' ? 'All Status' : getStatusInfo(selectedFilter).label}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Filter Dropdown */}
            <AnimatePresence>
              {showFilterMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[180px]"
                >
                  {(['all', 'completed', 'in_progress', 'disputed', 'cancelled', 'pending'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedFilter(status);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                        selectedFilter === status ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {status === 'all' ? 'All Status' : getStatusInfo(status).label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => toggleSort('date')}
              className={`px-4 py-2 border rounded-lg font-medium flex items-center gap-2 transition-colors ${
                sortBy === 'date'
                  ? 'bg-indigo-600 text-white border-indigo-600'
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
              className={`px-4 py-2 border rounded-lg font-medium flex items-center gap-2 transition-colors ${
                sortBy === 'amount'
                  ? 'bg-indigo-600 text-white border-indigo-600'
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
          <div className="flex items-center gap-2 mt-3">
            <p className="text-sm text-gray-600">
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
      <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-gray-600">Loading sessions...</p>
          </div>
        ) : sortedTransactions.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No sessions found</p>
            <p className="text-sm text-gray-500">
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
                className="hover:bg-gray-50 transition-colors"
              >
                <div className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {transaction.otherParty.name}
                            </h3>
                            <span className={`px-2 py-0.5 ${statusInfo.bgColor} ${statusInfo.textColor} text-xs font-semibold rounded-full`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{transaction.service.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500">
                              {transaction.otherParty.village} Village
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {transaction.userRole === 'payer' ? 'You paid' : 'You earned'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Date */}
                    <div className="text-right flex-shrink-0">
                      <p className={`text-lg font-bold ${
                        transaction.userRole === 'beneficiary' ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {transaction.userRole === 'beneficiary' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(transaction.completedAt || transaction.createdAt).toLocaleDateString('en-NG', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => setExpandedTransaction(isExpanded ? null : transaction.id)}
                      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      {isExpanded ? 'Hide' : 'Details'}
                    </button>

                    {transaction.status === 'completed' && transaction.receiptId && (
                      <button
                        onClick={() => onDownloadReceipt(transaction.receiptId!)}
                        className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium transition-colors flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4" />
                        Receipt
                      </button>
                    )}

                    {transaction.status === 'disputed' && (
                      <button
                        onClick={() => onViewDispute(transaction.sessionId)}
                        className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors flex items-center gap-1.5"
                      >
                        <AlertCircle className="w-4 h-4" />
                        View Dispute
                      </button>
                    )}

                    <button
                      onClick={() => onViewDetails(transaction.sessionId)}
                      className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      View Session
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
                        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Session ID</p>
                            <p className="text-sm text-gray-900 font-mono">{transaction.sessionId}</p>
                          </div>

                          {transaction.escrowId && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Escrow ID</p>
                              <p className="text-sm text-gray-900 font-mono">{transaction.escrowId}</p>
                            </div>
                          )}

                          <div>
                            <p className="text-xs text-gray-500 mb-1">Afro-ID</p>
                            <p className="text-sm text-gray-900 font-mono">{transaction.otherParty.afroId}</p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 mb-1">Crest Level</p>
                            <p className="text-sm text-gray-900">Level {transaction.otherParty.crest}</p>
                          </div>

                          {transaction.rating && (
                            <>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Rating Given</p>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < transaction.rating!.given
                                          ? 'text-yellow-500 fill-yellow-500'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>

                              <div>
                                <p className="text-xs text-gray-500 mb-1">Rating Received</p>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < transaction.rating!.received
                                          ? 'text-yellow-500 fill-yellow-500'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                          {transaction.dispute && (
                            <div className="col-span-2">
                              <p className="text-xs text-gray-500 mb-1">Dispute Status</p>
                              <div className={`px-3 py-2 rounded-lg ${
                                transaction.dispute.resolved
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-red-50 text-red-700'
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
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">Total Earned:</span>
                <span className="font-bold text-green-600">
                  ₦{stats.totalEarned.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Total Spent:</span>
                <span className="font-bold text-gray-900">
                  ₦{stats.totalSpent.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-gray-500">
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
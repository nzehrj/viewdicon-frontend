import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus,
  Check,
  X,
  Search,
  Users,
  MapPin,
  Briefcase,
  Shield,
  Star,
  Send,
  Clock,
  Filter,
  ChevronDown
} from 'lucide-react';

import { useAppSelector } from '@store/hooks';

// Types
type RequestTab = 'received' | 'sent' | 'suggestions';
type ConnectionTier = 'C1' | 'C2' | 'C3';

interface ConnectionRequest {
  id: string;
  fromUser: {
    id: string;
    afroId: string;
    name: string;
    displayName: string;
    village: string;
    role: string;
    crest: number;
    kinshipTier: ConnectionTier;
    location: {
      city: string;
      country: string;
    };
    stats: {
      connections: number;
      rating: number;
    };
  };
  toUser: {
    id: string;
    name: string;
  };
  message?: string;
  mutualConnections: number;
  sentAt: string;
  expiresAt: string;
}

interface SuggestedConnection {
  id: string;
  afroId: string;
  name: string;
  displayName: string;
  village: string;
  role: string;
  crest: number;
  kinshipTier: ConnectionTier;
  location: {
    city: string;
    country: string;
  };
  stats: {
    connections: number;
    rating: number;
  };
  mutualConnections: number;
  reason: 'same_village' | 'mutual_connections' | 'similar_role' | 'high_rating';
}

interface LinkRequestProps {
  currentUserId: string;
  receivedRequests: ConnectionRequest[];
  sentRequests: ConnectionRequest[];
  suggestions: SuggestedConnection[];
  isLoading: boolean;
  onAcceptRequest: (requestId: string) => Promise<void>;
  onRejectRequest: (requestId: string) => Promise<void>;
  onCancelRequest: (requestId: string) => Promise<void>;
  onSendRequest: (userId: string, message?: string) => Promise<void>;
  onViewProfile: (userId: string) => void;
}

const LinkRequest: React.FC<LinkRequestProps> = ({
  receivedRequests,
  sentRequests,
  suggestions,
  isLoading,
  onAcceptRequest,
  onRejectRequest,
  onCancelRequest,
  onSendRequest,
  onViewProfile
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [activeTab, setActiveTab] = useState<RequestTab>('received');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'C1' | 'same_village'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState<string | null>(null);

  const getTierColor = (tier: ConnectionTier) => {
    const colors = {
      C1: { bg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100', text: theme === 'dark' ? 'text-blue-400' : 'text-blue-700' },
      C2: { bg: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100', text: theme === 'dark' ? 'text-purple-400' : 'text-purple-700' },
      C3: { bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100', text: theme === 'dark' ? 'text-green-400' : 'text-green-700' }
    };
    return colors[tier];
  };

  const getSuggestionReason = (reason: SuggestedConnection['reason']) => {
    const reasons = {
      same_village: { label: 'Same Village', icon: Briefcase, color: theme === 'dark' ? 'blue-400' : 'blue-600', bg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50' },
      mutual_connections: { label: 'Mutual Connections', icon: Users, color: theme === 'dark' ? 'green-400' : 'green-600', bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50' },
      similar_role: { label: 'Similar Role', icon: Briefcase, color: theme === 'dark' ? 'purple-400' : 'purple-600', bg: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-50' },
      high_rating: { label: 'Top Rated', icon: Star, color: theme === 'dark' ? 'yellow-400' : 'yellow-600', bg: theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-50' }
    };
    return reasons[reason];
  };

  const handleSendRequest = async (userId: string) => {
    setSendingRequest(userId);
    try {
      await onSendRequest(userId, requestMessage.trim() || undefined);
      setRequestMessage('');
      setShowMessageModal(null);
    } catch (error) {
      console.error('Failed to send request:', error);
    } finally {
      setSendingRequest(null);
    }
  };

  const filterSuggestions = (items: SuggestedConnection[]) => {
    let filtered = items;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.displayName.toLowerCase().includes(query) ||
        item.village.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query)
      );
    }

    if (selectedFilter === 'C1') {
      filtered = filtered.filter(item => item.kinshipTier === 'C1');
    } else if (selectedFilter === 'same_village') {
      filtered = filtered.filter(item => item.reason === 'same_village');
    }

    return filtered;
  };

  const filteredSuggestions = filterSuggestions(suggestions);

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 1) return `${days} days`;
    if (days === 1) return '1 day';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours} hours`;
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 sm:px-6 py-3 sm:py-4 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Connection Requests</h2>
            <p className="text-xs sm:text-sm text-green-100 mt-1">
              Manage your professional network connections
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-white/20 rounded-full">
              <p className="text-xs sm:text-sm font-semibold">
                {receivedRequests.length} Pending
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - Theme Responsive */}
      <div className={`border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex overflow-x-auto">
          {[
            { id: 'received' as RequestTab, label: 'Received', count: receivedRequests.length },
            { id: 'sent' as RequestTab, label: 'Sent', count: sentRequests.length },
            { id: 'suggestions' as RequestTab, label: 'Suggestions', count: suggestions.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors relative text-sm sm:text-base whitespace-nowrap ${
                activeTab === tab.id
                  ? theme === 'dark'
                    ? 'text-green-400 bg-gray-900'
                    : 'text-green-600 bg-white'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id
                    ? theme === 'dark'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-green-100 text-green-700'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeRequestTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter (Suggestions tab only) */}
      {activeTab === 'suggestions' && (
        <div className={`px-3 sm:px-6 py-3 sm:py-4 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search suggestions..."
                className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`w-full sm:w-auto px-3 sm:px-4 py-2 border rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm ${
                  selectedFilter !== 'all'
                    ? 'bg-green-600 text-white border-green-600'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {selectedFilter === 'all' ? 'All' : selectedFilter === 'C1' ? 'C1 Only' : 'Same Village'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showFilterMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 top-full mt-2 rounded-lg shadow-lg border py-2 z-10 min-w-[160px] ${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    {(['all', 'C1', 'same_village'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setSelectedFilter(filter);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                          selectedFilter === filter
                            ? theme === 'dark'
                              ? 'bg-green-900/30 text-green-400 font-medium'
                              : 'bg-green-50 text-green-700 font-medium'
                            : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {filter === 'all' ? 'All Suggestions' : filter === 'C1' ? 'C1 Only' : 'Same Village'}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-3 sm:p-6 max-h-[600px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'received' && (
            <motion.div
              key="received"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {isLoading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-3" />
                  <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading requests...</p>
                </div>
              ) : receivedRequests.length === 0 ? (
                <div className="py-12 text-center">
                  <UserPlus className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>No pending requests</p>
                  <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Connection requests will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {receivedRequests.map((request) => {
                    const tierColor = getTierColor(request.fromUser.kinshipTier);
                    
                    return (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-2 rounded-xl p-3 sm:p-4 hover:shadow-lg transition-shadow`}
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                              {request.fromUser.name.charAt(0)}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-bold mb-1 text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                  {request.fromUser.displayName}
                                </h3>
                                <p className={`text-xs sm:text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {request.fromUser.role}
                                </p>
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                  <span className={`flex items-center gap-1 text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    {request.fromUser.village}
                                  </span>
                                  <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}>•</span>
                                  <span className={`flex items-center gap-1 text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    {request.fromUser.location.city}
                                  </span>
                                  <span className={`px-2 py-0.5 ${tierColor.bg} ${tierColor.text} text-xs font-semibold rounded-full`}>
                                    {request.fromUser.kinshipTier}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-3 sm:gap-4 mb-3 flex-wrap">
                              <span className={`flex items-center gap-1 text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Crest {request.fromUser.crest}
                              </span>
                              <span className={`flex items-center gap-1 text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                {request.fromUser.stats.connections} connections
                              </span>
                              <span className={`flex items-center gap-1 text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                                {request.fromUser.stats.rating.toFixed(1)}
                              </span>
                            </div>

                            {/* Mutual Connections */}
                            {request.mutualConnections > 0 && (
                              <div className={`mb-3 px-3 py-2 rounded-lg inline-flex items-center gap-2 ${
                                theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
                              }`}>
                                <Users className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                                <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                                  {request.mutualConnections} mutual connection{request.mutualConnections !== 1 ? 's' : ''}
                                </span>
                              </div>
                            )}

                            {/* Message */}
                            {request.message && (
                              <div className={`mb-3 p-3 rounded-lg border-l-4 border-green-500 ${
                                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                              }`}>
                                <p className={`text-xs sm:text-sm italic ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>"{request.message}"</p>
                              </div>
                            )}

                            {/* Time Info */}
                            <div className={`flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs mb-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Sent {new Date(request.sentAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                              </span>
                              <span>
                                Expires in {getTimeRemaining(request.expiresAt)}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => onAcceptRequest(request.id)}
                                className="flex-1 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
                              >
                                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => onRejectRequest(request.id)}
                                className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 ${
                                  theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Decline
                              </button>
                              <button
                                onClick={() => onViewProfile(request.fromUser.id)}
                                className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-xs sm:text-sm transition-colors"
                              >
                                View Profile
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'sent' && (
            <motion.div
              key="sent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {sentRequests.length === 0 ? (
                <div className="py-12 text-center">
                  <Send className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>No sent requests</p>
                  <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    Requests you send will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sentRequests.map((request) => {
                    return (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                            {request.toUser.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{request.toUser.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                Sent {new Date(request.sentAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                              </span>
                              <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}>•</span>
                              <span className="text-xs text-yellow-600 font-medium">
                                Pending
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => onCancelRequest(request.id)}
                            className="px-3 py-1.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'suggestions' && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {filteredSuggestions.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>No suggestions</p>
                  <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {searchQuery || selectedFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Check back later for connection suggestions'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {filteredSuggestions.map((suggestion) => {
                    const tierColor = getTierColor(suggestion.kinshipTier);
                    const reasonInfo = getSuggestionReason(suggestion.reason);
                    const ReasonIcon = reasonInfo.icon;
                    
                    return (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-3 sm:p-4 hover:shadow-lg transition-shadow`}
                      >
                        {/* Header */}
                        <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                            {suggestion.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold text-sm sm:text-base truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {suggestion.displayName}
                            </h3>
                            <p className={`text-xs sm:text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{suggestion.role}</p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
                          <div className="flex items-center gap-2">
                            <Briefcase className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                            <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{suggestion.village} Village</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                            <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                              {suggestion.location.city}, {suggestion.location.country}
                            </span>
                          </div>
                        </div>

                        {/* Stats & Badges */}
                        <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                          <span className={`px-2 py-0.5 ${tierColor.bg} ${tierColor.text} text-xs font-semibold rounded-full`}>
                            {suggestion.kinshipTier}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1 ${
                            theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            <Shield className="w-3 h-3" />
                            Crest {suggestion.crest}
                          </span>
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1 ${
                            theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            <Star className="w-3 h-3" />
                            {suggestion.stats.rating.toFixed(1)}
                          </span>
                        </div>

                        {/* Reason & Mutual */}
                        <div className="space-y-2 mb-2 sm:mb-3">
                          <div className={`px-3 py-2 ${reasonInfo.bg} rounded-lg flex items-center gap-2`}>
                            <ReasonIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-${reasonInfo.color}`} />
                            <span className={`text-xs sm:text-sm text-${reasonInfo.color} font-medium`}>
                              {reasonInfo.label}
                            </span>
                          </div>
                          {suggestion.mutualConnections > 0 && (
                            <div className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                              theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'
                            }`}>
                              <Users className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                              <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>
                                {suggestion.mutualConnections} mutual
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowMessageModal(suggestion.id)}
                            disabled={sendingRequest === suggestion.id}
                            className="flex-1 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            {sendingRequest === suggestion.id ? (
                              <>
                                <div className="animate-spin w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Connect
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => onViewProfile(suggestion.id)}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors ${
                              theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            View
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Message Modal - Theme Responsive */}
      <AnimatePresence>
        {showMessageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowMessageModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6`}
            >
              <h3 className={`text-base sm:text-lg font-bold mb-3 sm:mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Add a message (optional)</h3>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Introduce yourself or explain why you'd like to connect..."
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none mb-3 sm:mb-4 ${
                  theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
                rows={4}
                maxLength={200}
              />
              <p className={`text-xs mb-3 sm:mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                {requestMessage.length}/200 characters
              </p>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setShowMessageModal(null);
                    setRequestMessage('');
                  }}
                  className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSendRequest(showMessageModal)}
                  disabled={sendingRequest === showMessageModal}
                  className="flex-1 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sendingRequest === showMessageModal ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Request
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LinkRequest;
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
  const [activeTab, setActiveTab] = useState<RequestTab>('received');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'C1' | 'same_village'>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState<string | null>(null);

  const getTierColor = (tier: ConnectionTier) => {
    const colors = {
      C1: { bg: 'bg-blue-100', text: 'text-blue-700' },
      C2: { bg: 'bg-purple-100', text: 'text-purple-700' },
      C3: { bg: 'bg-green-100', text: 'text-green-700' }
    };
    return colors[tier];
  };

  const getSuggestionReason = (reason: SuggestedConnection['reason']) => {
    const reasons = {
      same_village: { label: 'Same Village', icon: Briefcase, color: 'blue' },
      mutual_connections: { label: 'Mutual Connections', icon: Users, color: 'green' },
      similar_role: { label: 'Similar Role', icon: Briefcase, color: 'purple' },
      high_rating: { label: 'Top Rated', icon: Star, color: 'yellow' }
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

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.displayName.toLowerCase().includes(query) ||
        item.village.toLowerCase().includes(query) ||
        item.role.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedFilter === 'C1') {
      filtered = filtered.filter(item => item.kinshipTier === 'C1');
    } else if (selectedFilter === 'same_village') {
      // Would need current user's village - using placeholder
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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Connection Requests</h2>
            <p className="text-sm text-green-100 mt-1">
              Manage your professional network connections
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-white/20 rounded-full">
              <p className="text-sm font-semibold">
                {receivedRequests.length} Pending
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex">
          {[
            { id: 'received' as RequestTab, label: 'Received', count: receivedRequests.length },
            { id: 'sent' as RequestTab, label: 'Sent', count: sentRequests.length },
            { id: 'suggestions' as RequestTab, label: 'Suggestions', count: suggestions.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-green-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-green-100 text-green-700'
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
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search suggestions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`px-4 py-2 border rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  selectedFilter !== 'all'
                    ? 'bg-green-600 text-white border-green-600'
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
                    className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[160px]"
                  >
                    {(['all', 'C1', 'same_village'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setSelectedFilter(filter);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                          selectedFilter === filter ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
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
      <div className="p-6 max-h-[600px] overflow-y-auto">
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
                  <p className="text-gray-600">Loading requests...</p>
                </div>
              ) : receivedRequests.length === 0 ? (
                <div className="py-12 text-center">
                  <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">No pending requests</p>
                  <p className="text-sm text-gray-500">
                    Connection requests will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedRequests.map((request) => {
                    const tierColor = getTierColor(request.fromUser.kinshipTier);
                    
                    return (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {request.fromUser.name.charAt(0)}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 mb-1">
                                  {request.fromUser.displayName}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  {request.fromUser.role}
                                </p>
                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                  <span className="flex items-center gap-1 text-sm text-gray-600">
                                    <Briefcase className="w-4 h-4" />
                                    {request.fromUser.village}
                                  </span>
                                  <span className="text-gray-300">•</span>
                                  <span className="flex items-center gap-1 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    {request.fromUser.location.city}
                                  </span>
                                  <span className={`px-2 py-0.5 ${tierColor.bg} ${tierColor.text} text-xs font-semibold rounded-full`}>
                                    {request.fromUser.kinshipTier}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 mb-3">
                              <span className="flex items-center gap-1 text-sm text-gray-600">
                                <Shield className="w-4 h-4" />
                                Crest {request.fromUser.crest}
                              </span>
                              <span className="flex items-center gap-1 text-sm text-gray-600">
                                <Users className="w-4 h-4" />
                                {request.fromUser.stats.connections} connections
                              </span>
                              <span className="flex items-center gap-1 text-sm text-gray-600">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                {request.fromUser.stats.rating.toFixed(1)}
                              </span>
                            </div>

                            {/* Mutual Connections */}
                            {request.mutualConnections > 0 && (
                              <div className="mb-3 px-3 py-2 bg-blue-50 rounded-lg inline-flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-blue-700 font-medium">
                                  {request.mutualConnections} mutual connection{request.mutualConnections !== 1 ? 's' : ''}
                                </span>
                              </div>
                            )}

                            {/* Message */}
                            {request.message && (
                              <div className="mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-green-500">
                                <p className="text-sm text-gray-700 italic">"{request.message}"</p>
                              </div>
                            )}

                            {/* Time Info */}
                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Sent {new Date(request.sentAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                              </span>
                              <span>
                                Expires in {getTimeRemaining(request.expiresAt)}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => onAcceptRequest(request.id)}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors flex items-center justify-center gap-2"
                              >
                                <Check className="w-4 h-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => onRejectRequest(request.id)}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-colors flex items-center justify-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Decline
                              </button>
                              <button
                                onClick={() => onViewProfile(request.fromUser.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
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
                  <Send className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">No sent requests</p>
                  <p className="text-sm text-gray-500">
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
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-bold">
                            {request.toUser.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900">{request.toUser.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                Sent {new Date(request.sentAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="text-xs text-yellow-600 font-medium">
                                Pending
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => onCancelRequest(request.id)}
                            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
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
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">No suggestions</p>
                  <p className="text-sm text-gray-500">
                    {searchQuery || selectedFilter !== 'all'
                      ? 'Try adjusting your filters'
                      : 'Check back later for connection suggestions'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredSuggestions.map((suggestion) => {
                    const tierColor = getTierColor(suggestion.kinshipTier);
                    const reasonInfo = getSuggestionReason(suggestion.reason);
                    const ReasonIcon = reasonInfo.icon;
                    
                    return (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                      >
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                            {suggestion.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {suggestion.displayName}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">{suggestion.role}</p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{suggestion.village} Village</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {suggestion.location.city}, {suggestion.location.country}
                            </span>
                          </div>
                        </div>

                        {/* Stats & Badges */}
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className={`px-2 py-0.5 ${tierColor.bg} ${tierColor.text} text-xs font-semibold rounded-full`}>
                            {suggestion.kinshipTier}
                          </span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Crest {suggestion.crest}
                          </span>
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {suggestion.stats.rating.toFixed(1)}
                          </span>
                        </div>

                        {/* Reason & Mutual */}
                        <div className="space-y-2 mb-3">
                          <div className={`px-3 py-2 bg-${reasonInfo.color}-50 rounded-lg flex items-center gap-2`}>
                            <ReasonIcon className={`w-4 h-4 text-${reasonInfo.color}-600`} />
                            <span className={`text-sm text-${reasonInfo.color}-700 font-medium`}>
                              {reasonInfo.label}
                            </span>
                          </div>
                          {suggestion.mutualConnections > 0 && (
                            <div className="px-3 py-2 bg-blue-50 rounded-lg flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-blue-700 font-medium">
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
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            {sendingRequest === suggestion.id ? (
                              <>
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-4 h-4" />
                                Connect
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => onViewProfile(suggestion.id)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-colors"
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

      {/* Message Modal */}
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
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add a message (optional)</h3>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Introduce yourself or explain why you'd like to connect..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none mb-4"
                rows={4}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mb-4">
                {requestMessage.length}/200 characters
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowMessageModal(null);
                    setRequestMessage('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSendRequest(showMessageModal)}
                  disabled={sendingRequest === showMessageModal}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
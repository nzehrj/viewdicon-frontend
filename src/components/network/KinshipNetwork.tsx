import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users,
  Search,
  Filter,
  Award,
  MessageCircle,
  UserPlus,
  Grid,
  List,
  Shield,
  Star,
  MapPin,
  Briefcase,
  ChevronDown,
  Eye,
  ArrowLeft,
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

// Types
type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'village' | 'tier' | 'recent';
type ConnectionTier = 'C1' | 'C2' | 'C3';

interface Connection {
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
    sessions: number;
    rating: number;
  };
  businessLink?: {
    tier: 'new' | 'trusted' | 'verified' | 'elite';
    totalSessions: number;
    totalValue: number;
  };
  lastActive: string;
  isOnline: boolean;
  mutual: number;
}

interface KinshipNetworkProps {
  userId: string;
  userVillage: string;
  connections: Connection[];
  pendingRequests: number;
  isLoading: boolean;
  onViewProfile: (connectionId: string) => void;
  onSendMessage: (connectionId: string) => void;
  onViewRequests: () => void;
  onBack?: () => void; // ✅ NEW: Back navigation to profile
}

const KinshipNetwork: React.FC<KinshipNetworkProps> = ({
  userVillage,
  connections,
  pendingRequests,
  isLoading,
  onViewProfile,
  onSendMessage,
  onViewRequests,
  onBack, // ✅ NEW: Receive back handler
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'rating'>('name');

  // Filter connections
  const filteredConnections = connections.filter(connection => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        connection.name.toLowerCase().includes(query) ||
        connection.displayName.toLowerCase().includes(query) ||
        connection.afroId.toLowerCase().includes(query) ||
        connection.village.toLowerCase().includes(query) ||
        connection.role.toLowerCase().includes(query)
      );
    }

    if (selectedFilter === 'village') {
      return connection.village === userVillage;
    }
    if (selectedFilter === 'tier') {
      return connection.kinshipTier === 'C1';
    }
    if (selectedFilter === 'recent') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(connection.lastActive) > weekAgo;
    }

    return true;
  });

  // Sort connections
  const sortedConnections = [...filteredConnections].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'recent':
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      case 'rating':
        return b.stats.rating - a.stats.rating;
      default:
        return 0;
    }
  });

  // Calculate stats
  const stats = {
    total: connections.length,
    sameVillage: connections.filter(c => c.village === userVillage).length,
    continental: connections.filter(c => c.kinshipTier === 'C1').length,
    businessPartners: connections.filter(c => c.businessLink).length,
    online: connections.filter(c => c.isOnline).length,
  };

  const getTierColor = (tier: ConnectionTier) => {
    const colors = {
      C1: { bg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100', text: theme === 'dark' ? 'text-blue-400' : 'text-blue-700' },
      C2: { bg: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100', text: theme === 'dark' ? 'text-purple-400' : 'text-purple-700' },
      C3: { bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100', text: theme === 'dark' ? 'text-green-400' : 'text-green-700' }
    };
    return colors[tier];
  };

  const getBusinessLinkBadge = (businessLink?: Connection['businessLink']) => {
    if (!businessLink) return null;

    const tierColors = {
      new: { bg: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100', text: theme === 'dark' ? 'text-gray-300' : 'text-gray-700', label: 'New' },
      trusted: { bg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100', text: theme === 'dark' ? 'text-blue-400' : 'text-blue-700', label: 'Trusted' },
      verified: { bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100', text: theme === 'dark' ? 'text-green-400' : 'text-green-700', label: 'Verified' },
      elite: { bg: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100', text: theme === 'dark' ? 'text-purple-400' : 'text-purple-700', label: 'Elite' }
    };

    const tier = tierColors[businessLink.tier];
    return (
      <span className={`px-2 py-0.5 ${tier.bg} ${tier.text} text-xs font-semibold rounded-full`}>
        {tier.label}
      </span>
    );
  };

  return (
    <div className={`p-[2px] md:p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 md:p-6 text-white border-b border-blue-800">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {/* ✅ NEW: Back Button */}
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Back to profile"
              >
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}
            <div>
              <h2 className="text-base md:text-2xl font-bold">Kinship Network</h2>
              <p className="text-xs md:text-sm text-blue-100 mt-0.5">
                Your professional connections
              </p>
            </div>
          </div>
          {pendingRequests > 0 && (
            <button
              onClick={onViewRequests}
              className="px-2 py-1.5 md:px-3 md:py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold flex items-center justify-center gap-1 md:gap-2 transition-colors relative text-xs md:text-sm"
            >
              <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white text-[10px] md:text-xs rounded-full flex items-center justify-center">
                {pendingRequests}
              </span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-1.5 md:gap-2">
          <div className="bg-white/20 rounded-lg p-1.5 md:p-2 text-center">
            <p className="text-[10px] md:text-xs text-blue-100">Total</p>
            <p className="text-base md:text-xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-1.5 md:p-2 text-center">
            <p className="text-[10px] md:text-xs text-blue-100">Village</p>
            <p className="text-base md:text-xl font-bold">{stats.sameVillage}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-1.5 md:p-2 text-center">
            <p className="text-[10px] md:text-xs text-blue-100">C1</p>
            <p className="text-base md:text-xl font-bold">{stats.continental}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-1.5 md:p-2 text-center">
            <p className="text-[10px] md:text-xs text-blue-100">Partners</p>
            <p className="text-base md:text-xl font-bold">{stats.businessPartners}</p>
          </div>
          <div className="bg-white/20 rounded-lg p-1.5 md:p-2 text-center">
            <p className="text-[10px] md:text-xs text-blue-100">Online</p>
            <p className="text-base md:text-xl font-bold">{stats.online}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={`p-2 md:p-3 border-b ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}>
        <div className="flex flex-col gap-2 mb-2">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search connections..."
              className={`w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 border-b text-sm md:text-base focus:outline-none focus:border-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-800 text-white placeholder-gray-500'
                  : 'bg-white border-gray-100 text-gray-900 placeholder-gray-400'
              }`}
            />
          </div>

          {/* Filter & View Mode */}
          <div className="flex gap-2">
            {/* Filter */}
            <div className="relative flex-1">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`w-full px-2 md:px-3 py-2 border-b font-medium flex items-center justify-center gap-1 md:gap-2 transition-colors text-xs md:text-sm ${
                  selectedFilter !== 'all'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 border-gray-800 hover:bg-gray-700'
                    : 'bg-white text-gray-700 border-gray-100 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm">
                  {selectedFilter === 'all' ? 'All' : selectedFilter === 'village' ? 'Village' : selectedFilter === 'tier' ? 'C1' : 'Recent'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>

              <AnimatePresence>
                {showFilterMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 top-full mt-2 rounded-lg shadow-lg border py-1 z-10 w-full ${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    {(['all', 'village', 'tier', 'recent'] as FilterType[]).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setSelectedFilter(filter);
                          setShowFilterMenu(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs md:text-sm transition-colors ${
                          selectedFilter === filter
                            ? theme === 'dark'
                              ? 'bg-blue-900/30 text-blue-400 font-medium'
                              : 'bg-blue-50 text-blue-700 font-medium'
                            : theme === 'dark'
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {filter === 'all' ? 'All' : filter === 'village' ? 'My Village' : filter === 'tier' ? 'C1 Only' : 'Recent'}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View Mode */}
            <div className={`flex gap-0.5 rounded-lg p-0.5 md:p-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 md:p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? theme === 'dark'
                      ? 'bg-gray-700 text-blue-400'
                      : 'bg-white text-blue-600'
                    : theme === 'dark'
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 md:p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? theme === 'dark'
                      ? 'bg-gray-700 text-blue-400'
                      : 'bg-white text-blue-600'
                    : theme === 'dark'
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto hide-scrollbar">
          <span className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Sort:</span>
          {(['name', 'recent', 'rating'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm rounded-lg transition-colors whitespace-nowrap ${
                sortBy === sort
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {sort === 'name' ? 'Name' : sort === 'recent' ? 'Recent' : 'Rating'}
            </button>
          ))}
        </div>

        {/* Active filters */}
        {(searchQuery || selectedFilter !== 'all') && (
          <div className={`flex items-center justify-between gap-2 mt-2 pt-2 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
            <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {sortedConnections.length} of {connections.length}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Connections List */}
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-0'} max-h-[600px] overflow-y-auto hide-scrollbar`}>
        {isLoading ? (
          <div className="col-span-full py-8 md:py-12 text-center">
            <div className="animate-spin w-10 h-10 md:w-12 md:h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
            <p className={`text-sm md:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
          </div>
        ) : sortedConnections.length === 0 ? (
          <div className="col-span-full py-8 md:py-12 text-center">
            <Users className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-sm md:text-base font-medium mb-1 md:mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>No connections found</p>
            <p className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              {searchQuery || selectedFilter !== 'all' ? 'Try adjusting filters' : 'Start building your network'}
            </p>
          </div>
        ) : (
          sortedConnections.map((connection) => {
            const tierColor = getTierColor(connection.kinshipTier);

            if (viewMode === 'grid') {
              return (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`${theme === 'dark' ? 'bg-gray-800 border-gray-800' : 'bg-white border-gray-100'} border-b md:border p-2 md:p-4 hover:shadow-lg transition-shadow`}
                >
                  {/* Header */}
                  <div className="flex items-start gap-2 mb-1.5 md:mb-2">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                        {connection.name.charAt(0)}
                      </div>
                      {connection.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-3.5 md:h-3.5 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold text-sm md:text-base truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {connection.displayName}
                      </h3>
                      <p className={`text-xs md:text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{connection.role}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1 mb-1.5 md:mb-2">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Briefcase className={`w-3.5 h-3.5 md:w-4 md:h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{connection.village}</span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <MapPin className={`w-3.5 h-3.5 md:w-4 md:h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {connection.location.city}, {connection.location.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Shield className={`w-3.5 h-3.5 md:w-4 md:h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Crest {connection.crest}</span>
                      <span className={`px-1.5 py-0.5 ${tierColor.bg} ${tierColor.text} text-[10px] md:text-xs font-semibold rounded-full`}>
                        {connection.kinshipTier}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className={`grid grid-cols-3 gap-1.5 md:gap-2 mb-1.5 md:mb-2 pt-1.5 md:pt-2 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="text-center">
                      <p className={`text-[10px] md:text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Links</p>
                      <p className={`font-semibold text-xs md:text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.stats.connections}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-[10px] md:text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Sessions</p>
                      <p className={`font-semibold text-xs md:text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.stats.sessions}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-[10px] md:text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Rating</p>
                      <div className="flex items-center justify-center gap-0.5 md:gap-1">
                        <Star className="w-3 h-3 md:w-3.5 md:h-3.5 text-yellow-500 fill-yellow-500" />
                        <p className={`font-semibold text-xs md:text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.stats.rating.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Business Badge */}
                  {connection.businessLink && (
                    <div className="mb-1.5 md:mb-2">
                      {getBusinessLinkBadge(connection.businessLink)}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 md:gap-2">
                    <button
                      onClick={() => onViewProfile(connection.id)}
                      className="w-full px-3 py-2 md:px-4 md:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-xs md:text-sm transition-colors flex items-center justify-center gap-1.5 md:gap-2"
                    >
                      <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      View Profile
                    </button>
                    <button
                      onClick={() => onSendMessage(connection.id)}
                      className={`w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg font-medium text-xs md:text-sm transition-colors flex items-center justify-center gap-1.5 md:gap-2 ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      Send Message
                    </button>
                  </div>
                </motion.div>
              );
            } else {
              // List view
              return (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${theme === 'dark' ? 'bg-gray-800 border-gray-800' : 'bg-white border-gray-100'} border-b p-2 md:p-3 hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-2 md:gap-3 mb-2 md:mb-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg">
                        {connection.name.charAt(0)}
                      </div>
                      {connection.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 md:w-4 md:h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 md:gap-2 mb-1 flex-wrap">
                        <h3 className={`font-semibold text-sm md:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.displayName}</h3>
                        <span className={`px-1.5 py-0.5 ${tierColor.bg} ${tierColor.text} text-[10px] md:text-xs font-semibold rounded-full`}>
                          {connection.kinshipTier}
                        </span>
                        {connection.businessLink && getBusinessLinkBadge(connection.businessLink)}
                      </div>
                      <p className={`text-xs md:text-sm mb-1.5 md:mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{connection.role} • {connection.village}</p>
                      <div className={`flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          {connection.stats.connections}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          {connection.crest}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500 fill-yellow-500" />
                          {connection.stats.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-1.5 md:gap-2">
                    <button
                      onClick={() => onViewProfile(connection.id)}
                      className="w-full px-3 py-2 md:px-4 md:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-xs md:text-sm transition-colors flex items-center justify-center gap-1.5 md:gap-2"
                    >
                      <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      View Profile
                    </button>
                    <button
                      onClick={() => onSendMessage(connection.id)}
                      className={`w-full px-3 py-2 md:px-4 md:py-2.5 rounded-lg font-medium text-xs md:text-sm transition-colors flex items-center justify-center gap-1.5 md:gap-2 ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      Send Message
                    </button>
                  </div>
                </motion.div>
              );
            }
          })
        )}
      </div>
    </div>
  );
};

export default KinshipNetwork;
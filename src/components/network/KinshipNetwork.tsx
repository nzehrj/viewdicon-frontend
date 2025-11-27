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
  Clock
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
}

const KinshipNetwork: React.FC<KinshipNetworkProps> = ({
  userVillage,
  connections,
  pendingRequests,
  isLoading,
  onViewProfile,
  onSendMessage,
  onViewRequests
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
        {tier.label} Partner
      </span>
    );
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-3 sm:py-4 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Kinship Network</h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1">
              Your professional connections across the African continent
            </p>
          </div>
          {pendingRequests > 0 && (
            <button
              onClick={onViewRequests}
              className="px-3 sm:px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold flex items-center justify-center gap-2 transition-colors relative text-sm"
            >
              <UserPlus className="w-4 h-4" />
              Requests
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingRequests}
              </span>
            </button>
          )}
        </div>

        {/* Stats - Mobile Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          <div className="bg-white/20 rounded-lg px-2 sm:px-3 py-2 text-center">
            <p className="text-[10px] sm:text-xs text-blue-100 mb-1">Total</p>
            <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white/20 rounded-lg px-2 sm:px-3 py-2 text-center">
            <p className="text-[10px] sm:text-xs text-blue-100 mb-1">Village</p>
            <p className="text-xl sm:text-2xl font-bold">{stats.sameVillage}</p>
          </div>
          <div className="bg-white/20 rounded-lg px-2 sm:px-3 py-2 text-center">
            <p className="text-[10px] sm:text-xs text-blue-100 mb-1">C1</p>
            <p className="text-xl sm:text-2xl font-bold">{stats.continental}</p>
          </div>
          <div className="bg-white/20 rounded-lg px-2 sm:px-3 py-2 text-center">
            <p className="text-[10px] sm:text-xs text-blue-100 mb-1">Partners</p>
            <p className="text-xl sm:text-2xl font-bold">{stats.businessPartners}</p>
          </div>
          <div className="bg-white/20 rounded-lg px-2 sm:px-3 py-2 text-center col-span-2 sm:col-span-1">
            <p className="text-[10px] sm:text-xs text-blue-100 mb-1">Online</p>
            <p className="text-xl sm:text-2xl font-bold">{stats.online}</p>
          </div>
        </div>
      </div>

      {/* Controls - Theme Responsive */}
      <div className={`px-3 sm:px-6 py-3 sm:py-4 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search connections by name, village, or role..."
              className={`w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
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
                  ? 'bg-blue-600 text-white border-blue-600'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">
                {selectedFilter === 'all' ? 'All' : selectedFilter === 'village' ? 'My Village' : selectedFilter === 'tier' ? 'C1 Only' : 'Recent'}
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
                  {(['all', 'village', 'tier', 'recent'] as FilterType[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setSelectedFilter(filter);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                        selectedFilter === filter
                          ? theme === 'dark'
                            ? 'bg-blue-900/30 text-blue-400 font-medium'
                            : 'bg-blue-50 text-blue-700 font-medium'
                          : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {filter === 'all' ? 'All Connections' : filter === 'village' ? 'My Village' : filter === 'tier' ? 'C1 Only' : 'Recently Active'}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View Mode */}
          <div className={`flex gap-1 rounded-lg p-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? theme === 'dark'
                    ? 'bg-gray-600 text-blue-400 shadow-sm'
                    : 'bg-white text-blue-600 shadow-sm'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? theme === 'dark'
                    ? 'bg-gray-600 text-blue-400 shadow-sm'
                    : 'bg-white text-blue-600 shadow-sm'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sort - Mobile Responsive */}
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Sort by:</span>
          {(['name', 'recent', 'rating'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-lg transition-colors ${
                sortBy === sort
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {sort === 'name' ? 'Name' : sort === 'recent' ? 'Recent' : 'Rating'}
            </button>
          ))}
        </div>

        {/* Active filters info */}
        {(searchQuery || selectedFilter !== 'all') && (
          <div className={`flex flex-col sm:flex-row sm:items-center gap-2 mt-3 pt-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Showing <strong>{sortedConnections.length}</strong> of <strong>{connections.length}</strong> connections
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Connections List */}
      <div className={`p-3 sm:p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4' : 'space-y-3'} max-h-[600px] overflow-y-auto`}>
        {isLoading ? (
          <div className="col-span-full py-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Loading connections...</p>
          </div>
        ) : sortedConnections.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <Users className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>No connections found</p>
            <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              {searchQuery || selectedFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Start building your network by connecting with professionals'}
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
                  className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-3 sm:p-4 hover:shadow-lg transition-shadow`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                          {connection.name.charAt(0)}
                        </div>
                        {connection.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-sm sm:text-base truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {connection.displayName}
                        </h3>
                        <p className={`text-xs sm:text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{connection.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{connection.village} Village</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {connection.location.city}, {connection.location.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Crest {connection.crest}</span>
                      <span className={`px-2 py-0.5 ${tierColor.bg} ${tierColor.text} text-xs font-semibold rounded-full`}>
                        {connection.kinshipTier}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className={`grid grid-cols-3 gap-2 mb-2 sm:mb-3 pt-2 sm:pt-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="text-center">
                      <p className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Connections</p>
                      <p className={`font-semibold text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.stats.connections}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Sessions</p>
                      <p className={`font-semibold text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.stats.sessions}</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Rating</p>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <p className={`font-semibold text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.stats.rating.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Business Link Badge */}
                  {connection.businessLink && (
                    <div className="mb-2 sm:mb-3">
                      {getBusinessLinkBadge(connection.businessLink)}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewProfile(connection.id)}
                      className="flex-1 px-2 sm:px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      View
                    </button>
                    <button
                      onClick={() => onSendMessage(connection.id)}
                      className={`flex-1 px-2 sm:px-3 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-1 ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Message
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
                  className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                        {connection.name.charAt(0)}
                      </div>
                      {connection.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.displayName}</h3>
                        <span className={`px-2 py-0.5 ${tierColor.bg} ${tierColor.text} text-xs font-semibold rounded-full`}>
                          {connection.kinshipTier}
                        </span>
                        {connection.businessLink && getBusinessLinkBadge(connection.businessLink)}
                      </div>
                      <p className={`text-xs sm:text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{connection.role} • {connection.village} Village</p>
                      <div className={`flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {connection.stats.connections} connections
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          Crest {connection.crest}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          {connection.stats.rating.toFixed(1)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Active {new Date(connection.lastActive).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="hidden sm:flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => onViewProfile(connection.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View Profile
                      </button>
                      <button
                        onClick={() => onSendMessage(connection.id)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-1 ${
                          theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </button>
                    </div>
                  </div>
                  
                  {/* Mobile Actions */}
                  <div className="flex sm:hidden gap-2 mt-3">
                    <button
                      onClick={() => onViewProfile(connection.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => onSendMessage(connection.id)}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-1 ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Message
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
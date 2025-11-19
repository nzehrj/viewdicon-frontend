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
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'rating'>('name');

  // Filter connections
  const filteredConnections = connections.filter(connection => {
    // Search filter
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

    // Type filter
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
      C1: 'blue',
      C2: 'purple',
      C3: 'green'
    };
    return colors[tier];
  };

  const getBusinessLinkBadge = (businessLink?: Connection['businessLink']) => {
    if (!businessLink) return null;

    const tierColors = {
      new: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'New' },
      trusted: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Trusted' },
      verified: { bg: 'bg-green-100', text: 'text-green-700', label: 'Verified' },
      elite: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Elite' }
    };

    const tier = tierColors[businessLink.tier];
    return (
      <span className={`px-2 py-0.5 ${tier.bg} ${tier.text} text-xs font-semibold rounded-full`}>
        {tier.label} Partner
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Kinship Network</h2>
            <p className="text-sm text-blue-100 mt-1">
              Your professional connections across the African continent
            </p>
          </div>
          {pendingRequests > 0 && (
            <button
              onClick={onViewRequests}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold flex items-center gap-2 transition-colors relative"
            >
              <UserPlus className="w-4 h-4" />
              Requests
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingRequests}
              </span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3">
          <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-blue-100 mb-1">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-blue-100 mb-1">Village</p>
            <p className="text-2xl font-bold">{stats.sameVillage}</p>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-blue-100 mb-1">C1</p>
            <p className="text-2xl font-bold">{stats.continental}</p>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-blue-100 mb-1">Partners</p>
            <p className="text-2xl font-bold">{stats.businessPartners}</p>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-blue-100 mb-1">Online</p>
            <p className="text-2xl font-bold">{stats.online}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search connections by name, village, or role..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`px-4 py-2 border rounded-lg font-medium flex items-center gap-2 transition-colors ${
                selectedFilter !== 'all'
                  ? 'bg-blue-600 text-white border-blue-600'
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
                  className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[160px]"
                >
                  {(['all', 'village', 'tier', 'recent'] as FilterType[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setSelectedFilter(filter);
                        setShowFilterMenu(false);
                      }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                        selectedFilter === filter ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
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
          <div className="flex gap-1 bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          {(['name', 'recent', 'rating'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                sortBy === sort
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {sort === 'name' ? 'Name' : sort === 'recent' ? 'Recent' : 'Rating'}
            </button>
          ))}
        </div>

        {/* Active filters info */}
        {(searchQuery || selectedFilter !== 'all') && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <strong>{sortedConnections.length}</strong> of <strong>{connections.length}</strong> connections
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Connections List */}
      <div className={`p-6 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'} max-h-[600px] overflow-y-auto`}>
        {isLoading ? (
          <div className="col-span-full py-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-gray-600">Loading connections...</p>
          </div>
        ) : sortedConnections.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">No connections found</p>
            <p className="text-sm text-gray-500">
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
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {connection.name.charAt(0)}
                        </div>
                        {connection.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {connection.displayName}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">{connection.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{connection.village} Village</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {connection.location.city}, {connection.location.country}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Crest {connection.crest}</span>
                      <span className={`px-2 py-0.5 bg-${tierColor}-100 text-${tierColor}-700 text-xs font-semibold rounded-full`}>
                        {connection.kinshipTier}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3 pt-3 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Connections</p>
                      <p className="font-semibold text-gray-900">{connection.stats.connections}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Sessions</p>
                      <p className="font-semibold text-gray-900">{connection.stats.sessions}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Rating</p>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <p className="font-semibold text-gray-900">{connection.stats.rating.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Business Link Badge */}
                  {connection.businessLink && (
                    <div className="mb-3">
                      {getBusinessLinkBadge(connection.businessLink)}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewProfile(connection.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors flex items-center justify-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => onSendMessage(connection.id)}
                      className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors flex items-center justify-center gap-1"
                    >
                      <MessageCircle className="w-4 h-4" />
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
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {connection.name.charAt(0)}
                      </div>
                      {connection.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{connection.displayName}</h3>
                        <span className={`px-2 py-0.5 bg-${tierColor}-100 text-${tierColor}-700 text-xs font-semibold rounded-full`}>
                          {connection.kinshipTier}
                        </span>
                        {connection.businessLink && getBusinessLinkBadge(connection.businessLink)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{connection.role} • {connection.village} Village</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
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
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => onViewProfile(connection.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View Profile
                      </button>
                      <button
                        onClick={() => onSendMessage(connection.id)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors flex items-center gap-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Message
                      </button>
                    </div>
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
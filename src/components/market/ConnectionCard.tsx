import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users,
  Star,
  MapPin,
  Briefcase,
  Shield,
  MessageCircle,
  Eye,
  UserMinus,
  Award,
  TrendingUp,
  MoreVertical,
  Check
} from 'lucide-react';

import { useAppSelector } from '@store/hooks';

// Types
type ConnectionTier = 'C1' | 'C2' | 'C3';
type CardSize = 'compact' | 'default' | 'detailed';

interface MutualConnection {
  id: string;
  name: string;
  avatar?: string;
}

interface ConnectionCardProps {
  connection: {
    id: string;
    afroId: string;
    name: string;
    displayName: string;
    avatar?: string;
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
    isOnline: boolean;
    mutualConnections?: MutualConnection[];
  };
  size?: CardSize;
  showActions?: boolean;
  onViewProfile?: (connectionId: string) => void;
  onSendMessage?: (connectionId: string) => void;
  onRemove?: (connectionId: string) => void;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({
  connection,
  size = 'default',
  showActions = true,
  onViewProfile,
  onSendMessage,
  onRemove
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getTierColor = (tier: ConnectionTier) => {
    const colors = {
      C1: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
      C2: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
      C3: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' }
    };
    return colors[tier];
  };

  const getBusinessLinkInfo = (businessLink?: typeof connection.businessLink) => {
    if (!businessLink) return null;

    const tierInfo = {
      new: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'New Partner', icon: Users },
      trusted: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Trusted Partner', icon: Check },
      verified: { bg: 'bg-green-100', text: 'text-green-700', label: 'Verified Partner', icon: Shield },
      elite: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Elite Partner', icon: Award }
    };

    return tierInfo[businessLink.tier];
  };

  const tierColor = getTierColor(connection.kinshipTier);
  const businessLinkInfo = getBusinessLinkInfo(connection.businessLink);
  const BusinessLinkIcon = businessLinkInfo?.icon;
  const theme = useAppSelector((state) => state.theme.theme);

  // Compact size - minimal info
  if (size === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer`}
        onClick={() => onViewProfile?.(connection.id)}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {connection.name.charAt(0)}
            </div>
            {connection.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate">
              {connection.displayName}
            </h3>
            <p className="text-xs text-gray-600 truncate">{connection.role}</p>
          </div>

          {/* Tier Badge */}
          <span className={`px-2 py-0.5 ${tierColor.bg} ${tierColor.text} text-xs font-semibold rounded-full`}>
            {connection.kinshipTier}
          </span>
        </div>
      </motion.div>
    );
  }

  // Default size - standard card
  if (size === 'default') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {connection.name.charAt(0)}
              </div>
              {connection.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>

            {/* Name & Role */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {connection.displayName}
              </h3>
              <p className="text-sm text-gray-600 truncate">{connection.role}</p>
            </div>
          </div>

          {/* Menu */}
          {showActions && onRemove && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[140px]">
                  <button
                    onClick={() => {
                      onRemove(connection.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <UserMinus className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
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
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Crest {connection.crest}</span>
              <span className={`px-2 py-0.5 ${tierColor.bg} ${tierColor.text} text-xs font-semibold rounded-full`}>
                {connection.kinshipTier}
              </span>
            </div>
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
        {businessLinkInfo && BusinessLinkIcon && (
          <div className={`mb-3 px-3 py-2 ${businessLinkInfo.bg} rounded-lg flex items-center gap-2`}>
            <BusinessLinkIcon className={`w-4 h-4 ${businessLinkInfo.text}`} />
            <span className={`text-sm font-semibold ${businessLinkInfo.text}`}>
              {businessLinkInfo.label}
            </span>
          </div>
        )}

        {/* Mutual Connections */}
        {connection.mutualConnections && connection.mutualConnections.length > 0 && (
          <div className="mb-3 flex items-center gap-2">
            <div className="flex -space-x-2">
              {connection.mutualConnections.slice(0, 3).map((mutual) => (
                <div
                  key={mutual.id}
                  className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-700"
                >
                  {mutual.name.charAt(0)}
                </div>
              ))}
            </div>
            <span className="text-xs text-gray-600">
              {connection.mutualConnections.length} mutual connection{connection.mutualConnections.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            <button
              onClick={() => onViewProfile?.(connection.id)}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors flex items-center justify-center gap-1"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
            <button
              onClick={() => onSendMessage?.(connection.id)}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors flex items-center justify-center gap-1"
            >
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  // Detailed size - full information
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {connection.name.charAt(0)}
          </div>
          {connection.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {connection.displayName}
              </h2>
              <p className="text-gray-600 mb-2">{connection.role}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 ${tierColor.bg} ${tierColor.text} text-sm font-semibold rounded-full`}>
                  {connection.kinshipTier} - Continental African
                </span>
                {businessLinkInfo && BusinessLinkIcon && (
                  <span className={`px-3 py-1 ${businessLinkInfo.bg} ${businessLinkInfo.text} text-sm font-semibold rounded-full flex items-center gap-1`}>
                    <BusinessLinkIcon className="w-4 h-4" />
                    {businessLinkInfo.label}
                  </span>
                )}
              </div>
            </div>

            {/* Menu */}
            {showActions && onRemove && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[160px]">
                    <button
                      onClick={() => {
                        onRemove(connection.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <UserMinus className="w-4 h-4" />
                      Remove Connection
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-500 uppercase">Village</span>
          </div>
          <p className="font-semibold text-gray-900">{connection.village}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-500 uppercase">Location</span>
          </div>
          <p className="font-semibold text-gray-900">
            {connection.location.city}, {connection.location.country}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-500 uppercase">Crest Level</span>
          </div>
          <p className="font-semibold text-gray-900">Level {connection.crest}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-500 uppercase">Rating</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(connection.stats.rating)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 font-semibold text-gray-900">
              {connection.stats.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Extended Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-gray-500">Connections</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{connection.stats.connections}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className="text-xs text-gray-500">Sessions</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{connection.stats.sessions}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Award className="w-4 h-4 text-purple-600" />
            <p className="text-xs text-gray-500">Crest</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{connection.crest}</p>
        </div>
      </div>

      {/* Business Partnership Details */}
      {connection.businessLink && (
        <div className={`mb-4 p-4 ${businessLinkInfo?.bg} rounded-lg border-2 ${tierColor.border}`}>
          <div className="flex items-center gap-2 mb-3">
            {BusinessLinkIcon && <BusinessLinkIcon className={`w-5 h-5 ${businessLinkInfo?.text}`} />}
            <h3 className={`font-bold ${businessLinkInfo?.text}`}>
              {businessLinkInfo?.label}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Sessions</p>
              <p className="font-semibold text-gray-900">{connection.businessLink.totalSessions}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Value</p>
              <p className="font-semibold text-gray-900">
                ₦{connection.businessLink.totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mutual Connections */}
      {connection.mutualConnections && connection.mutualConnections.length > 0 && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            Mutual Connections ({connection.mutualConnections.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {connection.mutualConnections.slice(0, 5).map((mutual) => (
              <div
                key={mutual.id}
                className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-blue-200"
              >
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {mutual.name.charAt(0)}
                </div>
                <span className="text-sm text-gray-700">{mutual.name}</span>
              </div>
            ))}
            {connection.mutualConnections.length > 5 && (
              <span className="px-3 py-1 text-sm text-blue-600 font-medium">
                +{connection.mutualConnections.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Afro-ID */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 mb-1">Afro-ID</p>
        <p className="font-mono text-sm font-semibold text-gray-900">{connection.afroId}</p>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex gap-3">
          <button
            onClick={() => onViewProfile?.(connection.id)}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            View Full Profile
          </button>
          <button
            onClick={() => onSendMessage?.(connection.id)}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Send Message
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ConnectionCard;
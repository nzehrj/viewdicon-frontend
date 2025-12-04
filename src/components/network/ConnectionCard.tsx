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
  const theme = useAppSelector((state) => state.theme.theme);
  const [showMenu, setShowMenu] = useState(false);

  const getTierColor = (tier: ConnectionTier) => {
    const colors = {
      C1: { 
        bg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100', 
        text: theme === 'dark' ? 'text-blue-400' : 'text-blue-700', 
        border: theme === 'dark' ? 'border-blue-700' : 'border-blue-300' 
      },
      C2: { 
        bg: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100', 
        text: theme === 'dark' ? 'text-purple-400' : 'text-purple-700', 
        border: theme === 'dark' ? 'border-purple-700' : 'border-purple-300' 
      },
      C3: { 
        bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100', 
        text: theme === 'dark' ? 'text-green-400' : 'text-green-700', 
        border: theme === 'dark' ? 'border-green-700' : 'border-green-300' 
      }
    };
    return colors[tier];
  };

  const getBusinessLinkInfo = (businessLink?: typeof connection.businessLink) => {
    if (!businessLink) return null;

    const tierInfo = {
      new: { 
        bg: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100', 
        text: theme === 'dark' ? 'text-gray-300' : 'text-gray-700', 
        label: 'New Partner', 
        icon: Users 
      },
      trusted: { 
        bg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100', 
        text: theme === 'dark' ? 'text-blue-400' : 'text-blue-700', 
        label: 'Trusted Partner', 
        icon: Check 
      },
      verified: { 
        bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100', 
        text: theme === 'dark' ? 'text-green-400' : 'text-green-700', 
        label: 'Verified Partner', 
        icon: Shield 
      },
      elite: { 
        bg: theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100', 
        text: theme === 'dark' ? 'text-purple-400' : 'text-purple-700', 
        label: 'Elite Partner', 
        icon: Award 
      }
    };

    return tierInfo[businessLink.tier];
  };

  const tierColor = getTierColor(connection.kinshipTier);
  const businessLinkInfo = getBusinessLinkInfo(connection.businessLink);
  const BusinessLinkIcon = businessLinkInfo?.icon;

  // COMPACT SIZE
  if (size === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-2 md:p-3 hover:shadow-md transition-shadow cursor-pointer`}
        onClick={() => onViewProfile?.(connection.id)}
      >
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {connection.name.charAt(0)}
            </div>
            {connection.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-xs md:text-sm truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {connection.displayName}
            </h3>
            <p className={`text-[10px] md:text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{connection.role}</p>
          </div>
          <span className={`px-1.5 md:px-2 py-0.5 ${tierColor.bg} ${tierColor.text} text-[10px] md:text-xs font-semibold rounded-full`}>
            {connection.kinshipTier}
          </span>
        </div>
      </motion.div>
    );
  }

  // DEFAULT SIZE
  if (size === 'default') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl p-2 md:p-4 hover:shadow-lg transition-shadow`}
      >
        <div className="flex items-start justify-between mb-2 md:mb-3">
          <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base">
                {connection.name.charAt(0)}
              </div>
              {connection.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 md:w-4 md:h-4 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold text-sm md:text-base truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {connection.displayName}
              </h3>
              <p className={`text-xs md:text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{connection.role}</p>
            </div>
          </div>
          {showActions && onRemove && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-1 rounded transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <MoreVertical className={`w-3.5 h-3.5 md:w-4 md:h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
              {showMenu && (
                <div className={`absolute right-0 top-full mt-1 rounded-lg shadow-lg border py-1 z-10 min-w-[140px] ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                  <button
                    onClick={() => { onRemove(connection.id); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                  >
                    <UserMinus className="w-4 h-4" /> Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-1 md:space-y-2 mb-2 md:mb-3">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Briefcase className={`w-3.5 h-3.5 md:w-4 md:h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{connection.village} Village</span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <MapPin className={`w-3.5 h-3.5 md:w-4 md:h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {connection.location.city}, {connection.location.country}
            </span>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2">
            <Shield className={`w-3.5 h-3.5 md:w-4 md:h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Crest {connection.crest}</span>
              <span className={`px-1.5 md:px-2 py-0.5 ${tierColor.bg} ${tierColor.text} text-[10px] md:text-xs font-semibold rounded-full`}>
                {connection.kinshipTier}
              </span>
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-3 gap-1.5 md:gap-2 mb-2 md:mb-3 pt-2 md:pt-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="text-center">
            <p className={`text-[10px] md:text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Connections</p>
            <p className={`font-semibold text-xs md:text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.stats.connections}</p>
          </div>
          <div className="text-center">
            <p className={`text-[10px] md:text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Sessions</p>
            <p className={`font-semibold text-xs md:text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.stats.sessions}</p>
          </div>
          <div className="text-center">
            <p className={`text-[10px] md:text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Rating</p>
            <div className="flex items-center justify-center gap-0.5 md:gap-1">
              <Star className="w-2.5 h-2.5 md:w-3 md:h-3 text-yellow-500 fill-yellow-500" />
              <p className={`font-semibold text-xs md:text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.stats.rating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        {businessLinkInfo && BusinessLinkIcon && (
          <div className={`mb-2 md:mb-3 px-2 md:px-3 py-1.5 md:py-2 ${businessLinkInfo.bg} rounded-lg flex items-center gap-1.5 md:gap-2`}>
            <BusinessLinkIcon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${businessLinkInfo.text}`} />
            <span className={`text-xs md:text-sm font-semibold ${businessLinkInfo.text}`}>{businessLinkInfo.label}</span>
          </div>
        )}

        {connection.mutualConnections && connection.mutualConnections.length > 0 && (
          <div className="mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2">
            <div className="flex -space-x-2">
              {connection.mutualConnections.slice(0, 3).map((mutual) => (
                <div
                  key={mutual.id}
                  className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center text-[10px] md:text-xs font-semibold ${
                    theme === 'dark' ? 'bg-gray-600 border-gray-800 text-gray-200' : 'bg-gray-300 border-white text-gray-700'
                  }`}
                >
                  {mutual.name.charAt(0)}
                </div>
              ))}
            </div>
            <span className={`text-[10px] md:text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {connection.mutualConnections.length} mutual connection{connection.mutualConnections.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {showActions && (
          <div className="flex flex-col gap-1.5 md:gap-2">
            <button
              onClick={() => onViewProfile?.(connection.id)}
              className="w-full px-3 py-1.5 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-xs md:text-sm transition-colors flex items-center justify-center gap-1 md:gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" /> View
            </button>
            <button
              onClick={() => onSendMessage?.(connection.id)}
              className={`w-full px-3 py-1.5 md:py-2 rounded-lg font-medium text-xs md:text-sm transition-colors flex items-center justify-center gap-1 md:gap-1.5 ${
                theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4" /> Message
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  // DETAILED SIZE
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-2 rounded-xl p-3 md:p-6 hover:shadow-xl transition-shadow`}
    >
      <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-2xl">
            {connection.name.charAt(0)}
          </div>
          {connection.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-4 h-4 md:w-5 md:h-5 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1 md:mb-2">
            <div className="flex-1 min-w-0">
              <h2 className={`text-base md:text-xl font-bold mb-0.5 md:mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {connection.displayName}
              </h2>
              <p className={`text-xs md:text-base mb-1 md:mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{connection.role}</p>
              <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                <span className={`px-2 md:px-3 py-0.5 md:py-1 ${tierColor.bg} ${tierColor.text} text-[10px] md:text-sm font-semibold rounded-full`}>
                  {connection.kinshipTier} - Continental African
                </span>
                {businessLinkInfo && BusinessLinkIcon && (
                  <span className={`px-2 md:px-3 py-0.5 md:py-1 ${businessLinkInfo.bg} ${businessLinkInfo.text} text-[10px] md:text-sm font-semibold rounded-full flex items-center gap-1`}>
                    <BusinessLinkIcon className="w-3 h-3 md:w-4 md:h-4" /> {businessLinkInfo.label}
                  </span>
                )}
              </div>
            </div>
            {showActions && onRemove && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={`p-1.5 md:p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <MoreVertical className={`w-4 h-4 md:w-5 md:h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
                {showMenu && (
                  <div className={`absolute right-0 top-full mt-1 rounded-lg shadow-lg border py-1 z-10 min-w-[160px] ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                    <button
                      onClick={() => { onRemove(connection.id); setShowMenu(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                    >
                      <UserMinus className="w-4 h-4" /> Remove Connection
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-4">
        <div className={`rounded-lg p-2 md:p-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
            <Briefcase className={`w-3.5 h-3.5 md:w-4 md:h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-[10px] md:text-xs uppercase ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Village</span>
          </div>
          <p className={`font-semibold text-xs md:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.village}</p>
        </div>
        <div className={`rounded-lg p-2 md:p-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
            <MapPin className={`w-3.5 h-3.5 md:w-4 md:h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-[10px] md:text-xs uppercase ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Location</span>
          </div>
          <p className={`font-semibold text-xs md:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {connection.location.city}, {connection.location.country}
          </p>
        </div>
        <div className={`rounded-lg p-2 md:p-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
            <Shield className={`w-3.5 h-3.5 md:w-4 md:h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-[10px] md:text-xs uppercase ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Crest Level</span>
          </div>
          <p className={`font-semibold text-xs md:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Level {connection.crest}</p>
        </div>
        <div className={`rounded-lg p-2 md:p-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
            <Star className={`w-3.5 h-3.5 md:w-4 md:h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className={`text-[10px] md:text-xs uppercase ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Rating</span>
          </div>
          <div className="flex items-center gap-0.5 md:gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 md:w-4 md:h-4 ${i < Math.floor(connection.stats.rating) ? 'text-yellow-500 fill-yellow-500' : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}`}
              />
            ))}
            <span className={`ml-1 md:ml-2 font-semibold text-xs md:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {connection.stats.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-3 gap-2 md:gap-4 mb-3 md:mb-4 pt-3 md:pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-0.5 md:gap-1 mb-0.5 md:mb-1">
            <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
            <p className={`text-[10px] md:text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Connections</p>
          </div>
          <p className={`text-lg md:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.stats.connections}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-0.5 md:gap-1 mb-0.5 md:mb-1">
            <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
            <p className={`text-[10px] md:text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Sessions</p>
          </div>
          <p className={`text-lg md:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.stats.sessions}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-0.5 md:gap-1 mb-0.5 md:mb-1">
            <Award className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-600" />
            <p className={`text-[10px] md:text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Crest</p>
          </div>
          <p className={`text-lg md:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.crest}</p>
        </div>
      </div>

      {connection.businessLink && (
        <div className={`mb-3 md:mb-4 p-3 md:p-4 ${businessLinkInfo?.bg} rounded-lg border-2 ${tierColor.border}`}>
          <div className="flex items-center gap-1.5 md:gap-2 mb-2 md:mb-3">
            {BusinessLinkIcon && <BusinessLinkIcon className={`w-4 h-4 md:w-5 md:h-5 ${businessLinkInfo?.text}`} />}
            <h3 className={`font-bold text-sm md:text-base ${businessLinkInfo?.text}`}>{businessLinkInfo?.label}</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div>
              <p className={`text-[10px] md:text-xs mb-0.5 md:mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Sessions</p>
              <p className={`font-semibold text-xs md:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.businessLink.totalSessions}</p>
            </div>
            <div>
              <p className={`text-[10px] md:text-xs mb-0.5 md:mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Value</p>
              <p className={`font-semibold text-xs md:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                ₦{connection.businessLink.totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {connection.mutualConnections && connection.mutualConnections.length > 0 && (
        <div className={`mb-3 md:mb-4 p-3 md:p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
          <h3 className={`font-semibold text-sm md:text-base mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <Users className={`w-3.5 h-3.5 md:w-4 md:h-4 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            Mutual Connections ({connection.mutualConnections.length})
          </h3>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {connection.mutualConnections.slice(0, 5).map((mutual) => (
              <div
                key={mutual.id}
                className={`flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 rounded-full border ${
                  theme === 'dark' ? 'bg-gray-700 border-blue-700' : 'bg-white border-blue-200'
                }`}
              >
                <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] md:text-xs font-semibold">
                  {mutual.name.charAt(0)}
                </div>
                <span className={`text-xs md:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{mutual.name}</span>
              </div>
            ))}
            {connection.mutualConnections.length > 5 && (
              <span className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                +{connection.mutualConnections.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className={`mb-3 md:mb-4 p-2 md:p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <p className={`text-[10px] md:text-xs mb-0.5 md:mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Afro-ID</p>
        <p className={`font-mono text-xs md:text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.afroId}</p>
      </div>

      {showActions && (
        <div className="flex flex-col gap-2 md:gap-3">
          <button
            onClick={() => onViewProfile?.(connection.id)}
            className="w-full px-3 py-2 md:px-4 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-xs md:text-base transition-colors flex items-center justify-center gap-1.5 md:gap-2"
          >
            <Eye className="w-4 h-4 md:w-5 md:h-5" /> View Full Profile
          </button>
          <button
            onClick={() => onSendMessage?.(connection.id)}
            className={`w-full px-3 py-2 md:px-4 md:py-3 rounded-lg font-semibold text-xs md:text-base transition-colors flex items-center justify-center gap-1.5 md:gap-2 ${
              theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5" /> Send Message
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ConnectionCard;
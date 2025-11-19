import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Award,
  Link2,
  X,
  Info,
  Clock
} from 'lucide-react';

// Types
type LinkTier = 'new' | 'trusted' | 'verified' | 'elite';

interface ConnectionStats {
  totalSessions: number;
  completedSessions: number;
  totalValue: number;
  averageRating: number;
  firstSessionDate: string;
  lastSessionDate: string;
  successRate: number;
}

interface BusinessLinkBadgeProps {
  otherParty: {
    id: string;
    name: string;
    afroId: string;
    village: string;
    crest: number;
  };
  linkTier: LinkTier;
  stats: ConnectionStats;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  onClick?: () => void;
}

const BusinessLinkBadge: React.FC<BusinessLinkBadgeProps> = ({
  otherParty,
  linkTier,
  stats,
  size = 'medium',
  showDetails = false,
  onClick
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const getLinkTierInfo = (tier: LinkTier) => {
    const tierMap = {
      new: {
        label: 'New Connection',
        color: 'gray',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-300',
        icon: Link2,
        description: 'First time working together',
        minSessions: 0
      },
      trusted: {
        label: 'Trusted Partner',
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-300',
        icon: Users,
        description: '3+ successful sessions',
        minSessions: 3
      },
      verified: {
        label: 'Verified Partner',
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-300',
        icon: CheckCircle,
        description: '10+ sessions, 4.5+ rating',
        minSessions: 10
      },
      elite: {
        label: 'Elite Partner',
        color: 'purple',
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-300',
        icon: Award,
        description: '25+ sessions, 5.0 rating',
        minSessions: 25
      }
    };
    return tierMap[tier];
  };

  const tierInfo = getLinkTierInfo(linkTier);
  const TierIcon = tierInfo.icon;

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'px-2 py-1',
          icon: 'w-3 h-3',
          text: 'text-xs',
          gap: 'gap-1'
        };
      case 'large':
        return {
          container: 'px-4 py-2',
          icon: 'w-5 h-5',
          text: 'text-base',
          gap: 'gap-2'
        };
      default:
        return {
          container: 'px-3 py-1.5',
          icon: 'w-4 h-4',
          text: 'text-sm',
          gap: 'gap-1.5'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  const calculateTimeSince = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffTime = Math.abs(now.getTime() - past.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (showDetails) {
      setShowModal(true);
    }
  };

  return (
    <>
      {/* Badge */}
      <div
        className={`relative inline-flex items-center ${sizeClasses.gap} ${sizeClasses.container} ${tierInfo.bgColor} ${tierInfo.borderColor} border rounded-full ${sizeClasses.text} font-semibold ${tierInfo.textColor} ${
          (onClick || showDetails) ? 'cursor-pointer hover:opacity-80' : ''
        } transition-opacity`}
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <TierIcon className={sizeClasses.icon} />
        <span>{tierInfo.label}</span>
        {showDetails && size !== 'small' && (
          <Info className="w-3 h-3 opacity-70" />
        )}

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && size === 'small' && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10"
            >
              {tierInfo.label}
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r from-${tierInfo.color}-600 to-${tierInfo.color}-700 px-6 py-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <TierIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{tierInfo.label}</h2>
                      <p className="text-sm text-white/90">{tierInfo.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Partner Info */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{otherParty.name}</h3>
                    <p className="text-sm text-gray-600">{otherParty.village} Village</p>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 rounded-full">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">
                      Crest {otherParty.crest}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Partnership Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Total Sessions */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <p className="text-xs text-gray-500 uppercase">Total Sessions</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
                  </div>

                  {/* Completed */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <p className="text-xs text-gray-500 uppercase">Completed</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedSessions}</p>
                  </div>

                  {/* Total Value */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <p className="text-xs text-gray-500 uppercase">Total Value</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ₦{stats.totalValue.toLocaleString()}
                    </p>
                  </div>

                  {/* Average Rating */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-600" />
                      <p className="text-xs text-gray-500 uppercase">Avg Rating</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.averageRating.toFixed(1)}
                      </p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(stats.averageRating)
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Success Rate */}
                  <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <p className="text-xs text-gray-500 uppercase">Success Rate</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.successRate.toFixed(1)}%
                      </p>
                      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-green-600 h-full rounded-full transition-all"
                          style={{ width: `${stats.successRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Partnership Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">First Session</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(stats.firstSessionDate).toLocaleDateString('en-NG', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Last Session</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {calculateTimeSince(stats.lastSessionDate)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Partnership Duration</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {calculateTimeSince(stats.firstSessionDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust Level Indicator */}
                <div className={`mt-6 p-4 ${tierInfo.bgColor} ${tierInfo.borderColor} border-2 rounded-xl`}>
                  <div className="flex items-center gap-3">
                    <TierIcon className={`w-8 h-8 ${tierInfo.textColor}`} />
                    <div className="flex-1">
                      <p className={`font-bold ${tierInfo.textColor}`}>
                        {tierInfo.label}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {tierInfo.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress to Next Tier */}
                  {linkTier !== 'elite' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      {linkTier === 'new' && (
                        <div>
                          <p className="text-xs text-gray-600 mb-2">
                            Progress to Trusted Partner
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-blue-600 h-full rounded-full transition-all"
                                style={{ width: `${(stats.completedSessions / 3) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-gray-600">
                              {stats.completedSessions}/3
                            </span>
                          </div>
                        </div>
                      )}
                      {linkTier === 'trusted' && (
                        <div>
                          <p className="text-xs text-gray-600 mb-2">
                            Progress to Verified Partner
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-green-600 h-full rounded-full transition-all"
                                style={{ width: `${(stats.completedSessions / 10) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-gray-600">
                              {stats.completedSessions}/10
                            </span>
                          </div>
                          {stats.averageRating < 4.5 && (
                            <p className="text-xs text-amber-600 mt-2">
                              * Also needs 4.5+ average rating
                            </p>
                          )}
                        </div>
                      )}
                      {linkTier === 'verified' && (
                        <div>
                          <p className="text-xs text-gray-600 mb-2">
                            Progress to Elite Partner
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-purple-600 h-full rounded-full transition-all"
                                style={{ width: `${(stats.completedSessions / 25) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-gray-600">
                              {stats.completedSessions}/25
                            </span>
                          </div>
                          {stats.averageRating < 5.0 && (
                            <p className="text-xs text-amber-600 mt-2">
                              * Also needs 5.0 average rating
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Partnership levels help identify reliable business connections
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BusinessLinkBadge;
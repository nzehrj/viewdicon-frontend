import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity,
  MapPin,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  Globe,
  Chrome,
  AlertTriangle,
  CheckCircle,
  XCircle,
  LogOut,
  Shield,
  Eye,
  Info,
  RefreshCw,
  Zap
} from 'lucide-react';

import { useAppSelector } from '@store/hooks';

// Types
type SessionStatus = 'active' | 'idle' | 'expired' | 'terminated';
type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'laptop' | 'other';

interface Session {
  id: string;
  deviceName: string;
  deviceType: DeviceType;
  browser: string;
  browserVersion: string;
  os: string;
  location: {
    city: string;
    country: string;
    ip: string;
  };
  status: SessionStatus;
  startedAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  isCurrent: boolean;
  isSecure: boolean; // HTTPS
  activities: {
    timestamp: Date;
    action: string;
    details?: string;
  }[];
}

interface SessionMonitorProps {
  sessions: Session[];
  onTerminateSession?: (sessionId: string) => void;
  onTerminateAllOthers?: () => void;
  onRefreshSessions?: () => void;
  maxConcurrentSessions?: number;
}

const SessionMonitor: React.FC<SessionMonitorProps> = ({
  sessions,
  onTerminateSession,
  onTerminateAllOthers,
  onRefreshSessions,
  maxConcurrentSessions = 5
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [confirmTerminate, setConfirmTerminate] = useState<string | null>(null);
  const [confirmTerminateAll, setConfirmTerminateAll] = useState(false);

  const getDeviceIcon = (type: DeviceType) => {
    const iconMap = {
      mobile: Smartphone,
      tablet: Tablet,
      desktop: Monitor,
      laptop: Laptop,
      other: Globe
    };
    return iconMap[type];
  };

  const getStatusInfo = (status: SessionStatus) => {
    const statusMap = {
      active: {
        label: 'Active',
        color: 'green',
        bgColor: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50',
        textColor: theme === 'dark' ? 'text-green-400' : 'text-green-700',
        borderColor: theme === 'dark' ? 'border-green-700' : 'border-green-200',
        icon: CheckCircle,
        pulseColor: 'bg-green-500'
      },
      idle: {
        label: 'Idle',
        color: 'yellow',
        bgColor: theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-50',
        textColor: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700',
        borderColor: theme === 'dark' ? 'border-yellow-700' : 'border-yellow-200',
        icon: Clock,
        pulseColor: 'bg-yellow-500'
      },
      expired: {
        label: 'Expired',
        color: 'gray',
        bgColor: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50',
        textColor: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
        borderColor: theme === 'dark' ? 'border-gray-600' : 'border-gray-200',
        icon: XCircle,
        pulseColor: 'bg-gray-500'
      },
      terminated: {
        label: 'Terminated',
        color: 'red',
        bgColor: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50',
        textColor: theme === 'dark' ? 'text-red-400' : 'text-red-700',
        borderColor: theme === 'dark' ? 'border-red-700' : 'border-red-200',
        icon: XCircle,
        pulseColor: 'bg-red-500'
      }
    };
    return statusMap[status];
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getSessionDuration = (startedAt: Date): string => {
    const now = new Date();
    const diff = now.getTime() - startedAt.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTimeUntilExpiry = (expiresAt: Date): string => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    if (diff < 0) return 'Expired';
    if (hours > 24) return `${Math.floor(hours / 24)}d`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
  };

  const activeSessions = sessions.filter(s => s.status === 'active' || s.status === 'idle');
  const currentSession = sessions.find(s => s.isCurrent);
  const otherSessions = sessions.filter(s => !s.isCurrent);

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setShowDetails(true);
  };

  const handleTerminateSession = (sessionId: string) => {
    if (confirmTerminate === sessionId) {
      onTerminateSession?.(sessionId);
      setConfirmTerminate(null);
      setShowDetails(false);
    } else {
      setConfirmTerminate(sessionId);
      setTimeout(() => setConfirmTerminate(null), 3000);
    }
  };

  const handleTerminateAllOthers = () => {
    if (confirmTerminateAll) {
      if (onTerminateAllOthers) {
        onTerminateAllOthers();
      }
      setConfirmTerminateAll(false);
    } else {
      setConfirmTerminateAll(true);
      setTimeout(() => setConfirmTerminateAll(false), 3000);
    }
  };

  return (
    <div className={`min-h-screen pb-20 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className={`p-4 sm:p-6 text-white ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-purple-900 to-pink-900'
          : 'bg-gradient-to-r from-purple-600 to-pink-600'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Active Sessions</h1>
            <p className={`text-xs sm:text-sm ${
              theme === 'dark' ? 'text-purple-200' : 'text-purple-100'
            }`}>Monitor your login activity</p>
          </div>
          <button
            onClick={onRefreshSessions}
            className="p-2 sm:p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
            <div className="text-lg sm:text-2xl font-bold">{activeSessions.length}</div>
            <div className="text-xs text-purple-100">Active</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
            <div className="text-lg sm:text-2xl font-bold">{sessions.length}</div>
            <div className="text-xs text-purple-100">Total</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2 sm:p-3 backdrop-blur-sm">
            <div className="text-lg sm:text-2xl font-bold">{maxConcurrentSessions - activeSessions.length}</div>
            <div className="text-xs text-purple-100">Available</div>
          </div>
        </div>
      </div>

      {/* Warning if near limit */}
      {activeSessions.length >= maxConcurrentSessions - 1 && (
        <div className={`mx-3 sm:mx-4 mt-3 sm:mt-4 rounded-xl p-3 sm:p-4 border ${
          theme === 'dark'
            ? 'bg-amber-900/30 border-amber-700'
            : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${
              theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            }`} />
            <div className="flex-1">
              <p className={`font-semibold mb-1 text-xs sm:text-sm ${
                theme === 'dark' ? 'text-amber-300' : 'text-amber-900'
              }`}>Session Limit Warning</p>
              <p className={`text-xs sm:text-sm ${
                theme === 'dark' ? 'text-amber-400' : 'text-amber-800'
              }`}>
                You're using {activeSessions.length} of {maxConcurrentSessions} allowed concurrent sessions.
                Consider terminating old sessions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current Session */}
      {currentSession && (
        <div className="p-3 sm:p-4">
          <h2 className={`text-base sm:text-lg font-bold mb-2 sm:mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Current Session</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-3 sm:p-4 border-2 shadow-sm ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-700'
                : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
            }`}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              {/* Device Icon */}
              <div className={`p-2 sm:p-3 rounded-xl ${
                theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'
              }`}>
                {React.createElement(getDeviceIcon(currentSession.deviceType), {
                  className: `w-5 h-5 sm:w-6 sm:h-6 ${
                    theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                  }`
                })}
              </div>

              {/* Session Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm sm:text-base truncate mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {currentSession.deviceName}
                      <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                        This Device
                      </span>
                    </h3>
                    <div className={`flex items-center gap-2 text-xs sm:text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      <Chrome className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{currentSession.browser}</span>
                      <span>•</span>
                      <span className="hidden sm:inline">{currentSession.os}</span>
                      <span className="sm:hidden">{currentSession.os.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Live Indicator */}
                  <div className={`flex items-center gap-1.5 border px-2 sm:px-3 py-1 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-green-900/30 border-green-700'
                      : 'bg-green-100 border-green-200'
                  }`}>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className={`text-xs font-medium ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-700'
                    }`}>Live</span>
                  </div>
                </div>

                {/* Location & Time */}
                <div className={`flex flex-wrap items-center gap-2 sm:gap-3 text-xs mt-2 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{currentSession.location.city}, {currentSession.location.country}</span>
                  </div>
                  <span className="hidden sm:inline">•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{getSessionDuration(currentSession.startedAt)}</span>
                  </div>
                </div>

                {/* Security Badge */}
                {currentSession.isSecure && (
                  <div className={`mt-2 inline-flex items-center gap-1.5 border px-2 py-1 rounded ${
                    theme === 'dark'
                      ? 'bg-green-900/30 border-green-700'
                      : 'bg-green-100 border-green-200'
                  }`}>
                    <Shield className={`w-3 h-3 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <span className={`text-xs font-medium ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-700'
                    }`}>Secure Connection</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Other Sessions */}
      {otherSessions.length > 0 && (
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className={`text-base sm:text-lg font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Other Sessions</h2>
            {otherSessions.length > 0 && (
              <button
                onClick={handleTerminateAllOthers}
                className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-colors ${
                  confirmTerminateAll
                    ? 'bg-red-600 text-white'
                    : theme === 'dark'
                    ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                {confirmTerminateAll ? 'Confirm?' : 'End All'}
              </button>
            )}
          </div>

          <div className="space-y-2 sm:space-y-3">
            {otherSessions.map((session) => {
              const DeviceIcon = getDeviceIcon(session.deviceType);
              const statusInfo = getStatusInfo(session.status);
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-3 sm:p-4 shadow-sm border ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-200'
                  }`}
                  onClick={() => handleSessionClick(session)}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    {/* Device Icon */}
                    <div className={`p-2 sm:p-3 rounded-xl ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <DeviceIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                    </div>

                    {/* Session Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-sm sm:text-base truncate ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>
                            {session.deviceName}
                          </h3>
                          <div className={`flex items-center gap-2 text-xs sm:text-sm mt-1 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <Chrome className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{session.browser}</span>
                            <span>•</span>
                            <span className="hidden sm:inline">{session.os}</span>
                            <span className="sm:hidden">{session.os.split(' ')[0]}</span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border px-2 py-1 rounded-lg flex items-center gap-1.5 flex-shrink-0`}>
                          {session.status === 'active' && (
                            <div className={`w-2 h-2 ${statusInfo.pulseColor} rounded-full animate-pulse`} />
                          )}
                          <StatusIcon className={`w-3 h-3 ${statusInfo.textColor}`} />
                          <span className={`text-xs font-medium ${statusInfo.textColor} hidden sm:inline`}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>

                      {/* Location & Activity */}
                      <div className={`flex flex-wrap items-center gap-2 sm:gap-3 text-xs mt-2 ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{session.location.city}, {session.location.country}</span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          <span>{formatDate(session.lastActivity)}</span>
                        </div>
                      </div>

                      {/* Session Duration & Expiry */}
                      <div className={`flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        <div>Duration: {getSessionDuration(session.startedAt)}</div>
                        <span className={theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}>•</span>
                        <div>Expires in: {getTimeUntilExpiry(session.expiresAt)}</div>
                      </div>

                      {/* Terminate Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTerminateSession(session.id);
                        }}
                        className={`mt-3 w-full py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
                          confirmTerminate === session.id
                            ? 'bg-red-600 text-white'
                            : theme === 'dark'
                            ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {confirmTerminate === session.id ? 'Tap to Confirm' : 'End Session'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {otherSessions.length === 0 && currentSession && (
        <div className="p-3 sm:p-4">
          <div className={`rounded-xl p-6 sm:p-8 text-center border ${
            theme === 'dark'
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <Shield className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <p className={`font-medium mb-1 text-sm sm:text-base ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>Only one active session</p>
            <p className={`text-xs sm:text-sm ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              You're currently logged in from this device only
            </p>
          </div>
        </div>
      )}

      {/* Security Info */}
      <div className="p-3 sm:p-4">
        <div className={`rounded-xl p-3 sm:p-4 border ${
          theme === 'dark'
            ? 'bg-blue-900/30 border-blue-700'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start gap-2 sm:gap-3">
            <Info className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <div className="flex-1">
              <p className={`font-semibold mb-1 text-xs sm:text-sm ${
                theme === 'dark' ? 'text-blue-300' : 'text-blue-900'
              }`}>Session Security</p>
              <p className={`text-xs sm:text-sm mb-2 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-800'
              }`}>
                Sessions automatically expire after 24 hours of inactivity. Always terminate
                sessions from devices you no longer use or don't recognize.
              </p>
              <div className={`space-y-1 text-xs sm:text-sm ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-800'
              }`}>
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3" />
                  <span>Maximum {maxConcurrentSessions} concurrent sessions allowed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  <span>All sessions use encrypted connections</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Details Modal */}
      <AnimatePresence>
        {showDetails && selectedSession && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowDetails(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`fixed inset-x-0 bottom-0 rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="p-4 sm:p-6">
                {/* Handle */}
                <div className={`w-12 h-1 rounded-full mx-auto mb-4 sm:mb-6 ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                }`} />

                {/* Session Header */}
                <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className={`p-3 sm:p-4 rounded-2xl ${
                    theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'
                  }`}>
                    {React.createElement(getDeviceIcon(selectedSession.deviceType), {
                      className: `w-6 h-6 sm:w-8 sm:h-8 ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                      }`
                    })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className={`text-lg sm:text-xl font-bold mb-1 truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {selectedSession.deviceName}
                    </h2>
                    <div className={`${getStatusInfo(selectedSession.status).bgColor} ${getStatusInfo(selectedSession.status).borderColor} border inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg`}>
                      {React.createElement(getStatusInfo(selectedSession.status).icon, {
                        className: `w-3 h-3 sm:w-4 sm:h-4 ${getStatusInfo(selectedSession.status).textColor}`
                      })}
                      <span className={`text-xs sm:text-sm font-medium ${getStatusInfo(selectedSession.status).textColor}`}>
                        {getStatusInfo(selectedSession.status).label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Session Details */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className={`rounded-xl p-3 sm:p-4 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className={`font-semibold mb-3 text-sm sm:text-base ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Session Information</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Device Type</span>
                        <span className={`font-medium capitalize ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{selectedSession.deviceType}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Browser</span>
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{selectedSession.browser} {selectedSession.browserVersion}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Operating System</span>
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{selectedSession.os}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>IP Address</span>
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{selectedSession.location.ip}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`rounded-xl p-3 sm:p-4 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className={`font-semibold mb-3 text-sm sm:text-base ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>Location & Time</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Location</span>
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{selectedSession.location.city}, {selectedSession.location.country}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Started</span>
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{formatDate(selectedSession.startedAt)} at {formatTime(selectedSession.startedAt)}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Last Activity</span>
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{formatDate(selectedSession.lastActivity)}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Duration</span>
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{getSessionDuration(selectedSession.startedAt)}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Expires In</span>
                        <span className={`font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{getTimeUntilExpiry(selectedSession.expiresAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activities */}
                  {selectedSession.activities && selectedSession.activities.length > 0 && (
                    <div className={`rounded-xl p-3 sm:p-4 ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <h3 className={`font-semibold mb-3 text-sm sm:text-base ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>Recent Activity</h3>
                      <div className="space-y-2">
                        {selectedSession.activities.slice(0, 5).map((activity, index) => (
                          <div key={index} className="flex items-start gap-2 text-xs sm:text-sm">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className={`font-medium ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>{activity.action}</div>
                              <div className={`text-xs mt-0.5 ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                              }`}>
                                {formatDate(activity.timestamp)} at {formatTime(activity.timestamp)}
                              </div>
                              {activity.details && (
                                <div className={`text-xs mt-1 ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}>{activity.details}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {!selectedSession.isCurrent && (
                  <button
                    onClick={() => handleTerminateSession(selectedSession.id)}
                    className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-sm sm:text-base ${
                      confirmTerminate === selectedSession.id
                        ? 'bg-red-600 text-white'
                        : theme === 'dark'
                        ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    {confirmTerminate === selectedSession.id ? 'Tap Again to Confirm' : 'Terminate Session'}
                  </button>
                )}

                {selectedSession.isCurrent && (
                  <div className={`rounded-xl p-3 sm:p-4 border ${
                    theme === 'dark'
                      ? 'bg-purple-900/30 border-purple-700'
                      : 'bg-purple-50 border-purple-200'
                  }`}>
                    <div className="flex items-start gap-2 sm:gap-3">
                      <Eye className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 ${
                        theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                      }`} />
                      <div className="text-xs sm:text-sm">
                        <p className={`font-semibold mb-1 ${
                          theme === 'dark' ? 'text-purple-300' : 'text-purple-900'
                        }`}>Current Active Session</p>
                        <p className={theme === 'dark' ? 'text-purple-400' : 'text-purple-800'}>
                          This is your current session. You cannot terminate the session you're currently using.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SessionMonitor;
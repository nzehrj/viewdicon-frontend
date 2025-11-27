import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield,
  Eye,
  Smartphone,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lock,
  Activity,
  MapPin,
  Bell,
  Settings,
  ChevronRight,
  Award,
  Star,
  Zap
} from 'lucide-react';

import { useAppSelector } from '@store/hooks';

// Types
type SecurityLevel = 'high' | 'medium' | 'low';
type ThreatLevel = 'none' | 'low' | 'medium' | 'high';

interface SecurityMetrics {
  overallScore: number;
  securityLevel: SecurityLevel;
  threatLevel: ThreatLevel;
  lastSecurityCheck: string;
  protectionModesActive: number;
}

interface VerificationStatus {
  crest: number;
  shield: {
    level: number;
    maxLevel: number;
    status: 'active' | 'inactive' | 'warning';
  };
  honor: {
    stage: number;
    maxStage: number;
    title: string;
  };
}

interface RecentActivity {
  id: string;
  type: 'login' | 'transaction' | 'face_capture' | 'device_added' | 'alert';
  description: string;
  timestamp: string;
  location?: string;
  device?: string;
  status: 'success' | 'warning' | 'blocked';
}

interface TrustedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  lastUsed: string;
  location: string;
  isCurrentDevice: boolean;
}

interface SecurityDashboardProps {
  userId: string;
  metrics: SecurityMetrics;
  verificationStatus: VerificationStatus;
  recentActivity: RecentActivity[];
  trustedDevices: TrustedDevice[];
  emergencyContacts: number;
  activeSessions: number;
  protectionModeActive: boolean;
  onViewActivity: () => void;
  onManageDevices: () => void;
  onManageContacts: () => void;
  onViewSessions: () => void;
  onConfigureSecurity: () => void;
  onActivateProtection: () => void;
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({
  metrics,
  verificationStatus,
  recentActivity,
  trustedDevices,
  emergencyContacts,
  activeSessions,
  protectionModeActive,
  onViewActivity,
  onManageDevices,
  onManageContacts,
  onViewSessions,
  onConfigureSecurity,
  onActivateProtection
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [selectedTab, setSelectedTab] = useState<'overview' | 'activity' | 'devices'>('overview');

  const getSecurityLevelInfo = (level: SecurityLevel) => {
    const levels = {
      high: {
        color: 'green',
        bgColor: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50',
        textColor: theme === 'dark' ? 'text-green-400' : 'text-green-700',
        borderColor: theme === 'dark' ? 'border-green-700' : 'border-green-200',
        label: 'High Security',
        icon: Shield
      },
      medium: {
        color: 'yellow',
        bgColor: theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-50',
        textColor: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700',
        borderColor: theme === 'dark' ? 'border-yellow-700' : 'border-yellow-200',
        label: 'Medium Security',
        icon: AlertTriangle
      },
      low: {
        color: 'red',
        bgColor: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50',
        textColor: theme === 'dark' ? 'text-red-400' : 'text-red-700',
        borderColor: theme === 'dark' ? 'border-red-700' : 'border-red-200',
        label: 'Low Security',
        icon: AlertTriangle
      }
    };
    return levels[level];
  };

  const getThreatLevelColor = (threat: ThreatLevel) => {
    const colors = {
      none: theme === 'dark' ? 'text-green-400' : 'text-green-600',
      low: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
      medium: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
      high: theme === 'dark' ? 'text-red-400' : 'text-red-600'
    };
    return colors[threat];
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    const icons = {
      login: Lock,
      transaction: Activity,
      face_capture: Eye,
      device_added: Smartphone,
      alert: Bell
    };
    return icons[type];
  };

  const getActivityColor = (status: RecentActivity['status']) => {
    const colors = {
      success: { 
        bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-50',
        text: theme === 'dark' ? 'text-green-400' : 'text-green-700',
        icon: theme === 'dark' ? 'text-green-400' : 'text-green-600'
      },
      warning: { 
        bg: theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-50',
        text: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700',
        icon: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
      },
      blocked: { 
        bg: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50',
        text: theme === 'dark' ? 'text-red-400' : 'text-red-700',
        icon: theme === 'dark' ? 'text-red-400' : 'text-red-600'
      }
    };
    return colors[status];
  };

  const securityLevelInfo = getSecurityLevelInfo(metrics.securityLevel);
  const SecurityLevelIcon = securityLevelInfo.icon;

  return (
    <div className={`rounded-2xl shadow-lg overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Header */}
      <div className={`px-4 sm:px-6 py-3 sm:py-4 text-white ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-purple-900 to-purple-800'
          : 'bg-gradient-to-r from-purple-600 to-purple-700'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Ancestral Shield</h2>
            <p className={`text-xs sm:text-sm mt-1 ${
              theme === 'dark' ? 'text-purple-200' : 'text-purple-100'
            }`}>
              Your protection and security center
            </p>
          </div>
          <button
            onClick={onConfigureSecurity}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Security Score Hero */}
      <div className={`p-4 sm:p-6 border-b ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-800'
          : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <div className={`p-2 sm:p-3 ${securityLevelInfo.bgColor} rounded-xl`}>
                <SecurityLevelIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${securityLevelInfo.textColor}`} />
              </div>
              <div>
                <h3 className={`text-xl sm:text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{metrics.overallScore}/100</h3>
                <p className={`text-xs sm:text-sm font-semibold ${securityLevelInfo.textColor}`}>
                  {securityLevelInfo.label}
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className={`w-full rounded-full h-2 sm:h-3 overflow-hidden ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metrics.overallScore}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full bg-gradient-to-r ${
                  metrics.overallScore >= 80
                    ? 'from-green-500 to-green-600'
                    : metrics.overallScore >= 60
                    ? 'from-yellow-500 to-yellow-600'
                    : 'from-red-500 to-red-600'
                }`}
              />
            </div>

            <div className={`flex flex-wrap items-center justify-between mt-2 text-xs ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <span>Last check: {new Date(metrics.lastSecurityCheck).toLocaleDateString('en-NG')}</span>
              <span className={getThreatLevelColor(metrics.threatLevel)}>
                Threat: {metrics.threatLevel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <div className={`rounded-lg p-2 sm:p-3 text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              <p className={`text-lg sm:text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{verificationStatus.crest}</p>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Crest
            </p>
          </div>

          <div className={`rounded-lg p-2 sm:p-3 text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              <p className={`text-lg sm:text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{verificationStatus.shield.level}</p>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Shield
            </p>
          </div>

          <div className={`rounded-lg p-2 sm:p-3 text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
              <p className={`text-lg sm:text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{verificationStatus.honor.stage}</p>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Honor
            </p>
          </div>

          <div className={`rounded-lg p-2 sm:p-3 text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
              <p className={`text-lg sm:text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>{emergencyContacts}</p>
            </div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Circle
            </p>
          </div>
        </div>
      </div>

      {/* Protection Mode Alert */}
      {protectionModeActive && (
        <div className={`px-4 sm:px-6 py-3 sm:py-4 border-b ${
          theme === 'dark'
            ? 'bg-amber-900/30 border-amber-800'
            : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 ${
              theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            }`} />
            <div className="flex-1 min-w-0">
              <h4 className={`font-semibold mb-1 text-xs sm:text-sm ${
                theme === 'dark' ? 'text-amber-300' : 'text-amber-900'
              }`}>Protection Mode Active</h4>
              <p className={`text-xs sm:text-sm ${
                theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
              }`}>
                Your account is currently under enhanced protection. Some features may be restricted.
              </p>
            </div>
            <button
              onClick={onActivateProtection}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap"
            >
              Manage
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className={`border-b ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex">
          {[
            { id: 'overview' as const, label: 'Overview' },
            { id: 'activity' as const, label: 'Activity' },
            { id: 'devices' as const, label: 'Devices' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 font-medium transition-colors relative text-xs sm:text-sm ${
                selectedTab === tab.id
                  ? theme === 'dark'
                    ? 'text-purple-400 bg-gray-900'
                    : 'text-purple-600 bg-white'
                  : theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              {selectedTab === tab.id && (
                <motion.div
                  layoutId="activeSecurityTab"
                  className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                    theme === 'dark' ? 'bg-purple-400' : 'bg-purple-600'
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {selectedTab === 'overview' && (
          <div className="space-y-4">
            {/* Protection Features */}
            <div>
              <h3 className={`font-bold mb-3 text-sm sm:text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Active Protections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                <div
                  onClick={onManageDevices}
                  className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 hover:border-purple-500 hover:shadow-lg'
                      : 'bg-gray-50 border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-2 rounded-lg ${
                        theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
                      }`}>
                        <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className={`font-semibold text-xs sm:text-sm ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>Trusted Drums</h4>
                        <p className={`text-xs sm:text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>{trustedDevices.length} devices</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                  </div>
                </div>

                <div
                  onClick={onManageContacts}
                  className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 hover:border-purple-500 hover:shadow-lg'
                      : 'bg-gray-50 border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-2 rounded-lg ${
                        theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'
                      }`}>
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className={`font-semibold text-xs sm:text-sm ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>Inner Fire Circle</h4>
                        <p className={`text-xs sm:text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>{emergencyContacts} contacts</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                  </div>
                </div>

                <div
                  onClick={onViewSessions}
                  className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 hover:border-purple-500 hover:shadow-lg'
                      : 'bg-gray-50 border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-2 rounded-lg ${
                        theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'
                      }`}>
                        <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className={`font-semibold text-xs sm:text-sm ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>Active Sessions</h4>
                        <p className={`text-xs sm:text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>{activeSessions} active</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                  </div>
                </div>

                <div className={`p-3 sm:p-4 rounded-xl border ${
                  theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`p-2 rounded-lg ${
                      theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-100'
                    }`}>
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className={`font-semibold text-xs sm:text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>Watchful Eye</h4>
                      <p className={`text-xs sm:text-sm font-medium flex items-center gap-1 ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        Active
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Tiers */}
            <div className={`rounded-xl p-3 sm:p-4 border ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-800'
                : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200'
            }`}>
              <h3 className={`font-bold mb-3 flex items-center gap-2 text-sm sm:text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Verification Status
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {/* Crest */}
                <div className={`rounded-lg p-2.5 sm:p-3 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs sm:text-sm font-semibold ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Crest Level</span>
                    <span className="text-base sm:text-lg font-bold text-blue-600">
                      {verificationStatus.crest}/10
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${(verificationStatus.crest / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Shield */}
                <div className={`rounded-lg p-2.5 sm:p-3 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs sm:text-sm font-semibold ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Shield Protection</span>
                    <span className="text-base sm:text-lg font-bold text-green-600">
                      {verificationStatus.shield.level}/{verificationStatus.shield.maxLevel}
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 mb-1 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: `${(verificationStatus.shield.level / verificationStatus.shield.maxLevel) * 100}%` }}
                    />
                  </div>
                  <p className={`text-xs ${
                    verificationStatus.shield.status === 'active'
                      ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      : verificationStatus.shield.status === 'warning'
                      ? theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                      : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Status: {verificationStatus.shield.status.charAt(0).toUpperCase() + verificationStatus.shield.status.slice(1)}
                  </p>
                </div>

                {/* Honor */}
                <div className={`rounded-lg p-2.5 sm:p-3 ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs sm:text-sm font-semibold ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Honor Stage</span>
                    <span className="text-base sm:text-lg font-bold text-purple-600">
                      {verificationStatus.honor.stage}/{verificationStatus.honor.maxStage}
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 mb-2 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${(verificationStatus.honor.stage / verificationStatus.honor.maxStage) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-purple-600 font-medium">{verificationStatus.honor.title}</p>
                </div>
              </div>
            </div>

            {/* Security Tips */}
            <div className={`rounded-xl p-3 sm:p-4 border ${
              theme === 'dark'
                ? 'bg-blue-900/30 border-blue-700'
                : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start gap-2 sm:gap-3">
                <Zap className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <div>
                  <h4 className={`font-semibold mb-2 text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-blue-300' : 'text-blue-900'
                  }`}>Security Tips</h4>
                  <ul className={`space-y-1 text-xs sm:text-sm ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                  }`}>
                    <li>• Keep your Inner Fire Circle updated with trusted contacts</li>
                    <li>• Review your trusted devices regularly</li>
                    <li>• Enable face verification for large transactions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'activity' && (
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className={`font-bold text-sm sm:text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Recent Activity</h3>
              <button
                onClick={onViewActivity}
                className={`text-xs sm:text-sm font-medium flex items-center gap-1 ${
                  theme === 'dark'
                    ? 'text-purple-400 hover:text-purple-300'
                    : 'text-purple-600 hover:text-purple-700'
                }`}
              >
                View All
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>

            {recentActivity.length === 0 ? (
              <div className={`text-center py-8 sm:py-12 rounded-xl ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <Activity className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 ${
                  theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  No recent activity
                </p>
              </div>
            ) : (
              recentActivity.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type);
                const colorScheme = getActivityColor(activity.status);

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 sm:p-4 rounded-xl border ${colorScheme.bg} ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className={theme === 'dark' ? 'p-2 bg-gray-800 rounded-lg' : 'p-2 bg-white rounded-lg'}>
                        <ActivityIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${colorScheme.icon}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium mb-1 text-xs sm:text-sm ${colorScheme.text}`}>
                          {activity.description}
                        </p>
                        <div className={`flex flex-wrap items-center gap-2 sm:gap-3 text-xs ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(activity.timestamp).toLocaleString('en-NG', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {activity.location && (
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{activity.location}</span>
                            </span>
                          )}
                          {activity.device && (
                            <span className="flex items-center gap-1 truncate">
                              <Smartphone className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{activity.device}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {activity.status === 'success' && (
                          <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                          }`} />
                        )}
                        {activity.status === 'warning' && (
                          <AlertTriangle className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                          }`} />
                        )}
                        {activity.status === 'blocked' && (
                          <Lock className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            theme === 'dark' ? 'text-red-400' : 'text-red-600'
                          }`} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {selectedTab === 'devices' && (
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className={`font-bold text-sm sm:text-base ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Trusted Drums (Devices)</h3>
              <button
                onClick={onManageDevices}
                className={`text-xs sm:text-sm font-medium flex items-center gap-1 ${
                  theme === 'dark'
                    ? 'text-purple-400 hover:text-purple-300'
                    : 'text-purple-600 hover:text-purple-700'
                }`}
              >
                Manage
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>

            {trustedDevices.map((device) => (
              <div
                key={device.id}
                className={`p-3 sm:p-4 rounded-xl border-2 ${
                  device.isCurrentDevice
                    ? theme === 'dark'
                      ? 'border-purple-700 bg-purple-900/30'
                      : 'border-purple-300 bg-purple-50'
                    : theme === 'dark'
                    ? 'border-gray-700 bg-gray-700'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className={`p-2 rounded-lg ${
                    device.isCurrentDevice
                      ? theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'
                      : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                  }`}>
                    <Smartphone className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      device.isCurrentDevice
                        ? theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-semibold text-xs sm:text-sm truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{device.name}</h4>
                      {device.isCurrentDevice && (
                        <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full whitespace-nowrap">
                          Current
                        </span>
                      )}
                    </div>
                    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(device.lastUsed).toLocaleDateString('en-NG', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{device.location}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityDashboard;
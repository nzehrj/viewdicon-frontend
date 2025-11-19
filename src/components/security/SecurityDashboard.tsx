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
  //Unlock,
  Activity,
  MapPin,
  //TrendingUp,
  Bell,
  Settings,
  ChevronRight,
  Award,
  Star,
  Zap
} from 'lucide-react';

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
  const [selectedTab, setSelectedTab] = useState<'overview' | 'activity' | 'devices'>('overview');

  const getSecurityLevelInfo = (level: SecurityLevel) => {
    const levels = {
      high: {
        color: 'green',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200',
        label: 'High Security',
        icon: Shield
      },
      medium: {
        color: 'yellow',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-200',
        label: 'Medium Security',
        icon: AlertTriangle
      },
      low: {
        color: 'red',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        borderColor: 'border-red-200',
        label: 'Low Security',
        icon: AlertTriangle
      }
    };
    return levels[level];
  };

  const getThreatLevelColor = (threat: ThreatLevel) => {
    const colors = {
      none: 'text-green-600',
      low: 'text-blue-600',
      medium: 'text-yellow-600',
      high: 'text-red-600'
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
      success: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-600' },
      warning: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: 'text-yellow-600' },
      blocked: { bg: 'bg-red-50', text: 'text-red-700', icon: 'text-red-600' }
    };
    return colors[status];
  };

  const securityLevelInfo = getSecurityLevelInfo(metrics.securityLevel);
  const SecurityLevelIcon = securityLevelInfo.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Ancestral Shield</h2>
            <p className="text-sm text-purple-100 mt-1">
              Your protection and security center
            </p>
          </div>
          <button
            onClick={onConfigureSecurity}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Security Score Hero */}
      <div className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-b border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-3 ${securityLevelInfo.bgColor} rounded-xl`}>
                <SecurityLevelIcon className={`w-6 h-6 ${securityLevelInfo.textColor}`} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{metrics.overallScore}/100</h3>
                <p className={`text-sm font-semibold ${securityLevelInfo.textColor}`}>
                  {securityLevelInfo.label}
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
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

            <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
              <span>Last check: {new Date(metrics.lastSecurityCheck).toLocaleDateString('en-NG')}</span>
              <span className={getThreatLevelColor(metrics.threatLevel)}>
                Threat: {metrics.threatLevel.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="w-4 h-4 text-blue-600" />
              <p className="text-2xl font-bold text-gray-900">{verificationStatus.crest}</p>
            </div>
            <p className="text-xs text-gray-600">Crest</p>
          </div>

          <div className="bg-white rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Shield className="w-4 h-4 text-green-600" />
              <p className="text-2xl font-bold text-gray-900">{verificationStatus.shield.level}</p>
            </div>
            <p className="text-xs text-gray-600">Shield</p>
          </div>

          <div className="bg-white rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-purple-600" />
              <p className="text-2xl font-bold text-gray-900">{verificationStatus.honor.stage}</p>
            </div>
            <p className="text-xs text-gray-600">Honor</p>
          </div>

          <div className="bg-white rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-indigo-600" />
              <p className="text-2xl font-bold text-gray-900">{emergencyContacts}</p>
            </div>
            <p className="text-xs text-gray-600">Circle</p>
          </div>
        </div>
      </div>

      {/* Protection Mode Alert */}
      {protectionModeActive && (
        <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-amber-900 mb-1">Protection Mode Active</h4>
              <p className="text-sm text-amber-700">
                Your account is currently under enhanced protection. Some features may be restricted.
              </p>
            </div>
            <button
              onClick={onActivateProtection}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium text-sm transition-colors"
            >
              Manage
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex">
          {[
            { id: 'overview' as const, label: 'Overview' },
            { id: 'activity' as const, label: 'Activity' },
            { id: 'devices' as const, label: 'Devices' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 px-4 py-3 font-medium transition-colors relative ${
                selectedTab === tab.id
                  ? 'text-purple-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              {selectedTab === tab.id && (
                <motion.div
                  layoutId="activeSecurityTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {selectedTab === 'overview' && (
          <div className="space-y-4">
            {/* Protection Features */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Active Protections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div
                  onClick={onManageDevices}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Trusted Drums</h4>
                        <p className="text-sm text-gray-600">{trustedDevices.length} devices</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div
                  onClick={onManageContacts}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Inner Fire Circle</h4>
                        <p className="text-sm text-gray-600">{emergencyContacts} contacts</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div
                  onClick={onViewSessions}
                  className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Activity className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Active Sessions</h4>
                        <p className="text-sm text-gray-600">{activeSessions} active</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Eye className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Watchful Eye</h4>
                      <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Tiers */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Verification Status
              </h3>
              <div className="space-y-3">
                {/* Crest */}
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Crest Level</span>
                    <span className="text-lg font-bold text-blue-600">{verificationStatus.crest}/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${(verificationStatus.crest / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Shield */}
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Shield Protection</span>
                    <span className="text-lg font-bold text-green-600">
                      {verificationStatus.shield.level}/{verificationStatus.shield.maxLevel}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-full bg-green-600 rounded-full"
                      style={{ width: `${(verificationStatus.shield.level / verificationStatus.shield.maxLevel) * 100}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 ${
                    verificationStatus.shield.status === 'active'
                      ? 'text-green-600'
                      : verificationStatus.shield.status === 'warning'
                      ? 'text-yellow-600'
                      : 'text-gray-500'
                  }`}>
                    Status: {verificationStatus.shield.status.charAt(0).toUpperCase() + verificationStatus.shield.status.slice(1)}
                  </p>
                </div>

                {/* Honor */}
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Honor Stage</span>
                    <span className="text-lg font-bold text-purple-600">
                      {verificationStatus.honor.stage}/{verificationStatus.honor.maxStage}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
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
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Security Tips</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
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
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Recent Activity</h3>
              <button
                onClick={onViewActivity}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {recentActivity.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No recent activity</p>
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
                    className={`p-4 rounded-xl border ${colorScheme.bg} border-gray-200`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 bg-white rounded-lg`}>
                        <ActivityIcon className={`w-5 h-5 ${colorScheme.icon}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${colorScheme.text} mb-1`}>
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
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
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {activity.location}
                            </span>
                          )}
                          {activity.device && (
                            <span className="flex items-center gap-1">
                              <Smartphone className="w-3 h-3" />
                              {activity.device}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        {activity.status === 'success' && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        {activity.status === 'warning' && (
                          <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        )}
                        {activity.status === 'blocked' && (
                          <Lock className="w-5 h-5 text-red-600" />
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
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Trusted Drums (Devices)</h3>
              <button
                onClick={onManageDevices}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
              >
                Manage
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {trustedDevices.map((device) => (
              <div
                key={device.id}
                className={`p-4 rounded-xl border-2 ${
                  device.isCurrentDevice
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 ${device.isCurrentDevice ? 'bg-purple-100' : 'bg-gray-200'} rounded-lg`}>
                    <Smartphone className={`w-5 h-5 ${device.isCurrentDevice ? 'text-purple-600' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{device.name}</h4>
                      {device.isCurrentDevice && (
                        <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(device.lastUsed).toLocaleDateString('en-NG', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {device.location}
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
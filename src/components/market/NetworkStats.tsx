import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Target,
  //lendar,
  BarChart3,
  PieChart,
  Activity,
  Star,
  MessageCircle,
  Briefcase,
  ChevronRight,
  Info,
  Clock
} from 'lucide-react';

// Types
type TimeRange = '7d' | '30d' | '90d' | 'all';

interface NetworkMetrics {
  totalConnections: number;
  newConnectionsThisWeek: number;
  connectionGrowthRate: number;
  averageCrest: number;
  totalSessions: number;
  activeConnections: number;
  mutualConnectionRate: number;
}

interface VillageDistribution {
  village: string;
  count: number;
  percentage: number;
}

interface TierDistribution {
  tier: 'C1' | 'C2' | 'C3';
  count: number;
  percentage: number;
}

interface EngagementData {
  messagesExchanged: number;
  profileViews: number;
  sessionRequests: number;
  averageResponseTime: string;
}

interface GrowthData {
  period: string;
  connections: number;
  sessions: number;
}

interface NetworkStatsProps {
  userId: string;
  metrics: NetworkMetrics;
  villageDistribution: VillageDistribution[];
  tierDistribution: TierDistribution[];
  engagementData: EngagementData;
  growthData: GrowthData[];
  topConnections: {
    id: string;
    name: string;
    village: string;
    sessions: number;
    mutualConnections: number;
  }[];
}

const NetworkStats: React.FC<NetworkStatsProps> = ({
  metrics,
  villageDistribution,
  tierDistribution,
  engagementData,
  growthData,
  topConnections
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('30d');

  const getGrowthTrend = (rate: number) => {
    if (rate > 0) {
      return { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' };
    } else if (rate < 0) {
      return { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-100' };
    }
    return { icon: Activity, color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const getTierColor = (tier: 'C1' | 'C2' | 'C3') => {
    const colors = {
      C1: { bg: 'bg-blue-500', label: 'Continental African' },
      C2: { bg: 'bg-purple-500', label: 'African Diaspora' },
      C3: { bg: 'bg-green-500', label: 'Global Partner' }
    };
    return colors[tier];
  };

  const growthTrend = getGrowthTrend(metrics.connectionGrowthRate);
  const GrowthIcon = growthTrend.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Network Analytics</h2>
            <p className="text-sm text-indigo-100 mt-1">
              Track your professional network growth and engagement
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(['7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-white text-indigo-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {range === 'all' ? 'All Time' : range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Connections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className={`px-2 py-1 ${growthTrend.bg} rounded-full flex items-center gap-1`}>
                <GrowthIcon className={`w-3 h-3 ${growthTrend.color}`} />
                <span className={`text-xs font-semibold ${growthTrend.color}`}>
                  {metrics.connectionGrowthRate > 0 ? '+' : ''}{metrics.connectionGrowthRate}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Connections</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalConnections}</p>
            <p className="text-xs text-gray-500 mt-2">
              +{metrics.newConnectionsThisWeek} this week
            </p>
          </motion.div>

          {/* Active Connections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Active Connections</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.activeConnections}</p>
            <p className="text-xs text-gray-500 mt-2">
              {((metrics.activeConnections / metrics.totalConnections) * 100).toFixed(1)}% engagement rate
            </p>
          </motion.div>

          {/* Total Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalSessions}</p>
            <p className="text-xs text-gray-500 mt-2">
              Avg {(metrics.totalSessions / metrics.totalConnections).toFixed(1)} per connection
            </p>
          </motion.div>

          {/* Average Crest */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Network Avg Crest</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.averageCrest.toFixed(1)}</p>
            <p className="text-xs text-gray-500 mt-2">
              Quality network score
            </p>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Village Distribution */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-600" />
                Village Distribution
              </h3>
            </div>
            <div className="space-y-3">
              {villageDistribution.slice(0, 5).map((item, index) => (
                <div key={item.village} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.village}</span>
                    <span className="text-gray-600">{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="bg-indigo-600 h-full rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tier Distribution */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Kinship Tier Distribution
              </h3>
            </div>
            <div className="space-y-4">
              {tierDistribution.map((item, index) => {
                const tierColor = getTierColor(item.tier);
                return (
                  <div key={item.tier} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 ${tierColor.bg} rounded-full`} />
                        <span className="text-sm font-medium text-gray-700">
                          {item.tier} - {tierColor.label}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className={`${tierColor.bg} h-full rounded-full`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Network Growth
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span className="text-gray-600">Connections</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded" />
                <span className="text-gray-600">Sessions</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {growthData.map((data, index) => {
              const maxValue = Math.max(...growthData.map(d => Math.max(d.connections, d.sessions)));
              const connectionHeight = (data.connections / maxValue) * 100;
              const sessionHeight = (data.sessions / maxValue) * 100;

              return (
                <div key={data.period} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center gap-1 h-48">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${connectionHeight}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer relative group"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.connections} connections
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${sessionHeight}%` }}
                      transition={{ delay: index * 0.1 + 0.05, duration: 0.5 }}
                      className="flex-1 bg-purple-500 rounded-t hover:bg-purple-600 transition-colors cursor-pointer relative group"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {data.sessions} sessions
                      </div>
                    </motion.div>
                  </div>
                  <span className="text-xs text-gray-600">{data.period}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Messages</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{engagementData.messagesExchanged}</p>
            <p className="text-xs text-gray-500 mt-1">Total exchanged</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Profile Views</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{engagementData.profileViews}</p>
            <p className="text-xs text-gray-500 mt-1">From network</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Session Requests</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{engagementData.sessionRequests}</p>
            <p className="text-xs text-gray-500 mt-1">Sent & received</p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-gray-600">Response Time</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{engagementData.averageResponseTime}</p>
            <p className="text-xs text-gray-500 mt-1">Average</p>
          </div>
        </div>

        {/* Top Connections */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-indigo-600" />
              Top Connections
            </h3>
            <span className="text-sm text-gray-500">Most active partnerships</span>
          </div>
          <div className="space-y-3">
            {topConnections.map((connection, index) => (
              <div
                key={connection.id}
                className="bg-white rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{connection.name}</h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {connection.village}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {connection.mutualConnections} mutual
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">{connection.sessions}</p>
                  <p className="text-xs text-gray-500">sessions</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Health Score */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border-2 border-indigo-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Network Health Score
              </h3>
              <p className="text-sm text-gray-600">
                Based on connection quality, engagement, and growth
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-indigo-600">
                {Math.round((metrics.mutualConnectionRate * 100 + 
                  (metrics.activeConnections / metrics.totalConnections) * 100 + 
                  metrics.averageCrest * 10) / 3)}
              </p>
              <p className="text-sm text-gray-600">out of 100</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Connection Quality</p>
              <p className="text-lg font-bold text-gray-900">
                {metrics.averageCrest.toFixed(1)}/10
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Engagement Rate</p>
              <p className="text-lg font-bold text-gray-900">
                {((metrics.activeConnections / metrics.totalConnections) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Mutual Rate</p>
              <p className="text-lg font-bold text-gray-900">
                {(metrics.mutualConnectionRate * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Insights & Tips */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Network Insights</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>
                    Your network has grown by <strong>{metrics.newConnectionsThisWeek} connections</strong> this week
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>
                    <strong>{((metrics.activeConnections / metrics.totalConnections) * 100).toFixed(0)}%</strong> of your connections are actively engaged
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <span>
                    Your network's average Crest level is <strong>{metrics.averageCrest.toFixed(1)}</strong>, indicating high-quality connections
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStats;
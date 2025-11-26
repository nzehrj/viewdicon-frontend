import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Target,
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

import { useAppSelector } from '@store/hooks';

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
  const theme = useAppSelector((state) => state.theme.theme);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('30d');

  const getGrowthTrend = (rate: number) => {
    if (rate > 0) {
      return { icon: TrendingUp, color: theme === 'dark' ? 'text-green-400' : 'text-green-600', bg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100' };
    } else if (rate < 0) {
      return { icon: TrendingDown, color: theme === 'dark' ? 'text-red-400' : 'text-red-600', bg: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100' };
    }
    return { icon: Activity, color: theme === 'dark' ? 'text-gray-400' : 'text-gray-600', bg: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100' };
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
    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 sm:px-6 py-3 sm:py-4 text-white">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Network Analytics</h2>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1">
              Track your professional network growth and engagement
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
            {(['7d', '30d', '90d', 'all'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
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

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Total Connections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-xl p-3 sm:p-4 border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-blue-500 rounded-lg">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className={`px-2 py-1 ${growthTrend.bg} rounded-full flex items-center gap-1`}>
                <GrowthIcon className={`w-3 h-3 ${growthTrend.color}`} />
                <span className={`text-[10px] sm:text-xs font-semibold ${growthTrend.color}`}>
                  {metrics.connectionGrowthRate > 0 ? '+' : ''}{metrics.connectionGrowthRate}%
                </span>
              </div>
            </div>
            <p className={`text-xs sm:text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Connections</p>
            <p className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{metrics.totalConnections}</p>
            <p className={`text-[10px] sm:text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              +{metrics.newConnectionsThisWeek} this week
            </p>
          </motion.div>

          {/* Active Connections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-xl p-3 sm:p-4 border ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-800'
                : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-green-500 rounded-lg">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
            <p className={`text-xs sm:text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Active Connections</p>
            <p className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{metrics.activeConnections}</p>
            <p className={`text-[10px] sm:text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              {((metrics.activeConnections / metrics.totalConnections) * 100).toFixed(1)}% engagement rate
            </p>
          </motion.div>

          {/* Total Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-xl p-3 sm:p-4 border ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-800'
                : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-purple-500 rounded-lg">
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
            <p className={`text-xs sm:text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Total Sessions</p>
            <p className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{metrics.totalSessions}</p>
            <p className={`text-[10px] sm:text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Avg {(metrics.totalSessions / metrics.totalConnections).toFixed(1)} per connection
            </p>
          </motion.div>

          {/* Average Crest */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-xl p-3 sm:p-4 border ${
              theme === 'dark'
                ? 'bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 border-yellow-800'
                : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-yellow-500 rounded-lg">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </div>
            <p className={`text-xs sm:text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Network Avg Crest</p>
            <p className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{metrics.averageCrest.toFixed(1)}</p>
            <p className={`text-[10px] sm:text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Quality network score
            </p>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Village Distribution */}
          <div className={`rounded-xl p-4 sm:p-6 border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className={`font-bold text-sm sm:text-base flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                Village Distribution
              </h3>
            </div>
            <div className="space-y-3">
              {villageDistribution.slice(0, 5).map((item, index) => (
                <div key={item.village} className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{item.village}</span>
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className={`w-full rounded-full h-2 overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
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
          <div className={`rounded-xl p-4 sm:p-6 border ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className={`font-bold text-sm sm:text-base flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
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
                        <span className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.tier} - {tierColor.label}
                        </span>
                      </div>
                      <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className={`w-full rounded-full h-2 overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
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
        <div className={`rounded-xl p-4 sm:p-6 border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <h3 className={`font-bold text-sm sm:text-base flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              Network Growth
            </h3>
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Connections</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded" />
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Sessions</span>
              </div>
            </div>
          </div>
          <div className="h-48 sm:h-64 flex items-end justify-between gap-1 sm:gap-2 overflow-x-auto">
            {growthData.map((data, index) => {
              const maxValue = Math.max(...growthData.map(d => Math.max(d.connections, d.sessions)));
              const connectionHeight = (data.connections / maxValue) * 100;
              const sessionHeight = (data.sessions / maxValue) * 100;

              return (
                <div key={data.period} className="flex-1 flex flex-col items-center gap-2 min-w-[40px]">
                  <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-40 sm:h-48">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${connectionHeight}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer relative group"
                    >
                      <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-white text-[10px] sm:text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-900'
                      }`}>
                        {data.connections} connections
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${sessionHeight}%` }}
                      transition={{ delay: index * 0.1 + 0.05, duration: 0.5 }}
                      className="flex-1 bg-purple-500 rounded-t hover:bg-purple-600 transition-colors cursor-pointer relative group"
                    >
                      <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-white text-[10px] sm:text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-900'
                      }`}>
                        {data.sessions} sessions
                      </div>
                    </motion.div>
                  </div>
                  <span className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>{data.period}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className={`rounded-lg p-3 sm:p-4 border ${
            theme === 'dark'
              ? 'bg-blue-900/30 border-blue-800'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <MessageCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Messages</span>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{engagementData.messagesExchanged}</p>
            <p className={`text-[10px] sm:text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Total exchanged</p>
          </div>

          <div className={`rounded-lg p-3 sm:p-4 border ${
            theme === 'dark'
              ? 'bg-green-900/30 border-green-800'
              : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Users className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Profile Views</span>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{engagementData.profileViews}</p>
            <p className={`text-[10px] sm:text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>From network</p>
          </div>

          <div className={`rounded-lg p-3 sm:p-4 border ${
            theme === 'dark'
              ? 'bg-purple-900/30 border-purple-800'
              : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Briefcase className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Session Requests</span>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{engagementData.sessionRequests}</p>
            <p className={`text-[10px] sm:text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Sent & received</p>
          </div>

          <div className={`rounded-lg p-3 sm:p-4 border ${
            theme === 'dark'
              ? 'bg-yellow-900/30 border-yellow-800'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Response Time</span>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{engagementData.averageResponseTime}</p>
            <p className={`text-[10px] sm:text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Average</p>
          </div>
        </div>

        {/* Top Connections */}
        <div className={`rounded-xl p-4 sm:p-6 border ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
            <h3 className={`font-bold text-sm sm:text-base flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
              Top Connections
            </h3>
            <span className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Most active partnerships</span>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {topConnections.map((connection, index) => (
              <div
                key={connection.id}
                className={`rounded-lg p-3 sm:p-4 flex items-center justify-between hover:shadow-md transition-shadow ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold text-xs sm:text-sm ${
                    theme === 'dark' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    #{index + 1}
                  </div>
                  <div>
                    <h4 className={`font-semibold text-sm sm:text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{connection.name}</h4>
                    <div className={`flex items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
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
                  <p className="text-xl sm:text-2xl font-bold text-indigo-600">{connection.sessions}</p>
                  <p className={`text-[10px] sm:text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>sessions</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Health Score */}
        <div className={`rounded-xl p-4 sm:p-6 border-2 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-indigo-900/30 to-indigo-800/30 border-indigo-800'
            : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3 sm:mb-4">
            <div>
              <h3 className={`font-bold text-sm sm:text-base flex items-center gap-2 mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                Network Health Score
              </h3>
              <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Based on connection quality, engagement, and growth
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl sm:text-4xl font-bold text-indigo-600">
                {Math.round((metrics.mutualConnectionRate * 100 + 
                  (metrics.activeConnections / metrics.totalConnections) * 100 + 
                  metrics.averageCrest * 10) / 3)}
              </p>
              <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>out of 100</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className={`rounded-lg p-2 sm:p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <p className={`text-[10px] sm:text-xs mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Connection Quality</p>
              <p className={`text-base sm:text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {metrics.averageCrest.toFixed(1)}/10
              </p>
            </div>
            <div className={`rounded-lg p-2 sm:p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <p className={`text-[10px] sm:text-xs mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Engagement Rate</p>
              <p className={`text-base sm:text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {((metrics.activeConnections / metrics.totalConnections) * 100).toFixed(1)}%
              </p>
            </div>
            <div className={`rounded-lg p-2 sm:p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <p className={`text-[10px] sm:text-xs mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Mutual Rate</p>
              <p className={`text-base sm:text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {(metrics.mutualConnectionRate * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Insights & Tips */}
        <div className={`rounded-xl p-4 sm:p-6 border ${
          theme === 'dark'
            ? 'bg-blue-900/30 border-blue-800'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start gap-3">
            <Info className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <div className="flex-1">
              <h3 className={`font-bold text-sm sm:text-base mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Network Insights</h3>
              <ul className={`space-y-2 text-xs sm:text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                <li className="flex items-start gap-2">
                  <ChevronRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span>
                    Your network has grown by <strong>{metrics.newConnectionsThisWeek} connections</strong> this week
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span>
                    <strong>{((metrics.activeConnections / metrics.totalConnections) * 100).toFixed(0)}%</strong> of your connections are actively engaged
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 shrink-0 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
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
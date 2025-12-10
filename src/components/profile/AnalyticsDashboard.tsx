import React, { useState } from 'react';
import { 
  TrendingUp,
  Users,
  MessageSquare,
  Eye,
  Clock,
  Target,
  Award,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  RefreshCw,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

interface ChartDataPoint {
  label: string;
  value: number;
}

interface AnalyticsDashboardProps {
  userId?: string;
  timeRange?: '7d' | '30d' | '90d' | 'all';
  onTimeRangeChange?: (range: '7d' | '30d' | '90d' | 'all') => void;
  onExport?: () => void;
  onRefresh?: () => void;
}

/**
 * ANALYTICS DASHBOARD COMPONENT
 * 
 * Comprehensive usage insights and metrics dashboard
 * Features: Key metrics, charts, trends, and data export
 * Mobile-first responsive design with dark mode support
 * 
 * Location: src/components/profile/AnalyticsDashboard.tsx
 */
export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  timeRange = '30d',
  onTimeRangeChange,
  onExport,
  onRefresh,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [showTimeRangeMenu, setShowTimeRangeMenu] = useState(false);
  const [selectedChart, setSelectedChart] = useState<'bar' | 'line' | 'pie'>('bar');

  // Mock data - Replace with real data from your backend
  const metrics = {
    totalViews: { value: '12,458', change: 12.5, trend: 'up' as const },
    engagement: { value: '8,234', change: -3.2, trend: 'down' as const },
    connections: { value: '1,847', change: 18.7, trend: 'up' as const },
    avgTime: { value: '4m 32s', change: 5.3, trend: 'up' as const },
  };

  const weeklyData: ChartDataPoint[] = [
    { label: 'Mon', value: 1200 },
    { label: 'Tue', value: 1800 },
    { label: 'Wed', value: 1500 },
    { label: 'Thu', value: 2200 },
    { label: 'Fri', value: 2800 },
    { label: 'Sat', value: 1900 },
    { label: 'Sun', value: 1400 },
  ];

  const engagementData: ChartDataPoint[] = [
    { label: 'Profile Views', value: 35 },
    { label: 'Messages', value: 25 },
    { label: 'Posts', value: 20 },
    { label: 'Comments', value: 12 },
    { label: 'Shares', value: 8 },
  ];

  const handleTimeRangeChange = (range: '7d' | '30d' | '90d' | 'all') => {
    setSelectedTimeRange(range);
    setShowTimeRangeMenu(false);
    onTimeRangeChange?.(range);
  };

  const handleRefresh = () => {
    onRefresh?.();
    // Add refresh animation or loading state
  };

  const timeRangeLabels = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
    'all': 'All Time',
  };

  return (
    <div className={`max-w-4xl mx-auto ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header - Time Range & Actions Only */}
      <div className={`px-4 sm:px-6 py-4 border-b ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          {/* Time Range Selector */}
          <div className="relative">
            <button
              onClick={() => setShowTimeRangeMenu(!showTimeRangeMenu)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-medium">
                {timeRangeLabels[selectedTimeRange]}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Time Range Dropdown */}
            {showTimeRangeMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowTimeRangeMenu(false)}
                />
                <div className={`absolute top-full left-0 mt-2 w-48 rounded-lg shadow-lg z-50 overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  {(['7d', '30d', '90d', 'all'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => handleTimeRangeChange(range)}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        selectedTimeRange === range
                          ? theme === 'dark'
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-50 text-purple-600'
                          : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {timeRangeLabels[range]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={onExport}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title="Export data"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content - Fully Scrollable */}
      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <MetricCard
            title="Total Views"
            value={metrics.totalViews.value}
            change={metrics.totalViews.change}
            trend={metrics.totalViews.trend}
            icon={<Eye className="w-5 h-5" />}
            theme={theme}
          />
          <MetricCard
            title="Engagement"
            value={metrics.engagement.value}
            change={metrics.engagement.change}
            trend={metrics.engagement.trend}
            icon={<Activity className="w-5 h-5" />}
            theme={theme}
          />
          <MetricCard
            title="Connections"
            value={metrics.connections.value}
            change={metrics.connections.change}
            trend={metrics.connections.trend}
            icon={<Users className="w-5 h-5" />}
            theme={theme}
          />
          <MetricCard
            title="Avg. Time"
            value={metrics.avgTime.value}
            change={metrics.avgTime.change}
            trend={metrics.avgTime.trend}
            icon={<Clock className="w-5 h-5" />}
            theme={theme}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Weekly Activity Chart */}
          <div className={`p-4 sm:p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className={`text-base sm:text-lg font-semibold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Weekly Activity
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedChart('bar')}
                  className={`p-1.5 rounded transition-colors ${
                    selectedChart === 'bar'
                      ? 'bg-purple-600 text-white'
                      : theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedChart('pie')}
                  className={`p-1.5 rounded transition-colors ${
                    selectedChart === 'pie'
                      ? 'bg-purple-600 text-white'
                      : theme === 'dark'
                      ? 'text-gray-400 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <PieChart className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="space-y-3">
              {weeklyData.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {item.label}
                    </span>
                    <span className={`font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.value.toLocaleString()}
                    </span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${(item.value / 3000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Breakdown */}
          <div className={`p-4 sm:p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
          }`}>
            <h3 className={`text-base sm:text-lg font-semibold mb-4 sm:mb-6 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Engagement Breakdown
            </h3>

            <div className="space-y-4">
              {engagementData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: [
                          '#8b5cf6',
                          '#6366f1',
                          '#3b82f6',
                          '#06b6d4',
                          '#10b981',
                        ][index],
                      }}
                    />
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`flex-1 h-2 rounded-full overflow-hidden ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`} style={{ width: '100px' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.value}%`,
                          backgroundColor: [
                            '#8b5cf6',
                            '#6366f1',
                            '#3b82f6',
                            '#06b6d4',
                            '#10b981',
                          ][index],
                        }}
                      />
                    </div>
                    <span className={`text-sm font-medium w-12 text-right ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Content */}
        <div className={`p-4 sm:p-6 rounded-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className={`text-base sm:text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Top Performing Content
            </h3>
            <button className={`text-xs sm:text-sm font-medium ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>
              View All
            </button>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {[
              { title: 'Product Launch Announcement', views: 3542, engagement: 89 },
              { title: 'Industry Insights Report', views: 2891, engagement: 76 },
              { title: 'Team Success Story', views: 2456, engagement: 82 },
              { title: 'Technical Tutorial Series', views: 2103, engagement: 71 },
            ].map((content, index) => (
              <div
                key={index}
                className={`p-3 sm:p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className={`font-medium text-sm sm:text-base flex-1 pr-2 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {content.title}
                  </h4>
                  <div className="flex items-center gap-1 text-green-500 flex-shrink-0">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">{content.engagement}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <Eye className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {content.views.toLocaleString()} views
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className={`w-4 h-4 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {Math.floor(content.views * 0.15)} comments
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className={`p-4 sm:p-6 rounded-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Award className={`w-4 h-4 sm:w-5 sm:h-5 ${
              theme === 'dark' ? 'text-yellow-500' : 'text-yellow-600'
            }`} />
            <h3 className={`text-base sm:text-lg font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Recent Achievements
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              { title: 'First 1K Views', desc: 'Reached 1,000 profile views', icon: Target },
              { title: 'Engagement Pro', desc: '100+ interactions this week', icon: Activity },
              { title: 'Content Creator', desc: 'Published 10+ posts', icon: MessageSquare },
            ].map((achievement, index) => (
              <div
                key={index}
                className={`p-3 sm:p-4 rounded-lg border-2 ${
                  theme === 'dark'
                    ? 'bg-gray-700/30 border-yellow-500/20'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                    theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-100'
                  }`}>
                    <achievement.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      theme === 'dark' ? 'text-yellow-500' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-semibold mb-1 text-sm sm:text-base ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-xs sm:text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {achievement.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard: React.FC<MetricCardProps & { theme: 'light' | 'dark' }> = ({
  title,
  value,
  change,
  icon,
  trend,
  theme,
}) => {
  return (
    <div className={`p-4 sm:p-6 rounded-xl ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className={`p-1.5 sm:p-2 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <div className={theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}>
            {icon}
          </div>
        </div>
        <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${
          trend === 'up' ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend === 'up' ? (
            <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
          ) : (
            <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <div>
        <p className={`text-xs sm:text-sm mb-1 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {title}
        </p>
        <p className={`text-xl sm:text-2xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
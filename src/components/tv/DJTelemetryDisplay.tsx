// src/components/tv/DJTelemetryDisplay.tsx
// DJ Telemetry Display - Live Metrics Dashboard (Moderator Only)

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Phone, 
  Flame, 
  Coins, 
  Activity,
  Download,
  X,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface Metric {
  icon: typeof Users;
  label: string;
  value: string | number;
  trend: number; // percentage change
  color: string;
  unit?: string;
}

interface DJTelemetryDisplayProps {
  sessionId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DJTelemetryDisplay: React.FC<DJTelemetryDisplayProps> = ({
  sessionId,
  isOpen,
  onClose,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const telemetry = useAppSelector((state) => state.tv.sorosoke.telemetry);
  
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [streamHealth, setStreamHealth] = useState({
    bitrate: 0,
    fps: 0,
    latency: 0,
  });

  // Mock real-time updates (replace with WebSocket in production)
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      // Update metrics
      setMetrics([
        {
          icon: Users,
          label: 'Current Viewers',
          value: telemetry.viewerCount || Math.floor(Math.random() * 2000) + 500,
          trend: Math.random() * 20 - 10,
          color: '#8b5cf6',
        },
        {
          icon: TrendingUp,
          label: 'Peak Viewers',
          value: Math.floor((telemetry.viewerCount || 1000) * 1.5),
          trend: 5.2,
          color: '#10b981',
        },
        {
          icon: Users,
          label: 'Queue Length',
          value: telemetry.queueLength || Math.floor(Math.random() * 15),
          trend: -2.1,
          color: '#f59e0b',
        },
        {
          icon: Clock,
          label: 'Avg. Wait Time',
          value: `${Math.floor((telemetry.avgWaitTime || 120) / 60)}m`,
          trend: -8.3,
          color: '#3b82f6',
        },
        {
          icon: Phone,
          label: 'Total Calls Today',
          value: Math.floor(Math.random() * 50) + 20,
          trend: 12.4,
          color: '#ec4899',
        },
        {
          icon: Flame,
          label: 'Heat Generated',
          value: (telemetry.totalHeat || 0).toLocaleString(),
          trend: 15.7,
          color: '#ef4444',
        },
        {
          icon: Coins,
          label: 'Cowries Received',
          value: Math.floor(Math.random() * 10000) + 5000,
          trend: 8.9,
          color: '#eab308',
          unit: '₵',
        },
        {
          icon: Activity,
          label: 'Stream Health',
          value: 'Excellent',
          trend: 0,
          color: '#22c55e',
        },
      ]);

      // Update stream health
      setStreamHealth({
        bitrate: 3500 + Math.random() * 500,
        fps: 59 + Math.random() * 2,
        latency: 50 + Math.random() * 30,
      });
    }, 1000); // Update every 1 second

    return () => clearInterval(interval);
  }, [isOpen, telemetry]);

  const exportToCSV = () => {
    const csvData = metrics.map(m => `${m.label},${m.value},${m.trend}%`).join('\n');
    const blob = new Blob([`Metric,Value,Trend\n${csvData}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry-${sessionId}-${Date.now()}.csv`;
    a.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-4 pb-20 md:pb-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        } shadow-2xl`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-6 border-b ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              DJ Telemetry Dashboard
            </h2>
            <p className={`text-sm mt-1 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Live session metrics • Updates every second
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const isPositiveTrend = metric.trend > 0;

              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border ${
                    theme === 'dark' ? 'bg-gray-800/50 border-gray-800' : 'bg-white border-gray-200'
                  } shadow-lg`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${metric.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: metric.color }} />
                    </div>
                    {metric.trend !== 0 && (
                      <div className={`flex items-center gap-1 text-xs font-semibold ${
                        isPositiveTrend ? 'text-green-500' : 'text-red-500'
                      }`}>
                        <TrendingUp 
                          className="w-3 h-3" 
                          style={{ 
                            transform: isPositiveTrend ? 'rotate(0deg)' : 'rotate(180deg)' 
                          }} 
                        />
                        {Math.abs(metric.trend).toFixed(1)}%
                      </div>
                    )}
                  </div>

                  {/* Value */}
                  <div className="mb-1">
                    <p className={`text-3xl font-bold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {metric.value}{metric.unit || ''}
                    </p>
                  </div>

                  {/* Label */}
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {metric.label}
                  </p>

                  {/* Mini Sparkline (simulated) */}
                  <div className="mt-3 h-8 flex items-end gap-0.5">
                    {Array.from({ length: 12 }, (_, i) => {
                      const height = 20 + Math.random() * 80;
                      return (
                        <motion.div
                          key={i}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex-1 rounded-t"
                          style={{
                            height: `${height}%`,
                            backgroundColor: `${metric.color}40`,
                          }}
                        />
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Stream Health Details */}
          <div className={`p-6 rounded-xl border ${
            theme === 'dark' ? 'bg-gray-800/50 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Stream Health Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
              }`}>
                <p className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Bitrate
                </p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {streamHealth.bitrate.toFixed(0)} kbps
                </p>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{ width: `${(streamHealth.bitrate / 5000) * 100}%` }}
                  />
                </div>
              </div>

              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
              }`}>
                <p className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Frame Rate
                </p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {streamHealth.fps.toFixed(1)} fps
                </p>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${(streamHealth.fps / 60) * 100}%` }}
                  />
                </div>
              </div>

              <div className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
              }`}>
                <p className={`text-sm mb-1 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Latency
                </p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {streamHealth.latency.toFixed(0)} ms
                </p>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      streamHealth.latency < 100 ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${Math.min((streamHealth.latency / 200) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DJTelemetryDisplay;
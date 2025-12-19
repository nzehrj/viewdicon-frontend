// src/components/tv/LiveIndicator.tsx
// Live Indicator Badge

import React from 'react';
import { Users } from 'lucide-react';

interface LiveIndicatorProps {
  viewerCount: number;
  compact?: boolean;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  viewerCount,
  compact = false,
}) => {
  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-red-600 px-2 py-1 rounded-full">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white text-xs font-bold">LIVE</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full text-white text-xs">
          <Users className="w-3 h-3" />
          {formatCount(viewerCount)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
      <div className="flex items-center gap-2">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
        </span>
        <span className="text-white font-bold text-sm">LIVE</span>
      </div>
      <div className="h-4 w-px bg-white/30" />
      <div className="flex items-center gap-2 text-white">
        <Users className="w-4 h-4" />
        <span className="font-semibold text-sm">{formatCount(viewerCount)}</span>
      </div>
    </div>
  );
};

export default LiveIndicator;
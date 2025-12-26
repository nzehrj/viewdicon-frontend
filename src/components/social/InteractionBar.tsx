// src/components/social/InteractionBar.tsx
// Main Interaction Bar - African Social Engagement

import React from 'react';
import { MessageCircle, Share2, Bookmark } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { PotButton } from '@/components/common/PotButton';
import type { PotStatus } from '@/types/feed.types';

interface InteractionBarProps {
  postId: string;
  potStatus: PotStatus;
  echoCount: number;
  drumCount: number;
  hasUserStirred?: boolean;
  hasUserEchoed?: boolean;
  hasUserDrummed?: boolean;
  hasUserBasket?: boolean;
  onPot: () => Promise<void>;
  onEcho: () => void;
  onDrum: () => void;
  onBasket: () => void;
  showLabels?: boolean;
  compact?: boolean;
}

export const InteractionBar: React.FC<InteractionBarProps> = ({
  potStatus,
  echoCount,
  drumCount,
  hasUserStirred = false,
  hasUserEchoed = false,
  hasUserDrummed = false,
  hasUserBasket = false,
  onPot,
  onEcho,
  onDrum,
  onBasket,
  showLabels = true,
  compact = false,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);

  const buttonSize = compact ? 'sm' : 'md';
  const iconSize = compact ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-3 sm:gap-4'}`}>
      {/* Pot Button */}
      <PotButton
        potStatus={potStatus}
        hasUserStirred={hasUserStirred}
        onPot={onPot}
        size={buttonSize}
        showLabel={showLabels && !compact}
      />

      {/* Echo (Comment) Button */}
      <button
        onClick={onEcho}
        className={`
          flex items-center ${compact ? 'gap-1' : 'gap-2'} ${compact ? 'px-2 py-1.5' : 'px-3 sm:px-4 py-2'} rounded-xl transition-all
          ${hasUserEchoed
            ? 'bg-blue-500/20 text-blue-500'
            : theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400 hover:text-blue-400'
              : 'hover:bg-blue-50 text-gray-600 hover:text-blue-600'
          }
        `}
      >
        <MessageCircle className={`${iconSize} ${hasUserEchoed ? 'fill-current' : ''}`} />
        {showLabels && !compact && (
          <span className="text-sm font-semibold hidden sm:inline">
            Echo
          </span>
        )}
        <span className={`text-xs ${compact ? 'font-medium' : 'font-semibold'} ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        }`}>
          {echoCount}
        </span>
      </button>

      {/* Drum (Share) Button */}
      <button
        onClick={onDrum}
        className={`
          flex items-center ${compact ? 'gap-1' : 'gap-2'} ${compact ? 'px-2 py-1.5' : 'px-3 sm:px-4 py-2'} rounded-xl transition-all
          ${hasUserDrummed
            ? 'bg-green-500/20 text-green-500'
            : theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400 hover:text-green-400'
              : 'hover:bg-green-50 text-gray-600 hover:text-green-600'
          }
        `}
      >
        <Share2 className={`${iconSize} ${hasUserDrummed ? 'fill-current' : ''}`} />
        {showLabels && !compact && (
          <span className="text-sm font-semibold hidden sm:inline">
            Drum
          </span>
        )}
        <span className={`text-xs ${compact ? 'font-medium' : 'font-semibold'} ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
        }`}>
          {drumCount}
        </span>
      </button>

      {/* Basket (Bookmark) Button */}
      <button
        onClick={onBasket}
        className={`
          ${compact ? 'p-1.5' : 'p-2'} rounded-xl transition-all
          ${hasUserBasket
            ? 'bg-amber-500/20 text-amber-500'
            : theme === 'dark'
              ? 'hover:bg-gray-700 text-gray-400 hover:text-amber-400'
              : 'hover:bg-amber-50 text-gray-600 hover:text-amber-600'
          }
        `}
        title="Keep in Basket"
      >
        <Bookmark className={`${iconSize} ${hasUserBasket ? 'fill-current' : ''}`} />
      </button>
    </div>
  );
};

export default InteractionBar;
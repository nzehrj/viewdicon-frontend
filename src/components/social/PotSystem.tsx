// src/components/social/PotSystem.tsx
// Pot System - Main Engagement Orchestration Component

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';
import { InteractionBar } from './InteractionBar';
import { HeatIndicator } from './HeatIndicator';
import { DrumRing } from './DrumRing';
import { ThreadViewer } from './ThreadViewer';
import { BlessingGlow } from './BlessingGlow';
import type { FeedPost } from '@/types/feed.types';

interface PotSystemProps {
  post: FeedPost;
  onPot: () => Promise<void>;
  onEcho: (content: string, parentId?: string) => Promise<void>;
  onDrum: () => void;
  onBasket: () => void;
  hasUserStirred?: boolean;
  hasUserEchoed?: boolean;
  hasUserDrummed?: boolean;
  hasUserBasket?: boolean;
  showHeatIndicator?: boolean;
  compact?: boolean;
}

export const PotSystem: React.FC<PotSystemProps> = ({
  post,
  onPot,
  onEcho,
  onDrum,
  onBasket,
  hasUserStirred = false,
  hasUserEchoed = false,
  hasUserDrummed = false,
  hasUserBasket = false,
  showHeatIndicator = true,
  compact = false,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [showEchoModal, setShowEchoModal] = useState(false);
  const [showDrumModal, setShowDrumModal] = useState(false);
  const [showThreadViewer, setShowThreadViewer] = useState(false);
  const [showBlessing, setShowBlessing] = useState(false);
  const [echoContent, setEchoContent] = useState('');

  const handlePot = async () => {
    await onPot();
    // Trigger blessing glow effect
    if (post.pot_status.heat_level === 'ready' || post.pot_status.heat_level === 'boiling') {
      setShowBlessing(true);
    }
  };

  const handleEchoClick = () => {
    if (post.comment_count > 0) {
      setShowThreadViewer(true);
    } else {
      setShowEchoModal(true);
    }
  };

  const handleDrumClick = () => {
    setShowDrumModal(true);
  };

  const handleEchoSubmit = async () => {
    if (!echoContent.trim()) return;
    await onEcho(echoContent);
    setEchoContent('');
    setShowEchoModal(false);
  };

  const handleHeartEcho = (echoId: string) => {
    console.log('Heart echo:', echoId);
    // TODO: Implement heart echo API call
  };

  const handleDrumToVillage = (villageId: string) => {
    console.log('Drum to village:', villageId);
    onDrum();
    setShowDrumModal(false);
  };

  const handleDrumToFeed = (feedType: string) => {
    console.log('Drum to feed:', feedType);
    onDrum();
    setShowDrumModal(false);
  };

  const handleCopyLink = () => {
    console.log('Link copied');
    setShowDrumModal(false);
  };

  return (
    <div className="relative">
      {/* Blessing Glow Effect */}
      <BlessingGlow
        trigger={showBlessing}
        onComplete={() => setShowBlessing(false)}
        intensity={post.pot_status.heat_level === 'ready' ? 'high' : 'medium'}
      />

      {/* Heat Indicator */}
      {showHeatIndicator && !compact && (
        <div className="mb-3">
          <HeatIndicator
            heatLevel={post.pot_status.heat_level}
            heatScore={post.pot_status.heat_score}
            totalPots={post.pot_status.total_pots}
            animated={true}
            showLabel={false}
            size="md"
          />
        </div>
      )}

      {/* Main Interaction Bar */}
      <InteractionBar
        postId={post.post_id}
        potStatus={post.pot_status}
        echoCount={post.comment_count}
        drumCount={post.share_count}
        hasUserStirred={hasUserStirred}
        hasUserEchoed={hasUserEchoed}
        hasUserDrummed={hasUserDrummed}
        hasUserBasket={hasUserBasket}
        onPot={handlePot}
        onEcho={handleEchoClick}
        onDrum={handleDrumClick}
        onBasket={onBasket}
        showLabels={!compact}
        compact={compact}
      />

      {/* Echo Modal (Simple) */}
      <AnimatePresence>
        {showEchoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowEchoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`
                w-full max-w-md rounded-2xl p-6
                ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
              `}
            >
              <h3 className={`text-lg font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Add Your Echo
              </h3>
              <textarea
                value={echoContent}
                onChange={(e) => setEchoContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                className={`
                  w-full px-4 py-3 rounded-xl text-sm resize-none mb-4
                  ${theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                  }
                  border-2 focus:outline-none focus:border-purple-500 transition-colors
                `}
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEchoModal(false);
                    setEchoContent('');
                  }}
                  className={`
                    flex-1 py-3 rounded-xl font-semibold transition-colors
                    ${theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    }
                  `}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEchoSubmit}
                  disabled={!echoContent.trim()}
                  className="
                    flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600
                    hover:from-purple-700 hover:to-pink-700 text-white rounded-xl
                    font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  Echo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drum Modal */}
      <AnimatePresence>
        {showDrumModal && (
          <DrumRing
            postId={post.post_id}
            postUrl={`https://viewdicon.com/post/${post.post_id}`}
            onDrumToVillage={handleDrumToVillage}
            onDrumToFeed={handleDrumToFeed}
            onCopyLink={handleCopyLink}
            onClose={() => setShowDrumModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Thread Viewer */}
      <AnimatePresence>
        {showThreadViewer && (
          <ThreadViewer
            post={post}
            onClose={() => setShowThreadViewer(false)}
            onAddEcho={onEcho}
            onHeartEcho={handleHeartEcho}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PotSystem;
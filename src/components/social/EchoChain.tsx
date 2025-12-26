// src/components/social/EchoChain.tsx
// Echo Chain - African-themed Comment/Thread System with Bottom Sheet

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, ChevronDown, ChevronUp, MoreVertical, X } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface Echo {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  hearts: number;
  hasUserHearted: boolean;
  replies: Echo[];
  createdAt: Date;
}

interface EchoChainProps {
  postId: string;
  postTitle?: string; // For header display
  echoCount?: number; // Total echo count - defaults to echoes.length
  echoes: Echo[];
  onAddEcho: (content: string, parentId?: string) => Promise<void>;
  onHeartEcho: (echoId: string) => void;
  onClose?: () => void; // If provided, renders as bottom sheet modal
}

export const EchoChain: React.FC<EchoChainProps> = ({
  postId: _postId,
  postTitle: _postTitle,
  echoCount,
  echoes,
  onAddEcho,
  onHeartEcho,
  onClose,
}) => {
  const [newEchoContent, setNewEchoContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);
  
  // Use provided echoCount or default to echoes.length
  const displayEchoCount = echoCount ?? echoes.length;
  
  // Determine if we should render as modal (bottom sheet) or embedded
  const isModal = !!onClose;

  const handleSubmitEcho = async () => {
    if (!newEchoContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddEcho(newEchoContent, replyingTo || undefined);
      setNewEchoContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to add echo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleReplies = (echoId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(echoId)) {
      newExpanded.delete(echoId);
    } else {
      newExpanded.add(echoId);
    }
    setExpandedReplies(newExpanded);
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const EchoItem: React.FC<{ echo: Echo; depth: number }> = ({ echo, depth }) => {
    const hasReplies = echo.replies && echo.replies.length > 0;
    const isExpanded = expandedReplies.has(echo.id);
    const isReplying = replyingTo === echo.id;

    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={`${depth > 0 ? 'ml-8 sm:ml-12 border-l-2 border-purple-500/30 pl-4' : ''} mb-4`}
      >
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {echo.userName.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className={`font-semibold text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {echo.userName}
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  {formatTimestamp(echo.createdAt)}
                </p>
              </div>

              <button className={`p-1 rounded-lg transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}>
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <p className={`text-sm mb-2 leading-relaxed ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {echo.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => onHeartEcho(echo.id)}
                className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors"
              >
                <Heart className={`w-3 h-3 ${echo.hasUserHearted ? 'fill-current text-red-500' : ''}`} />
                {echo.hearts > 0 && echo.hearts}
              </button>

              <button
                onClick={() => setReplyingTo(isReplying ? null : echo.id)}
                className={`text-xs transition-colors ${
                  theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Reply
              </button>

              {hasReplies && (
                <button
                  onClick={() => toggleReplies(echo.id)}
                  className={`text-xs flex items-center gap-1 transition-colors ${
                    theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
                  }`}
                >
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {echo.replies.length} {echo.replies.length === 1 ? 'reply' : 'replies'}
                </button>
              )}
            </div>

            {/* Reply Form */}
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}
              >
                <textarea
                  value={newEchoContent}
                  onChange={(e) => setNewEchoContent(e.target.value)}
                  placeholder={`Reply to ${echo.userName}...`}
                  rows={2}
                  className={`
                    w-full px-3 py-2 rounded-lg text-sm resize-none
                    ${theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                    }
                    border-2 focus:outline-none focus:border-purple-500 transition-colors
                  `}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setReplyingTo(null)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors
                      ${theme === 'dark'
                        ? 'bg-gray-800 hover:bg-gray-700 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                      }
                    `}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitEcho}
                    disabled={!newEchoContent.trim() || isSubmitting}
                    className="
                      px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600
                      hover:from-purple-700 hover:to-pink-700 text-white rounded-lg
                      text-sm font-semibold transition-all disabled:opacity-50
                    "
                  >
                    Reply
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Nested Replies */}
        {hasReplies && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2"
          >
            {echo.replies.map((reply) => (
              <EchoItem key={reply.id} echo={reply} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </motion.div>
    );
  };

  // If not a modal (no onClose), render as embedded component
  if (!isModal) {
    return (
      <div>
        {/* Echoes List */}
        <div className="space-y-4">
          <AnimatePresence>
            {echoes.map((echo) => (
              <EchoItem key={echo.id} echo={echo} depth={0} />
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {echoes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <MessageCircle className={`w-12 h-12 mb-3 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                No echoes yet. Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>
        
        {/* Input Section */}
        {!replyingTo && (
          <div className={`mt-6 pt-4 border-t ${
            theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                Y
              </div>
              
              {/* Input Field */}
              <div className={`flex-1 flex items-center gap-2 rounded-full px-4 py-2 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <input
                  type="text"
                  placeholder="Add an echo..."
                  value={newEchoContent}
                  onChange={(e) => setNewEchoContent(e.target.value)}
                  className={`flex-1 bg-transparent text-sm focus:outline-none ${
                    theme === 'dark' 
                      ? 'text-white placeholder-gray-500' 
                      : 'text-gray-900 placeholder-gray-400'
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitEcho();
                    }
                  }}
                />
                
                {/* Send Button */}
                <button 
                  onClick={handleSubmitEcho}
                  disabled={!newEchoContent.trim() || isSubmitting}
                  className="text-purple-500 hover:text-purple-400 font-bold text-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </div>
              
              {/* Emoji Button */}
              <button className={`text-xl transition-colors ${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                😊
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render as bottom sheet modal
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
      />
      
      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className={`fixed bottom-0 left-0 right-0 z-[60] rounded-t-3xl shadow-2xl flex flex-col ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}
        style={{ 
          maxHeight: '85vh',
          height: '85vh'
        }}
      >
        {/* Handle Bar */}
        <div className="flex-shrink-0 pt-3 pb-2">
          <div className={`w-12 h-1.5 rounded-full mx-auto ${
            theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
          }`} />
        </div>
        
        {/* Header */}
        <div className={`flex-shrink-0 px-4 py-3 border-b ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`font-bold text-lg ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {displayEchoCount} Echoes
            </h3>
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Echoes List - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <AnimatePresence>
            {echoes.map((echo) => (
              <EchoItem key={echo.id} echo={echo} depth={0} />
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {echoes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <MessageCircle className={`w-12 h-12 mb-3 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                No echoes yet. Be the first to share your thoughts!
              </p>
            </div>
          )}
        </div>
        
        {/* Input Section - Fixed at Bottom */}
        {!replyingTo && (
          <div className={`flex-shrink-0 border-t ${
            theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
          }`} style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0px)' }}>
            <div className="px-4 py-3 flex items-center gap-3">
              {/* User Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                Y
              </div>
              
              {/* Input Field */}
              <div className={`flex-1 flex items-center gap-2 rounded-full px-4 py-2 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <input
                  type="text"
                  placeholder="Add an echo..."
                  value={newEchoContent}
                  onChange={(e) => setNewEchoContent(e.target.value)}
                  className={`flex-1 bg-transparent text-sm focus:outline-none ${
                    theme === 'dark' 
                      ? 'text-white placeholder-gray-500' 
                      : 'text-gray-900 placeholder-gray-400'
                  }`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitEcho();
                    }
                  }}
                />
                
                {/* Send Button */}
                <button 
                  onClick={handleSubmitEcho}
                  disabled={!newEchoContent.trim() || isSubmitting}
                  className="text-purple-500 hover:text-purple-400 font-bold text-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </div>
              
              {/* Emoji Button */}
              <button className={`text-xl transition-colors ${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>
                😊
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default EchoChain;
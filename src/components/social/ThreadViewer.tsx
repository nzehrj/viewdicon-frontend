// src/components/social/ThreadViewer.tsx
// Thread Viewer - Full Conversation Display

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, ArrowLeft, Users } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { EchoChain } from './EchoChain';
import type { FeedPost } from '@/types/feed.types';

interface ThreadViewerProps {
  post: FeedPost;
  onClose: () => void;
  onAddEcho: (content: string, parentId?: string) => Promise<void>;
  onHeartEcho: (echoId: string) => void;
}

export const ThreadViewer: React.FC<ThreadViewerProps> = ({
  post,
  onClose,
  onAddEcho,
  onHeartEcho,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [showFullPost, setShowFullPost] = useState(true);

  // Mock echoes data - Replace with actual data from API
  const echoes = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Kwame Asante',
      content: 'This is amazing! Love the cultural approach 🔥',
      hearts: 12,
      hasUserHearted: false,
      replies: [
        {
          id: '1-1',
          userId: 'user2',
          userName: 'Amara Okafor',
          content: 'Agreed! This is what we need more of',
          hearts: 5,
          hasUserHearted: false,
          replies: [],
          createdAt: new Date(Date.now() - 30 * 60 * 1000),
        },
      ],
      createdAt: new Date(Date.now() - 60 * 60 * 1000),
    },
    {
      id: '2',
      userId: 'user3',
      userName: 'Zawadi Mwangi',
      content: 'Ubuntu at its finest! 👏',
      hearts: 8,
      hasUserHearted: true,
      replies: [],
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full h-full sm:h-[90vh] sm:max-w-3xl sm:rounded-2xl overflow-hidden shadow-2xl
          ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
        `}
      >
        {/* Header */}
        <div className={`
          sticky top-0 z-10 p-4 border-b flex items-center justify-between
          ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}
        `}>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className={`font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Thread
              </h3>
              <p className={`text-xs ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
              }`}>
                {post.author_display_name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="h-[calc(100%-64px)] overflow-y-auto">
          {/* Original Post */}
          <AnimatePresence>
            {showFullPost && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-4 border-b ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                    {post.author_display_name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {post.author_display_name}
                      </p>
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        @{post.author_handle.replace('@', '')}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {post.author_village_role}
                    </p>
                  </div>
                </div>

                <p className={`text-base leading-relaxed mb-3 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {post.content}
                </p>

                {post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-sm font-semibold text-green-600 dark:text-green-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className={`flex items-center gap-4 text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comment_count} echoes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{post.pot_status.total_pots} stirs</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowFullPost(false)}
                  className="mt-3 text-xs text-blue-600 hover:underline"
                >
                  Hide original post
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!showFullPost && (
            <button
              onClick={() => setShowFullPost(true)}
              className={`w-full p-3 text-sm font-semibold text-left transition-colors ${
                theme === 'dark'
                  ? 'hover:bg-gray-800 text-blue-400'
                  : 'hover:bg-gray-50 text-blue-600'
              }`}
            >
              Show original post
            </button>
          )}

          {/* Echo Chain */}
          <div className="p-4">
            <EchoChain
              postId={post.post_id}
              echoes={echoes}
              onAddEcho={onAddEcho}
              onHeartEcho={onHeartEcho}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ThreadViewer;
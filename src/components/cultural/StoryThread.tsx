// src/components/cultural/StoryThread.tsx
// Story Thread - Threaded Discussion on Stories

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Heart,
  Reply,
  MoreVertical,
  Flag,
  Share2,
  Award,
  Flame,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  hearts: number;
  heat: number;
  replies: Comment[];
  createdAt: string;
  isLiked: boolean;
  isBestAnswer?: boolean;
}

interface StoryThreadProps {
  storyId: string;
  storyTitle: string;
  onAddComment?: (content: string, parentId?: string) => void;
}

export const StoryThread: React.FC<StoryThreadProps> = ({
  storyId: _storyId,
  storyTitle,
  onAddComment,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  // Mock data - replace with API
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'Kwame Mensah',
      content: 'This reminds me of how my grandmother used to tell stories by the fire. The way you described the spider\'s cunning is perfect! 🕷️',
      hearts: 45,
      heat: 120,
      replies: [
        {
          id: '1-1',
          userId: 'user2',
          userName: 'Amara Okafor',
          content: 'Yes! The oral tradition is so important. My grandmother would act out the parts and we\'d all participate.',
          hearts: 23,
          heat: 67,
          replies: [],
          createdAt: '2025-01-15T10:30:00Z',
          isLiked: false,
        },
      ],
      createdAt: '2025-01-15T10:00:00Z',
      isLiked: true,
    },
    {
      id: '2',
      userId: 'user3',
      userName: 'Chioma Eze',
      content: 'I appreciate how this version maintains the moral lesson about sharing wisdom. In our modern world, we often forget that knowledge grows when shared.',
      hearts: 67,
      heat: 189,
      replies: [],
      createdAt: '2025-01-15T11:00:00Z',
      isLiked: false,
      isBestAnswer: true,
    },
  ]);

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  const handleLike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          hearts: comment.isLiked ? comment.hearts - 1 : comment.hearts + 1,
        };
      }
      return comment;
    }));
  };

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    
    onAddComment?.(newComment, replyingTo || undefined);
    setNewComment('');
    setReplyingTo(null);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const CommentItem: React.FC<{ comment: Comment; depth?: number }> = ({ comment, depth = 0 }) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isExpanded = expandedReplies.has(comment.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${depth > 0 ? 'ml-8 sm:ml-12' : ''}`}
      >
        <div className={`p-4 rounded-xl ${
          comment.isBestAnswer
            ? theme === 'dark'
              ? 'bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-2 border-amber-600'
              : 'bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400'
            : theme === 'dark'
            ? 'bg-gray-800/50'
            : 'bg-gray-50'
        } mb-3`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                {comment.userName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className={`font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {comment.userName}
                  </p>
                  {comment.isBestAnswer && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-600 rounded-full">
                      <Award className="w-3 h-3 text-white" />
                      <span className="text-xs font-bold text-white">Best</span>
                    </div>
                  )}
                </div>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {formatTimestamp(comment.createdAt)}
                </p>
              </div>
            </div>

            <button className={`p-2 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            } transition-colors`}>
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <p className={`text-sm sm:text-base mb-3 leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {comment.content}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={() => handleLike(comment.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                comment.isLiked
                  ? 'bg-red-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span className="font-semibold">{comment.hearts}</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 text-orange-500 rounded-lg">
              <Flame className="w-4 h-4" />
              <span className="font-semibold">{comment.heat}</span>
            </div>

            <button
              onClick={() => setReplyingTo(comment.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Reply className="w-4 h-4" />
              Reply
            </button>

            <button className={`p-1.5 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-200'
            }`}>
              <Share2 className="w-4 h-4" />
            </button>

            <button className={`p-1.5 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-200'
            }`}>
              <Flag className="w-4 h-4" />
            </button>
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-700"
            >
              <div className="flex gap-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={`Reply to ${comment.userName}...`}
                  rows={3}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 ${
                    theme === 'dark'
                      ? 'border-gray-700 bg-gray-700 text-white'
                      : 'border-gray-200 bg-white'
                  } focus:outline-none focus:border-purple-600 transition-colors`}
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setReplyingTo(null)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  Reply
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Replies */}
        {hasReplies && (
          <div className="ml-4 sm:ml-8">
            <button
              onClick={() => toggleReplies(comment.id)}
              className={`flex items-center gap-2 px-3 py-1.5 mb-2 rounded-lg text-sm font-semibold transition-colors ${
                theme === 'dark'
                  ? 'text-purple-400 hover:bg-gray-800'
                  : 'text-purple-600 hover:bg-gray-100'
              }`}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </>
              )}
            </button>

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                ))}
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    } pb-20`}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 opacity-90" />
        
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-32 h-32 border-4 border-white rounded-full"
          />
          <Sparkles className="absolute bottom-0 left-0 w-24 h-24 text-white" />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-8 h-8 text-white" />
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Discussion
                </h1>
              </div>
              <p className="text-lg text-white/90">
                {storyTitle}
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 sm:p-8">
        {/* New Comment Form */}
        <div className={`p-6 rounded-2xl mb-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}>
          <h3 className={`text-lg font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Share Your Thoughts
          </h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What did you think of this story? Share insights, ask questions, or add your own perspective..."
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border-2 mb-4 ${
              theme === 'dark'
                ? 'border-gray-700 bg-gray-700 text-white'
                : 'border-gray-200 bg-white'
            } focus:outline-none focus:border-purple-600 transition-colors`}
          />
          <div className="flex justify-between items-center">
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {newComment.length}/500
            </p>
            <button
              onClick={handleSubmit}
              disabled={!newComment.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post Comment
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {comments.length} Comments
            </h3>
            <select
              className={`px-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'border-gray-700 bg-gray-800 text-white'
                  : 'border-gray-200 bg-white text-gray-900'
              } font-semibold`}
            >
              <option>Most Heat</option>
              <option>Most Hearts</option>
              <option>Newest First</option>
              <option>Oldest First</option>
            </select>
          </div>

          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryThread;
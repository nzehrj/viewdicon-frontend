import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Image, 
  Mic, 
  Video, 
  Send, 
  Heart,
  Filter
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorCrest: number;
  content: string;
  timestamp: Date;
  type: 'text' | 'question' | 'announcement' | 'proof';
  likes: number;
  replies: number;
  mediaUrl?: string;
}

/**
 * VILLAGE SQUARE COMPONENT
 * 
 * The internal discussion area for each village.
 * This is NOT social media - this is professional house talk.
 * 
 * Features:
 * - Work questions
 * - Council announcements
 * - Training ground invites
 * - Proof of work sharing
 * - Village-specific branding
 * 
 * Location: src/components/circle/VillageSquare.tsx
 */
export const VillageSquare: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  const userVillage = useAppSelector((state) => state.user.village);
  const userRole = useAppSelector((state) => state.user.role);
  
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'text' | 'question' | 'announcement' | 'proof'>('text');
  const [filterType, setFilterType] = useState<'all' | 'questions' | 'announcements' | 'trending'>('all');
  
  // Mock posts data - TODO: Replace with API call
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      authorId: '123',
      authorName: 'Adebayo Johnson',
      authorRole: 'Electrician',
      authorCrest: 3,
      content: 'Who knows how to fix inverter that keeps beeping at night? Client is in Ikeja area. Willing to split job if someone experienced can help.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      type: 'question',
      likes: 12,
      replies: 5,
    },
    {
      id: '2',
      authorId: '456',
      authorName: 'Council Announcement',
      authorRole: 'Village Elder',
      authorCrest: 5,
      content: '🔔 Training Session: Solar panel installation best practices. Saturday 6pm at Training Ground. Free for all Construction Village members.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      type: 'announcement',
      likes: 45,
      replies: 12,
    },
    {
      id: '3',
      authorId: '789',
      authorName: 'Chioma Okafor',
      authorRole: 'Plumber',
      authorCrest: 4,
      content: 'Completed 50-apartment borehole system today. Clean water flowing. Proof attached. Available for similar projects.',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      type: 'proof',
      likes: 67,
      replies: 18,
      mediaUrl: '/mock-image.jpg',
    },
  ]);
  
  // Get village color and config
  const villageName = userVillage?.villageName || 'Village';
  const villageColor = '#10b981'; // Default green - TODO: Get from village config
  
  const handlePost = () => {
    if (!postContent.trim()) return;
    
    const newPost: Post = {
      id: Date.now().toString(),
      authorId: user?.id || '',
      authorName: user?.full_name || user?.name || 'You',
      authorRole: userRole?.roleName || 'Member',
      authorCrest: 1,
      content: postContent,
      timestamp: new Date(),
      type: postType,
      likes: 0,
      replies: 0,
    };
    
    setPosts([newPost, ...posts]);
    setPostContent('');
    setPostType('text');
  };
  
  const getPostTypeColor = (type: Post['type']) => {
    switch (type) {
      case 'question': return '#3b82f6'; // Blue
      case 'announcement': return '#f59e0b'; // Amber
      case 'proof': return '#10b981'; // Green
      default: return theme === 'dark' ? '#6b7280' : '#9ca3af';
    }
  };
  
  const getPostTypeLabel = (type: Post['type']) => {
    switch (type) {
      case 'question': return 'Question';
      case 'announcement': return 'Announcement';
      case 'proof': return 'Proof of Work';
      default: return 'Post';
    }
  };
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };
  
  const filteredPosts = posts.filter(post => {
    if (filterType === 'all') return true;
    if (filterType === 'questions') return post.type === 'question';
    if (filterType === 'announcements') return post.type === 'announcement';
    if (filterType === 'trending') return post.likes > 20; // Simple trending logic
    return true;
  });
  
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Village Header */}
      <div 
        className="p-6 rounded-2xl text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${villageColor} 0%, ${villageColor}dd 100%)` }}
      >
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">{villageName} Square</h1>
          <p className="text-white/90 text-sm">
            Your village house. Discuss work, ask questions, share knowledge.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-32 h-32 opacity-10">
          <MessageSquare className="w-full h-full" />
        </div>
      </div>
      
      {/* Post Composer */}
      <div className={`p-4 rounded-xl border-2 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="mb-3">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Share knowledge, ask questions, show proof of work..."
            className={`w-full p-3 rounded-lg border resize-none ${
              theme === 'dark'
                ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-500'
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            rows={3}
          />
        </div>
        
        {/* Post Type Selector */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Post Type:
          </span>
          {(['text', 'question', 'announcement', 'proof'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setPostType(type)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                postType === type
                  ? 'text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={postType === type ? { backgroundColor: getPostTypeColor(type) } : {}}
            >
              {getPostTypeLabel(type)}
            </button>
          ))}
        </div>
        
        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className={`p-2 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}>
              <Image className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            <button className={`p-2 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}>
              <Video className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            <button className={`p-2 rounded-lg ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}>
              <Mic className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
          
          <button
            onClick={handlePost}
            disabled={!postContent.trim()}
            className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: postContent.trim() ? villageColor : theme === 'dark' ? '#374151' : '#e5e7eb',
              color: postContent.trim() ? 'white' : theme === 'dark' ? '#9ca3af' : '#6b7280'
            }}
          >
            <Send className="w-4 h-4" />
            Post
          </button>
        </div>
      </div>
      
      {/* Filter Bar */}
      <div className={`flex items-center gap-2 p-2 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <Filter className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
        {(['all', 'questions', 'announcements', 'trending'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setFilterType(filter)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              filterType === filter
                ? theme === 'dark'
                  ? 'bg-gray-700 text-white'
                  : 'bg-white text-gray-900 shadow-sm'
                : theme === 'dark'
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      
      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            {/* Post Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: villageColor }}
                >
                  {post.authorName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {post.authorName}
                    </p>
                    <span className="text-xs">
                      {'⭐'.repeat(post.authorCrest)}
                    </span>
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {post.authorRole} • {formatTimestamp(post.timestamp)}
                  </p>
                </div>
              </div>
              
              {/* Post Type Badge */}
              <span 
                className="px-2 py-1 rounded text-xs font-medium text-white"
                style={{ backgroundColor: getPostTypeColor(post.type) }}
              >
                {getPostTypeLabel(post.type)}
              </span>
            </div>
            
            {/* Post Content */}
            <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {post.content}
            </p>
            
            {/* Media Preview */}
            {post.mediaUrl && (
              <div className="mb-3 rounded-lg overflow-hidden bg-gray-200 h-48 flex items-center justify-center">
                <Image className="w-12 h-12 text-gray-400" />
              </div>
            )}
            
            {/* Post Actions */}
            <div className="flex items-center gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="w-4 h-4" />
                {post.likes}
              </button>
              <button className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                <MessageSquare className="w-4 h-4" />
                {post.replies}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className={`p-12 text-center rounded-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${
            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
          }`} />
          <p className={`text-lg font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            No posts yet
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Be the first to start a conversation in {villageName} Square!
          </p>
        </div>
      )}
    </div>
  );
};

export default VillageSquare;
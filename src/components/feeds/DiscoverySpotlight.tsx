import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Sparkles,
  Heart,
  MessageCircle,
  Eye,
  Award,
  Zap,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface SpotlightPost {
  id: string;
  type: 'trending' | 'viral' | 'quality' | 'rising' | 'featured';
  feedType: 'motion' | 'gallery' | 'voice' | 'family';
  authorId: string;
  authorName: string;
  authorVillage?: string;
  authorVillageColor?: string;
  authorCrest?: number;
  title?: string;
  preview: string;
  thumbnailUrl?: string;
  likes: number;
  comments: number;
  views: number;
  score: number; // AI quality score
  timestamp: Date;
  tags?: string[];
}

type SpotlightCategory = 'all' | 'trending' | 'viral' | 'quality' | 'rising' | 'featured';

/**
 * DISCOVERY SPOTLIGHT COMPONENT
 * 
 * AI-curated content board showing the best posts across all feeds.
 * 
 * Features:
 * - Trending posts (high engagement in last 24h)
 * - Viral content (rapid growth)
 * - Quality picks (high AI scores)
 * - Rising stars (new creators)
 * - Featured (curated by moderators)
 * - Cross-feed discovery
 * - Engagement metrics
 * - Quality scores
 * 
 * AI Criteria:
 * - Engagement rate (likes, comments, shares)
 * - View-to-completion rate (for video)
 * - Cowrie tips received
 * - Author trust level
 * - Content quality (CAWS analysis)
 * - Recency
 * - Diversity (different villages/topics)
 * 
 * Location: src/components/feeds/DiscoverySpotlight.tsx
 */
export const DiscoverySpotlight: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [selectedCategory, setSelectedCategory] = useState<SpotlightCategory>('all');
  
  // Mock posts data - TODO: Replace with AI-curated API
  const posts: SpotlightPost[] = [
    {
      id: '1',
      type: 'viral',
      feedType: 'motion',
      authorId: 'user1',
      authorName: 'Chef Amaka',
      authorVillage: 'Hospitality Village',
      authorVillageColor: '#f97316',
      authorCrest: 4,
      title: '3-Minute Jollof Rice Hack',
      preview: 'This cooking hack is changing the game! Watch how I make perfect jollof in under 3 minutes...',
      likes: 24500,
      comments: 1234,
      views: 458000,
      score: 95,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tags: ['cooking', 'jollof', 'viral'],
    },
    {
      id: '2',
      type: 'quality',
      feedType: 'gallery',
      authorId: 'user2',
      authorName: 'Builder Chinedu',
      authorVillage: 'Construction Village',
      authorVillageColor: '#10b981',
      authorCrest: 5,
      title: 'Eco-Friendly Building Materials',
      preview: 'Building sustainable homes with local materials. This 4-bedroom house uses 80% recycled content...',
      likes: 8900,
      comments: 567,
      views: 45000,
      score: 98,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      tags: ['construction', 'eco', 'innovation'],
    },
    {
      id: '3',
      type: 'trending',
      feedType: 'voice',
      authorId: 'user3',
      authorName: 'Activist Funke',
      authorVillage: 'Governance Village',
      authorVillageColor: '#dc2626',
      authorCrest: 4,
      preview: 'The new education policy changes everything. Here\'s what parents need to know urgently...',
      likes: 15600,
      comments: 2341,
      views: 123000,
      score: 92,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      tags: ['education', 'policy', 'parents'],
    },
    {
      id: '4',
      type: 'rising',
      feedType: 'gallery',
      authorId: 'user4',
      authorName: 'Designer Zainab',
      authorVillage: 'Crafts Village',
      authorVillageColor: '#8b5cf6',
      authorCrest: 2,
      title: 'Modern Ankara Fusion',
      preview: 'Mixing traditional ankara with contemporary designs. This collection sold out in 2 hours!',
      likes: 3400,
      comments: 234,
      views: 18000,
      score: 88,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      tags: ['fashion', 'ankara', 'design'],
    },
  ];
  
  const categories: Array<{ id: SpotlightCategory; label: string; icon: React.ElementType; color: string }> = [
    { id: 'all', label: 'All', icon: Sparkles, color: '#8b5cf6' },
    { id: 'trending', label: 'Trending', icon: TrendingUp, color: '#ef4444' },
    { id: 'viral', label: 'Viral', icon: Zap, color: '#f59e0b' },
    { id: 'quality', label: 'Quality', icon: Award, color: '#10b981' },
    { id: 'rising', label: 'Rising', icon: TrendingUp, color: '#3b82f6' },
    { id: 'featured', label: 'Featured', icon: Sparkles, color: '#ec4899' },
  ];
  
  const filteredPosts = posts.filter(
    (post) => selectedCategory === 'all' || post.type === selectedCategory
  );
  
  const getTypeColor = (type: SpotlightPost['type']) => {
    const category = categories.find(c => c.id === type);
    return category?.color || '#8b5cf6';
  };
  
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
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
  
  const handlePostClick = (postId: string) => {
    // TODO: Navigate to post detail
    console.log('View post:', postId);
  };
  
  return (
    <div className={`min-h-screen pb-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 ${
        theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      } border-b`}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Spotlight
            </h1>
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Discover the best content across all feeds
          </p>
        </div>
        
        {/* Category Tabs */}
        <div className="overflow-x-auto pb-2 px-4 hide-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={isActive ? { backgroundColor: category.color } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Posts Grid */}
      <div className="p-4 space-y-4">
        {filteredPosts.map((post, index) => {
          const typeColor = getTypeColor(post.type);
          
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handlePostClick(post.id)}
              className={`rounded-xl border overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              {/* Type Badge */}
              <div 
                className="px-4 py-2 flex items-center justify-between"
                style={{ backgroundColor: `${typeColor}20` }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: typeColor }}
                  />
                  <span 
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: typeColor }}
                  >
                    {post.type}
                  </span>
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    • {post.feedType}
                  </span>
                </div>
                
                {/* AI Score */}
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" style={{ color: typeColor }} />
                  <span className="text-xs font-bold" style={{ color: typeColor }}>
                    {post.score}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                {/* Author */}
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ backgroundColor: post.authorVillageColor }}
                  >
                    {post.authorName.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-bold text-sm truncate ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {post.authorName}
                      </p>
                      {post.authorCrest && (
                        <span className="text-xs">
                          {'⭐'.repeat(post.authorCrest)}
                        </span>
                      )}
                    </div>
                    {post.authorVillage && (
                      <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {post.authorVillage}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatTimestamp(post.timestamp)}
                  </div>
                </div>
                
                {/* Title */}
                {post.title && (
                  <h3 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {post.title}
                  </h3>
                )}
                
                {/* Preview */}
                <p className={`text-sm mb-3 line-clamp-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {post.preview}
                </p>
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-1 rounded ${
                          theme === 'dark'
                            ? 'bg-purple-600/20 text-purple-400'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Eye className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {formatNumber(post.views)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm">
                      <Heart className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {formatNumber(post.likes)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm">
                      <MessageCircle className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {formatNumber(post.comments)}
                      </span>
                    </div>
                  </div>
                  
                  <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Sparkles className={`w-16 h-16 mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            No posts in this category yet
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Check back later for curated content
          </p>
        </div>
      )}
      
      {/* Load More */}
      {filteredPosts.length > 0 && (
        <div className="p-4">
          <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            theme === 'dark'
              ? 'bg-gray-800 text-white hover:bg-gray-750'
              : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
          }`}>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscoverySpotlight;
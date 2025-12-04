import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Heart, 
  MessageCircle, 
  Share2,
  Play,
  Pause,
  Volume2,
  MoreVertical,
  AlertCircle,
  TrendingUp,
  Hash,
  Award
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import { IdentitySkinBadge } from '@components/identity/IdentitySkinSelector';

interface VoicePost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorVillage?: string;
  authorVillageColor?: string;
  authorCrest?: number;
  identitySkin: 'work' | 'public' | 'clan';
  type: 'voice' | 'text' | 'voice_text'; // Voice note, text, or both
  voiceUrl?: string;
  voiceDuration?: number; // in seconds
  text?: string;
  image?: string; // Optional 1 photo
  likes: number;
  comments: number;
  shares: number;
  cowrieStake?: number; // Stake to pin message
  isLiked: boolean;
  timestamp: Date;
  tags?: string[];
  category?: 'national_pulse' | 'street_vibes' | 'market_shouts' | 'wisdom_corner' | 'innovation_fire';
}

type CategoryType = 'all' | 'national_pulse' | 'street_vibes' | 'market_shouts' | 'wisdom_corner' | 'innovation_fire';

/**
 * VOICE FEED COMPONENT (Twitter-style)
 * 
 * National conversation layer with voice notes and text.
 * 
 * Features:
 * - Voice notes (90s max)
 * - Text posts (400 chars max)
 * - Thread replies
 * - "Raise Calabash" (repost/share)
 * - "Stake Word" (pin with Cowrie)
 * - Auto-translation
 * - CAWS moderation
 * 
 * Categories:
 * - National Pulse (Politics, Crisis)
 * - Street Vibes (Entertainment, Humor)
 * - Market Shouts (Business Ads)
 * - Wisdom Corner (Elders, Mentors)
 * - Innovation Fire (Tech, Ideas)
 * 
 * Location: src/components/feeds/VoiceFeed.tsx
 */
export const VoiceFeed: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [playingPostId, setPlayingPostId] = useState<string | null>(null);
  
  // Mock posts data - TODO: Replace with API
  const posts: VoicePost[] = [
    {
      id: '1',
      authorId: 'user1',
      authorName: 'Governor Obi',
      authorVillage: 'Governance Village',
      authorVillageColor: '#dc2626',
      authorCrest: 5,
      identitySkin: 'work',
      type: 'voice_text',
      voiceUrl: '/audio/voice1.mp3',
      voiceDuration: 45,
      text: 'New minimum wage announcement coming next week. We hear the people. Workers deserve better.',
      likes: 3421,
      comments: 567,
      shares: 234,
      cowrieStake: 50000,
      isLiked: false,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      tags: ['politics', 'workers', 'wages'],
      category: 'national_pulse',
    },
    {
      id: '2',
      authorId: 'user2',
      authorName: 'Market Woman Ada',
      authorVillage: 'Business Village',
      authorVillageColor: '#f59e0b',
      authorCrest: 3,
      identitySkin: 'public',
      type: 'text',
      text: '🔥 Fresh tomatoes just arrived! ₵500 per basket. Available at Oshodi Market. First come, first served! Call 0803-XXX-XXXX',
      likes: 156,
      comments: 23,
      shares: 45,
      isLiked: false,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tags: ['market', 'tomatoes', 'oshodi'],
      category: 'market_shouts',
    },
    {
      id: '3',
      authorId: 'user3',
      authorName: 'Mama Ngozi',
      authorVillage: 'Spiritual Village',
      authorVillageColor: '#6366f1',
      authorCrest: 5,
      identitySkin: 'clan',
      type: 'voice',
      voiceUrl: '/audio/voice3.mp3',
      voiceDuration: 60,
      likes: 892,
      comments: 134,
      shares: 89,
      isLiked: true,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      tags: ['wisdom', 'prayer', 'guidance'],
      category: 'wisdom_corner',
    },
  ];
  
  const categories: Array<{ id: CategoryType; label: string; icon: React.ElementType; color: string }> = [
    { id: 'all', label: 'All', icon: Hash, color: '#6b7280' },
    { id: 'national_pulse', label: 'National Pulse', icon: AlertCircle, color: '#dc2626' },
    { id: 'street_vibes', label: 'Street Vibes', icon: TrendingUp, color: '#8b5cf6' },
    { id: 'market_shouts', label: 'Market Shouts', icon: Volume2, color: '#f59e0b' },
    { id: 'wisdom_corner', label: 'Wisdom', icon: Award, color: '#6366f1' },
    { id: 'innovation_fire', label: 'Innovation', icon: TrendingUp, color: '#0ea5e9' },
  ];
  
  const filteredPosts = posts.filter(
    (post) => selectedCategory === 'all' || post.category === selectedCategory
  );
  
  const handlePlayVoice = (postId: string) => {
    setPlayingPostId(playingPostId === postId ? null : postId);
    // TODO: Actual audio playback
  };
  
  const handleLike = (postId: string) => {
    // TODO: API call
    console.log('Like post:', postId);
  };
  
  const handleComment = (postId: string) => {
    // TODO: Open comment thread
    console.log('Comment on:', postId);
  };
  
  const handleShare = (postId: string) => {
    // TODO: Raise Calabash (repost)
    console.log('Share post:', postId);
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };
  
  return (
    <div className={`min-h-screen pb-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 ${
        theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      } border-b`}>
        <div className="p-4">
          <h1 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Voice Square
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Where the nation speaks
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
      
      {/* Feed */}
      <div>
        {filteredPosts.map((post) => {
          const isPlaying = playingPostId === post.id;
          
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 border-b ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}
            >
              {/* Author Header */}
              <div className="flex items-start gap-3 mb-3">
                {/* Avatar */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: post.authorVillageColor }}
                >
                  {post.authorName.charAt(0)}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-bold text-sm truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {post.authorName}
                    </p>
                    <IdentitySkinBadge skin={post.identitySkin} size="sm" />
                    {post.authorCrest && (
                      <span className="text-xs">
                        {'⭐'.repeat(post.authorCrest)}
                      </span>
                    )}
                    <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                      • {formatTimestamp(post.timestamp)}
                    </span>
                  </div>
                  
                  {post.authorVillage && (
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {post.authorVillage}
                    </p>
                  )}
                </div>
                
                {/* Menu */}
                <button className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}>
                  <MoreVertical className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>
              
              {/* Voice Note */}
              {(post.type === 'voice' || post.type === 'voice_text') && post.voiceUrl && (
                <div className={`mb-3 p-3 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePlayVoice(post.id)}
                      className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center flex-shrink-0 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      )}
                    </button>
                    
                    {/* Waveform Placeholder */}
                    <div className="flex-1 h-8 rounded bg-purple-600/20 flex items-center px-2">
                      <div className="flex items-center gap-0.5 h-full">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-purple-600 rounded-full"
                            style={{ height: `${Math.random() * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Duration */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Mic className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                      <span className={`text-xs font-medium ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {formatDuration(post.voiceDuration || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Text Content */}
              {post.text && (
                <p className={`text-sm mb-3 whitespace-pre-wrap ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {post.text}
                </p>
              )}
              
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
              
              {/* Stake Badge */}
              {post.cowrieStake && post.cowrieStake > 0 && (
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-3 ${
                  theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                }`}>
                  <TrendingUp className="w-3 h-3" />
                  Staked ₵{post.cowrieStake.toLocaleString()}
                </div>
              )}
              
              {/* Action Bar */}
              <div className="flex items-center gap-6">
                {/* Like */}
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    post.isLiked
                      ? 'text-red-500'
                      : theme === 'dark'
                      ? 'text-gray-400 hover:text-red-400'
                      : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart className="w-5 h-5" fill={post.isLiked ? 'currentColor' : 'none'} />
                  {post.likes > 999 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}
                </button>
                
                {/* Comment */}
                <button
                  onClick={() => handleComment(post.id)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-blue-400'
                      : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  {post.comments}
                </button>
                
                {/* Share (Raise Calabash) */}
                <button
                  onClick={() => handleShare(post.id)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-green-400'
                      : 'text-gray-600 hover:text-green-500'
                  }`}
                >
                  <Share2 className="w-5 h-5" />
                  {post.shares}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Mic className={`w-16 h-16 mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            No posts in this category
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Try selecting a different category
          </p>
        </div>
      )}
    </div>
  );
};

export default VoiceFeed;
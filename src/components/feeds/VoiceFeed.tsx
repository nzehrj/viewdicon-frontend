import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  MoreVertical,
  AlertCircle,
  TrendingUp,
  Hash,
  Award
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import { IdentitySkinBadge } from '@components/identity/IdentitySkinSelector';
import { VoiceInteractionBar } from '@/components/social/VoiceInteractionBar';
import { CouncilSealBadge } from '@/components/social/CouncilSealBadge';
import { InteractionBar } from '@/components/social/InteractionBar';
import { ThreadViewer } from '@/components/social/ThreadViewer';
import { DrumRing } from '@/components/social/DrumRing';
import type { FeedPost } from '@/types/feed.types';
import type { PotStatus } from '@/types/feed.types';

interface VoicePost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorVillage?: string;
  authorVillageColor?: string;
  authorCrest?: number;
  authorCouncilTier?: 'verified' | 'elder' | 'council' | 'chief' | 'ancestor';
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
  potStatus: PotStatus; // Add pot status
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
  const [selectedThreadPost, setSelectedThreadPost] = useState<VoicePost | null>(null);
  const [selectedDrumPost, setSelectedDrumPost] = useState<string | null>(null);
  
  // Mock posts data - TODO: Replace with API
  const posts: VoicePost[] = [
    {
      id: '1',
      authorId: 'user1',
      authorName: 'Governor Obi',
      authorVillage: 'Governance Village',
      authorVillageColor: '#dc2626',
      authorCrest: 5,
      authorCouncilTier: 'chief',
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
      potStatus: {
        post_id: '1',
        total_pots: 3421,
        heat_level: 'boiling',
        heat_score: 85,
        started_cooking_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
        reached_boiling_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
        ready_at: null,
        last_pot_at: new Date(Date.now() - 5 * 60 * 1000),
        cooling_rate: 0.1,
        boosted: false,
        boost_multiplier: 1.0,
      },
    },
    {
      id: '2',
      authorId: 'user2',
      authorName: 'Market Woman Ada',
      authorVillage: 'Business Village',
      authorVillageColor: '#f59e0b',
      authorCrest: 3,
      authorCouncilTier: 'verified',
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
      potStatus: {
        post_id: '2',
        total_pots: 156,
        heat_level: 'cooking',
        heat_score: 45,
        started_cooking_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
        reached_boiling_at: null,
        ready_at: null,
        last_pot_at: new Date(Date.now() - 15 * 60 * 1000),
        cooling_rate: 0.15,
        boosted: false,
        boost_multiplier: 1.0,
      },
    },
    {
      id: '3',
      authorId: 'user3',
      authorName: 'Mama Ngozi',
      authorVillage: 'Spiritual Village',
      authorVillageColor: '#6366f1',
      authorCrest: 5,
      authorCouncilTier: 'elder',
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
      potStatus: {
        post_id: '3',
        total_pots: 892,
        heat_level: 'cooking',
        heat_score: 62,
        started_cooking_at: new Date(Date.now() - 5 * 60 * 60 * 1000),
        reached_boiling_at: null,
        ready_at: null,
        last_pot_at: new Date(Date.now() - 30 * 60 * 1000),
        cooling_rate: 0.12,
        boosted: false,
        boost_multiplier: 1.0,
      },
    },
  ];
  
  const categories: Array<{ id: CategoryType; label: string; icon: React.ElementType; color: string }> = [
    { id: 'all', label: 'All', icon: Hash, color: '#6b7280' },
    { id: 'national_pulse', label: 'National Pulse', icon: AlertCircle, color: '#dc2626' },
    { id: 'street_vibes', label: 'Street Vibes', icon: TrendingUp, color: '#8b5cf6' },
    { id: 'market_shouts', label: 'Market Shouts', icon: Mic, color: '#f59e0b' },
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
    const post = posts.find(p => p.id === postId);
    if (post) {
      setSelectedThreadPost(post);
    }
  };
  
  const handleShare = (postId: string) => {
    setSelectedDrumPost(postId);
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

  // Convert VoicePost to FeedPost for ThreadViewer
  const convertToFeedPost = (voicePost: VoicePost): FeedPost => {
    return {
      post_id: voicePost.id,
      author_afro_id: voicePost.authorId,
      author_display_name: voicePost.authorName,
      author_handle: `@${voicePost.authorName.toLowerCase().replace(/\s+/g, '')}`,
      author_avatar_url: voicePost.authorAvatar || '',
      author_village_role: voicePost.authorVillage || '',
      author_rank_level: voicePost.authorCrest || 0,
      author_badges: [],
      type: voicePost.type === 'voice' ? 'music' : 'text',
      content: voicePost.text || '',
      media_urls: voicePost.image ? [voicePost.image] : [],
      visibility: 'public',
      tagged_handles: [],
      hashtags: voicePost.tags || [],
      location: null,
      pot_status: voicePost.potStatus,
      comment_count: voicePost.comments,
      share_count: voicePost.shares,
      bookmark_count: 0,
      created_at: voicePost.timestamp,
      updated_at: voicePost.timestamp,
      edited: false,
    };
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
                    {post.authorCouncilTier && (
                      <CouncilSealBadge tier={post.authorCouncilTier} size="sm" showTooltip />
                    )}
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
                <div className="mb-3">
                  <VoiceInteractionBar
                    isPlaying={isPlaying}
                    duration={post.voiceDuration || 0}
                    currentTime={0}
                    listeners={post.likes}
                    onPlay={() => handlePlayVoice(post.id)}
                    onPause={() => handlePlayVoice(post.id)}
                    onSeek={(time) => console.log('Seek to:', time)}
                    onListen={() => console.log('Listen')}
                    compact={true}
                  />
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
              
              {/* Interaction Bar */}
              <InteractionBar
                postId={post.id}
                potStatus={post.potStatus}
                echoCount={post.comments}
                drumCount={post.shares}
                hasUserStirred={false}
                hasUserEchoed={false}
                hasUserDrummed={false}
                hasUserBasket={false}
                onPot={async () => handleLike(post.id)}
                onEcho={() => handleComment(post.id)}
                onDrum={() => handleShare(post.id)}
                onBasket={() => console.log('Basket:', post.id)}
                showLabels={false}
                compact={true}
              />
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

      {/* Thread Viewer Modal */}
      <AnimatePresence>
        {selectedThreadPost && (
          <ThreadViewer
            post={convertToFeedPost(selectedThreadPost)}
            onClose={() => setSelectedThreadPost(null)}
            onAddEcho={async (content, parentId) => {
              console.log('Add echo:', content, parentId);
              // TODO: API call
            }}
            onHeartEcho={(echoId) => {
              console.log('Heart echo:', echoId);
              // TODO: API call
            }}
          />
        )}
      </AnimatePresence>

      {/* DrumRing Modal */}
      <AnimatePresence>
        {selectedDrumPost && (
          <DrumRing
            postId={selectedDrumPost}
            postUrl={`https://viewdicon.com/voice/${selectedDrumPost}`}
            onDrumToVillage={(villageId) => {
              console.log('Drum to village:', villageId);
              setSelectedDrumPost(null);
            }}
            onDrumToFeed={(feedType) => {
              console.log('Drum to feed:', feedType);
              setSelectedDrumPost(null);
            }}
            onCopyLink={() => {
              console.log('Link copied');
            }}
            onClose={() => setSelectedDrumPost(null)}
          />
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default VoiceFeed;
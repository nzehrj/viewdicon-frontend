import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  DollarSign,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Calendar,
  Baby,
  Home,
  TreeDeciduous
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import { PotSystem } from '@/components/social/PotSystem';
import { DrumRing } from '@/components/social/DrumRing';
import type { PotStatus, FeedPost, PostVisibility } from '@/types/feed.types';

interface FamilyPost {
  id: string;
  authorId: string;
  authorName: string;
  authorDisplayName?: string; // Can be masked (e.g., "Child of Benin")
  isMasked: boolean; // Ghost identity mode
  tribe?: string;
  state?: string;
  hometown?: string;
  type: 'announcement' | 'fundraising' | 'reunion' | 'burial' | 'birth' | 'marriage' | 'community';
  title: string;
  content: string;
  image?: string;
  targetAmount?: number; // For fundraising
  raisedAmount?: number;
  eventDate?: Date;
  location?: string;
  pots: number; // Changed from likes
  echoes: number; // Changed from comments
  drums: number; // Changed from shares
  privacy: 'public' | 'tribe_only' | 'family_only';
  timestamp: Date;
  tags?: string[];
  potStatus: PotStatus; // Add pot status
}

type PostType = 'all' | 'announcement' | 'fundraising' | 'reunion' | 'burial' | 'birth' | 'marriage' | 'community';

/**
 * FAMILY CIRCLE COMPONENT (Facebook-style)
 * 
 * Family, clan, and hometown network with Pot/Echo/Drum interactions.
 * 
 * Location: src/components/feeds/FamilyCircle.tsx
 */
export const FamilyCircle: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const user = useAppSelector((state) => state.user.user);
  
  const [selectedType, setSelectedType] = useState<PostType>('all');
  const [ghostMode, setGhostMode] = useState(false);
  const [selectedDrumPost, setSelectedDrumPost] = useState<string | null>(null);
  
  // Mock posts data - TODO: Replace with API
  const posts: FamilyPost[] = [
    {
      id: '1',
      authorId: 'user1',
      authorName: 'Chief Okonkwo',
      tribe: 'Igbo',
      state: 'Anambra',
      hometown: 'Nnewi',
      isMasked: false,
      type: 'burial',
      title: 'Final Burial Ceremony - Mama Ngozi Okonkwo',
      content: 'With heavy hearts, we announce the final burial ceremony of our beloved mother, Mama Ngozi Okonkwo (1945-2024). Ceremony will hold on Saturday, December 28th at our family compound in Nnewi. All family members and well-wishers are invited.',
      eventDate: new Date('2024-12-28'),
      location: 'Nnewi, Anambra State',
      pots: 234,
      echoes: 67,
      drums: 12,
      privacy: 'public',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      tags: ['burial', 'nnewi', 'family'],
      potStatus: {
        post_id: '1',
        total_pots: 234,
        heat_level: 'cooking',
        heat_score: 45,
        started_cooking_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        reached_boiling_at: null,
        ready_at: null,
        last_pot_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
        cooling_rate: 0.15,
        boosted: false,
        boost_multiplier: 1.0,
      },
    },
    {
      id: '2',
      authorId: 'user2',
      authorName: 'Child of Benin Soil',
      authorDisplayName: 'Child of Benin Soil',
      tribe: 'Edo',
      state: 'Edo',
      hometown: 'Benin City',
      isMasked: true,
      type: 'community',
      title: 'Community Borehole Project - Need Support',
      content: 'Our village has been without clean water for 3 years. We have government approval to drill a borehole but need ₦500,000. Any amount helps. This is for our children and elders.',
      targetAmount: 500000,
      raisedAmount: 234000,
      pots: 567,
      echoes: 89,
      drums: 123,
      privacy: 'public',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      tags: ['community', 'water', 'benin'],
      potStatus: {
        post_id: '2',
        total_pots: 567,
        heat_level: 'boiling',
        heat_score: 72,
        started_cooking_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        reached_boiling_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        ready_at: null,
        last_pot_at: new Date(Date.now() - 30 * 60 * 1000),
        cooling_rate: 0.10,
        boosted: false,
        boost_multiplier: 1.0,
      },
    },
    {
      id: '3',
      authorId: 'user3',
      authorName: 'Aisha Mohammed',
      tribe: 'Hausa',
      state: 'Kano',
      hometown: 'Kano City',
      isMasked: false,
      type: 'birth',
      title: '🎉 New Addition to Our Family!',
      content: 'Alhamdulillah! We are blessed with a baby boy. Name: Ibrahim Mohammed. Born: November 12, 2024. Mother and baby are doing well. Naming ceremony will be announced soon.',
      eventDate: new Date('2024-11-12'),
      pots: 892,
      echoes: 156,
      drums: 45,
      privacy: 'tribe_only',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      tags: ['birth', 'blessing', 'kano'],
      potStatus: {
        post_id: '3',
        total_pots: 892,
        heat_level: 'ready',
        heat_score: 95,
        started_cooking_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        reached_boiling_at: new Date(Date.now() - 12 * 60 * 60 * 1000),
        ready_at: new Date(Date.now() - 6 * 60 * 60 * 1000),
        last_pot_at: new Date(Date.now() - 10 * 60 * 1000),
        cooling_rate: 0.05,
        boosted: false,
        boost_multiplier: 1.0,
      },
    },
  ];
  
  const postTypes: Array<{ id: PostType; label: string; icon: React.ElementType; color: string }> = [
    { id: 'all', label: 'All', icon: Globe, color: '#6b7280' },
    { id: 'announcement', label: 'Announcements', icon: Users, color: '#3b82f6' },
    { id: 'fundraising', label: 'Fundraising', icon: DollarSign, color: '#10b981' },
    { id: 'reunion', label: 'Reunions', icon: Users, color: '#8b5cf6' },
    { id: 'burial', label: 'Burials', icon: TreeDeciduous, color: '#6b7280' },
    { id: 'birth', label: 'Births', icon: Baby, color: '#ec4899' },
    { id: 'community', label: 'Community', icon: Home, color: '#f59e0b' },
  ];
  
  const filteredPosts = posts.filter(
    (post) => selectedType === 'all' || post.type === selectedType
  );
  
  const getTypeIcon = (type: FamilyPost['type']) => {
    const typeData = postTypes.find(t => t.id === type);
    return typeData?.icon || Users;
  };
  
  const getTypeColor = (type: FamilyPost['type']) => {
    const typeData = postTypes.find(t => t.id === type);
    return typeData?.color || '#6b7280';
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  const handleDonate = (post: FamilyPost) => {
    // TODO: Open donation modal
    console.log('Donate to:', post.id);
  };

  // Convert FamilyPost to FeedPost for PotSystem
  const convertToFeedPost = (familyPost: FamilyPost): FeedPost => {
    // Map privacy to visibility (PostVisibility = 'public' | 'followers' | 'village' | 'inner_fire')
    const visibilityMap: { [key: string]: PostVisibility } = {
      'public': 'public',
      'tribe_only': 'village',      // tribe_only maps to village
      'family_only': 'inner_fire',  // family_only maps to inner_fire
    };

    return {
      post_id: familyPost.id,
      author_afro_id: familyPost.authorId,
      author_display_name: familyPost.authorName,
      author_handle: `@${familyPost.authorName.toLowerCase().replace(/\s+/g, '')}`,
      author_avatar_url: familyPost.image || '', // Use image field or empty
      author_village_role: familyPost.tribe || '', // Use tribe as village role
      author_rank_level: 0, // FamilyPost doesn't have crest/rank
      author_badges: [],
      type: 'text',
      content: familyPost.content,
      media_urls: [],
      visibility: visibilityMap[familyPost.privacy] || 'public', // Map privacy to visibility
      tagged_handles: [],
      hashtags: familyPost.tags || [],
      location: familyPost.location || null,
      pot_status: familyPost.potStatus,
      comment_count: familyPost.echoes,
      share_count: familyPost.drums,
      bookmark_count: 0,
      created_at: familyPost.timestamp,
      updated_at: familyPost.timestamp,
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
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Family Circle
              </h1>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Your clan, tribe, and homeland
              </p>
            </div>
            
            {/* Ghost Mode Toggle */}
            <button
              onClick={() => setGhostMode(!ghostMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                ghostMode
                  ? 'bg-purple-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {ghostMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {ghostMode ? 'Ghost Mode' : 'Public'}
            </button>
          </div>
          
          {/* User's Origin */}
          {user?.tribe && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`} />
              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {user.tribe} • {user.country || 'Nigeria'}
              </span>
            </div>
          )}
        </div>
        
        {/* Type Tabs */}
        <div className="overflow-x-auto pb-2 px-4 hide-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {postTypes.map((type) => {
              const Icon = type.icon;
              const isActive = selectedType === type.id;
              
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                    isActive
                      ? 'text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={isActive ? { backgroundColor: type.color } : {}}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Feed */}
      <div className="space-y-4 p-4">
        {filteredPosts.map((post) => {
          const TypeIcon = getTypeIcon(post.type);
          const typeColor = getTypeColor(post.type);
          
          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              {/* Header */}
              <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-start gap-3">
                  {/* Avatar / Icon */}
                  {post.isMasked ? (
                    <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                      <EyeOff className="w-6 h-6 text-white" />
                    </div>
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: typeColor }}
                    >
                      {post.authorName.charAt(0)}
                    </div>
                  )}
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm truncate ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {post.isMasked ? post.authorDisplayName : post.authorName}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs">
                      {post.tribe && (
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {post.tribe}
                        </span>
                      )}
                      {post.hometown && (
                        <>
                          <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>•</span>
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            {post.hometown}
                          </span>
                        </>
                      )}
                    </div>
                    
                    {/* Privacy Badge */}
                    <div className="flex items-center gap-1 mt-1">
                      <Lock className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500 capitalize">
                        {post.privacy.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Type Badge */}
                  <div 
                    className="px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1"
                    style={{ backgroundColor: typeColor }}
                  >
                    <TypeIcon className="w-3 h-3" />
                    {post.type}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className={`font-bold text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {post.title}
                </h3>
                
                <p className={`text-sm mb-3 whitespace-pre-wrap ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {post.content}
                </p>
                
                {/* Event Details */}
                {(post.eventDate || post.location) && (
                  <div className={`p-3 rounded-lg mb-3 space-y-2 ${
                    theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50'
                  }`}>
                    {post.eventDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {formatDate(post.eventDate)}
                        </span>
                      </div>
                    )}
                    {post.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {post.location}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Fundraising Progress */}
                {post.type === 'fundraising' && post.targetAmount && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Raised: ₵{post.raisedAmount?.toLocaleString() || 0}
                      </span>
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        Goal: ₵{post.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className={`w-full h-2 rounded-full overflow-hidden ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${((post.raisedAmount || 0) / post.targetAmount) * 100}%` }}
                      />
                    </div>
                    
                    <button
                      onClick={() => handleDonate(post)}
                      className="w-full mt-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <DollarSign className="w-4 h-4" />
                      Contribute
                    </button>
                  </div>
                )}
              </div>
              
              {/* Pot System */}
              <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <PotSystem
                  post={convertToFeedPost(post)}
                  onPot={async () => console.log('Pot:', post.id)}
                  onEcho={async (content, parentId) => {
                    console.log('Echo:', content, parentId);
                    // TODO: API call
                  }}
                  onDrum={() => setSelectedDrumPost(post.id)}
                  onBasket={() => console.log('Basket:', post.id)}
                  showHeatIndicator={true}
                  compact={false}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Users className={`w-16 h-16 mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            No posts in this category
          </p>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Try selecting a different category
          </p>
        </div>
      )}

      {/* DrumRing Modal */}
      <AnimatePresence>
        {selectedDrumPost && (
          <DrumRing
            postId={selectedDrumPost}
            postUrl={`https://viewdicon.com/family/${selectedDrumPost}`}
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

export default FamilyCircle;
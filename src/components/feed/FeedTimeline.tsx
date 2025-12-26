import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import type { FeedPost as FeedPostType } from '@/types/feed.types';
import { FeedPost } from './FeedPost';

interface FeedTimelineProps {
  onLoadMore?: () => void;
}

type FeedTab = 'hottest' | 'fresh' | 'ready';

export const FeedTimeline: React.FC<FeedTimelineProps> = ({
  onLoadMore,
}) => {
  const [activeTab, setActiveTab] = useState<FeedTab>('hottest');
  const [posts, setPosts] = useState<FeedPostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore] = useState(true); 
  const theme = useAppSelector((state) => state.theme.theme);
  

  // Mock data - Replace with actual API call
  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadPosts = async () => {
    setIsLoading(true);
    
    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const mockPosts: FeedPostType[] = [
      {
        post_id: '1',
        author_afro_id: 'AFR-NG-G1-2025-ABC1',
        author_display_name: 'Amina Okafor',
        author_handle: '@AminaHeals',
        author_avatar_url: '',
        author_village_role: 'Healthcare • Traditional Healer',
        author_rank_level: 45,
        author_badges: ['verified', 'early_adopter'],
        type: 'text',
        content: 'Just finished preparing a fresh batch of herbal remedies for the community. Using century-old recipes passed down from my grandmother. Ubuntu in action! 🌿✨',
        media_urls: [],
        visibility: 'public',
        tagged_handles: [],
        hashtags: ['TraditionalMedicine', 'Ubuntu', 'CommunityHealing'],
        location: 'Lagos, Nigeria',
        pot_status: {
          post_id: '1',
          total_pots: 234,
          heat_level: 'boiling',
          heat_score: 78,
          started_cooking_at: new Date(Date.now() - 3 * 60 * 60 * 1000),
          reached_boiling_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
          ready_at: null,
          last_pot_at: new Date(Date.now() - 5 * 60 * 1000),
          cooling_rate: 0.1,
          boosted: false,
          boost_multiplier: 1.0,
        },
        comment_count: 45,
        share_count: 12,
        bookmark_count: 67,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000),
        edited: false,
      },
      {
        post_id: '2',
        author_afro_id: 'AFR-GH-G1-2024-XYZ2',
        author_display_name: 'Kwame Asante',
        author_handle: '@KwameTheGriot',
        author_avatar_url: '',
        author_village_role: 'Creative • Musician',
        author_rank_level: 67,
        author_badges: ['verified', 'gold_member'],
        type: 'music',
        content: 'New single dropping tonight! "Drums of the Ancestors" - A tribute to our roots. Been working on this for months. Who\'s ready? 🥁🔥',
        media_urls: ['https://example.com/album-cover.jpg'],
        visibility: 'public',
        tagged_handles: [],
        hashtags: ['AfricanMusic', 'NewRelease', 'Ancestors'],
        location: 'Accra, Ghana',
        pot_status: {
          post_id: '2',
          total_pots: 1247,
          heat_level: 'ready',
          heat_score: 95,
          started_cooking_at: new Date(Date.now() - 6 * 60 * 60 * 1000),
          reached_boiling_at: new Date(Date.now() - 3 * 60 * 60 * 1000),
          ready_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
          last_pot_at: new Date(Date.now() - 2 * 60 * 1000),
          cooling_rate: 0.05,
          boosted: true,
          boost_multiplier: 1.5,
        },
        comment_count: 189,
        share_count: 456,
        bookmark_count: 892,
        created_at: new Date(Date.now() - 8 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000),
        edited: false,
      },
      {
        post_id: '3',
        author_afro_id: 'AFR-KE-G1-2025-DEF3',
        author_display_name: 'Zawadi Mwangi',
        author_handle: '@ZawadiCodes',
        author_avatar_url: '',
        author_village_role: 'Technology • Software Engineer',
        author_rank_level: 52,
        author_badges: ['verified'],
        type: 'text',
        content: 'Just launched an open-source project to help African developers learn blockchain! Check it out and contribute. Let\'s build the future together! 💻🌍',
        media_urls: [],
        visibility: 'public',
        tagged_handles: [],
        hashtags: ['OpenSource', 'Blockchain', 'AfricanTech'],
        location: 'Nairobi, Kenya',
        pot_status: {
          post_id: '3',
          total_pots: 89,
          heat_level: 'cooking',
          heat_score: 42,
          started_cooking_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
          reached_boiling_at: null,
          ready_at: null,
          last_pot_at: new Date(Date.now() - 15 * 60 * 1000),
          cooling_rate: 0.15,
          boosted: false,
          boost_multiplier: 1.0,
        },
        comment_count: 23,
        share_count: 8,
        bookmark_count: 34,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
        edited: false,
      },
    ];

    setPosts(mockPosts);
    setIsLoading(false);
  };

  const handlePot = async (postId: string) => {
    try {
      console.log('🔥 Stirring pot:', postId);
      
      // TODO: Replace with actual API call
      // await api.post(`/posts/${postId}/pot`);
      
      // Optimistically update UI
      setPosts(prev => prev.map(post => {
        if (post.post_id === postId) {
          const newTotalPots = post.pot_status.total_pots + 1;
          const newHeatScore = Math.min(100, post.pot_status.heat_score + 2);
          
          // Determine new heat level
          let newHeatLevel = post.pot_status.heat_level;
          if (newHeatScore >= 91) newHeatLevel = 'ready';
          else if (newHeatScore >= 61) newHeatLevel = 'boiling';
          else if (newHeatScore >= 31) newHeatLevel = 'cooking';
          else if (newHeatScore >= 11) newHeatLevel = 'warming';
          
          return {
            ...post,
            pot_status: {
              ...post.pot_status,
              total_pots: newTotalPots,
              heat_score: newHeatScore,
              heat_level: newHeatLevel,
              last_pot_at: new Date(),
            },
          };
        }
        return post;
      }));
      
      // TODO: Show success toast
      // toast.success('Pot stirred! 🔥');
    } catch (error) {
      console.error('Failed to stir pot:', error);
      // TODO: Show error toast
      // toast.error('Failed to stir pot. Try again.');
    }
  };

  const handleShare = (postId: string) => {
    console.log('🥁 Drumming post:', postId);
    
    // TODO: Implement share functionality
    // Option 1: Open share modal with options (Villages, Circles, Copy Link)
    // setShareModalOpen(true);
    // setSharePostId(postId);
    
    // Option 2: Quick copy link to clipboard
    const shareLink = `https://viewdicon.com/post/${postId}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      console.log('✅ Link copied to clipboard!');
      // TODO: Show toast
      // toast.success('Link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
    
    // Optimistically update share count
    setPosts(prev => prev.map(post => {
      if (post.post_id === postId) {
        return {
          ...post,
          share_count: post.share_count + 1,
        };
      }
      return post;
    }));
  };

  const handleBookmark = (postId: string) => {
    console.log('🧺 Keeping in basket:', postId);
    
    // TODO: Implement bookmark API call
    // await api.post(`/posts/${postId}/bookmark`);
    
    // Optimistically update bookmark count
    setPosts(prev => prev.map(post => {
      if (post.post_id === postId) {
        return {
          ...post,
          bookmark_count: post.bookmark_count + 1,
        };
      }
      return post;
    }));
    
    // TODO: Show success toast
    // toast.success('Kept in your basket! 🧺');
  };

  const handleCulturalInteraction = (interactionType: string, data?: any) => {
    console.log('🎨 Cultural interaction:', interactionType, data);
    
    // Handle different cultural interaction types
    switch (interactionType) {
      case 'create_challenge':
        console.log('Navigate to challenge creation');
        // navigate('/challenges/create');
        break;
        
      case 'view_challenge':
        console.log('View challenge:', data?.challengeId);
        // navigate(`/challenges/${data.challengeId}`);
        break;
        
      case 'submit_entry':
        console.log('Submit challenge entry:', data?.challengeId);
        // openSubmissionModal(data.challengeId);
        break;
        
      case 'submit_challenge_entry':
        console.log('Challenge entry submitted:', data);
        // TODO: API call to submit entry
        // await api.post(`/challenges/${data.challengeId}/submit`, data);
        break;
        
      case 'submit_judgment':
        console.log('Submit judgment:', data);
        // TODO: API call to submit scores
        break;
        
      case 'add_comment':
        console.log('Add comment:', data?.content);
        // TODO: API call to add comment
        break;
        
      case 'join_story_circle':
        console.log('Join story circle');
        // navigate('/stories/live');
        break;
        
      case 'share_story':
        console.log('Share story');
        // openStoryCreationModal();
        break;
        
      case 'view_story_version':
        console.log('View story version:', data?.nodeId);
        break;
        
      case 'quiz_complete':
        console.log('Quiz complete. Score:', data?.score, 'Heat:', data?.heat);
        // TODO: Update user stats
        break;
        
      case 'duel_complete':
        console.log('Duel complete. Won:', data?.won, 'Score:', data?.score);
        // TODO: Update leaderboard
        break;
        
      case 'view_profile':
        console.log('View profile:', data?.userId);
        // navigate(`/profile/${data.userId}`);
        break;
        
      case 'request_more_context':
        console.log('Request context for:', data?.word);
        // openLanguageContextModal(data.word);
        break;
        
      case 'contribute_proverb':
        console.log('Contribute proverb:', data);
        // TODO: API call to add proverb to chain
        break;
        
      case 'view_nft_details':
        console.log('View NFT:', data?.nftId);
        // openNFTDetailModal(data.nftId);
        break;
        
      case 'share_nft':
        console.log('Share NFT:', data?.nftId);
        // openNFTShareModal(data.nftId);
        break;
        
      default:
        console.log('Unknown interaction type:', interactionType);
    }
  };

  const tabs = [
    { id: 'hottest' as FeedTab, label: 'Hottest Pots', icon: Flame, description: 'Most cooking posts' },
    { id: 'fresh' as FeedTab, label: 'Fresh Pots', icon: Clock, description: 'Latest posts' },
    { id: 'ready' as FeedTab, label: 'Ready Dishes', icon: TrendingUp, description: 'Fully cooked viral posts' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Feed Tabs */}
      <div className={`
        sticky top-0 z-10 mb-4
        ${theme === 'dark' 
          ? 'bg-gray-900 border-b border-gray-800' 
          : 'bg-white border-b border-gray-100'
        }
      `}>
        <div className="flex items-center gap-2 w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 relative px-2 py-2.5 sm:px-4 sm:py-3 outline-none
                  font-semibold text-xs sm:text-sm transition-all
                  ${isActive
                    ? theme === 'dark'
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-50 text-gray-900'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50/50'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                  <Icon className={`w-4 h-4 ${
                    isActive 
                      ? tab.id === 'hottest' ? 'text-orange-500' :
                        tab.id === 'ready' ? 'text-green-500' :
                        'text-blue-500'
                      : ''
                  }`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.id === 'hottest' ? '🔥' : tab.id === 'fresh' ? '🆕' : '✨'}
                  </span>
                </div>
                
              </button>
            );
          })}
        </div>

        {/* Tab description */}
        <p className={`text-xs text-center mt-2 px-2 pb-2 ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
        }`}>
          {tabs.find(t => t.id === activeTab)?.description}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className={`w-8 h-8 animate-spin mb-3 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`} />
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
          }`}>
            Loading pots...
          </p>
        </div>
      )}

      {/* Posts */}
      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {posts.map((post, index) => (
              <motion.div
                key={post.post_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FeedPost
                  post={post}
                  onPot={handlePot}
                  onShare={handleShare}
                  onBookmark={handleBookmark}
                  onCulturalInteraction={handleCulturalInteraction}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!isLoading && posts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`
            text-center py-16 px-6 rounded-2xl
            ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          `}
        >
          <div className="text-6xl mb-4">🍲</div>
          <h3 className={`text-lg font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            No pots cooking yet
          </h3>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Be the first to share something!
          </p>
        </motion.div>
      )}

      {/* Load More */}
      {!isLoading && posts.length > 0 && hasMore && (
        <div className="text-center py-8">
          <button
            onClick={onLoadMore}
            className={`
              px-6 py-3 rounded-xl font-semibold text-sm transition-all
              ${theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
              }
            `}
          >
            Load More Pots
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedTimeline;
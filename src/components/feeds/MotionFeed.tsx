import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  DollarSign,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoreVertical
} from 'lucide-react';
import { IdentitySkinBadge } from '@components/identity/IdentitySkinSelector';

interface MotionPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorVillage?: string;
  authorVillageColor?: string;
  authorCrest?: number;
  identitySkin: 'work' | 'public' | 'clan';
  videoUrl: string;
  thumbnailUrl?: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  cowrieSpray: number;
  isLiked: boolean;
  isSaved: boolean;
  timestamp: Date;
  duration: number; // in seconds
}

/**
 * MOTION FEED COMPONENT (TikTok-style)
 * 
 * Vertical, full-screen video feed with swipe navigation.
 * 
 * Features:
 * - Auto-play videos
 * - Swipe up/down to change video
 * - Like, comment, share, save
 * - Cowrie spray (tipping)
 * - Identity skin badge (Work/Public/Clan)
 * - Trust indicators (Crest, Shield)
 * 
 * Content Sources:
 * - Village Square proof slices
 * - Jollof TV highlights
 * - Creative content from Creators village
 * - Educational clips from Scholars
 * 
 * Location: src/components/feeds/MotionFeed.tsx
 */
export const MotionFeed: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showSprayModal, setShowSprayModal] = useState(false);
  
  // Mock posts data - TODO: Replace with API
  const posts: MotionPost[] = [
    {
      id: '1',
      authorId: 'user1',
      authorName: 'Adebayo the Builder',
      authorVillage: 'Construction Village',
      authorVillageColor: '#10b981',
      authorCrest: 4,
      identitySkin: 'work',
      videoUrl: '/videos/sample1.mp4',
      caption: 'Just completed this 3-bedroom house in 45 days! Quality work, fair price. Available for new projects in Lagos area. #Construction #Builder',
      likes: 1247,
      comments: 89,
      shares: 34,
      cowrieSpray: 5600,
      isLiked: false,
      isSaved: false,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: 30,
    },
    {
      id: '2',
      authorId: 'user2',
      authorName: 'Chioma Wellness',
      authorVillage: 'Healthcare Village',
      authorVillageColor: '#3b82f6',
      authorCrest: 5,
      identitySkin: 'public',
      videoUrl: '/videos/sample2.mp4',
      caption: 'Simple home remedy for common cold. Stay healthy, stay blessed! 🌿',
      likes: 3421,
      comments: 156,
      shares: 89,
      cowrieSpray: 12300,
      isLiked: true,
      isSaved: false,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      duration: 45,
    },
  ];
  
  const currentPost = posts[currentIndex];
  
  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex < posts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'down' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handleLike = () => {
    // TODO: API call to like post
    console.log('Like post:', currentPost.id);
  };
  
  const handleComment = () => {
    // TODO: Open comment modal
    console.log('Comment on post:', currentPost.id);
  };
  
  const handleShare = () => {
    // TODO: Open share modal
    console.log('Share post:', currentPost.id);
  };
  
  const handleSave = () => {
    // TODO: API call to save post
    console.log('Save post:', currentPost.id);
  };
  
  const handleSpray = (amount: number) => {
    // TODO: API call to spray cowrie
    console.log('Spray', amount, 'cowrie to:', currentPost.authorId);
    setShowSprayModal(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black">
      {/* Video Container */}
      <div className="relative w-full h-full">
        {/* Video Placeholder - Replace with actual video player */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
          <Play className="w-20 h-20 text-white/30" />
        </div>
        
        {/* Swipe Areas */}
        <div
          className="absolute inset-0 z-10"
          onTouchStart={(e) => {
            const startY = e.touches[0].clientY;
            const handleTouchMove = (moveEvent: TouchEvent) => {
              const currentY = moveEvent.touches[0].clientY;
              const diff = startY - currentY;
              if (Math.abs(diff) > 50) {
                handleSwipe(diff > 0 ? 'up' : 'down');
                document.removeEventListener('touchmove', handleTouchMove);
              }
            };
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', () => {
              document.removeEventListener('touchmove', handleTouchMove);
            }, { once: true });
          }}
        />
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">Motion</h2>
            <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        
        {/* Author Info (Bottom Left) */}
        <div className="absolute bottom-0 left-0 right-20 z-20 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar */}
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
              style={{ backgroundColor: currentPost.authorVillageColor }}
            >
              {currentPost.authorName.charAt(0)}
            </div>
            
            {/* Name & Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white font-bold text-sm truncate">
                  {currentPost.authorName}
                </p>
                <IdentitySkinBadge skin={currentPost.identitySkin} size="sm" />
                {currentPost.authorCrest && (
                  <span className="text-xs">
                    {'⭐'.repeat(currentPost.authorCrest)}
                  </span>
                )}
              </div>
              {currentPost.authorVillage && (
                <p className="text-white/80 text-xs truncate">
                  {currentPost.authorVillage}
                </p>
              )}
            </div>
            
            {/* Follow Button */}
            <button className="px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold">
              Follow
            </button>
          </div>
          
          {/* Caption */}
          <p className="text-white text-sm line-clamp-2 mb-2">
            {currentPost.caption}
          </p>
          
          {/* Stats */}
          <div className="flex items-center gap-4 text-white/70 text-xs">
            <span>{currentPost.likes.toLocaleString()} likes</span>
            <span>{currentPost.comments} comments</span>
            <span>₵{currentPost.cowrieSpray.toLocaleString()} sprayed</span>
          </div>
        </div>
        
        {/* Action Buttons (Right Side) */}
        <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-6">
          {/* Like */}
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              currentPost.isLiked ? 'bg-red-500' : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <Heart 
                className="w-6 h-6 text-white" 
                fill={currentPost.isLiked ? 'white' : 'none'}
              />
            </div>
            <span className="text-white text-xs font-medium">
              {currentPost.likes > 999 ? `${(currentPost.likes / 1000).toFixed(1)}k` : currentPost.likes}
            </span>
          </button>
          
          {/* Comment */}
          <button
            onClick={handleComment}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">
              {currentPost.comments}
            </span>
          </button>
          
          {/* Cowrie Spray */}
          <button
            onClick={() => setShowSprayModal(true)}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">Spray</span>
          </button>
          
          {/* Share */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs font-medium">
              {currentPost.shares}
            </span>
          </button>
          
          {/* Save */}
          <button
            onClick={handleSave}
            className="flex flex-col items-center gap-1"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              currentPost.isSaved ? 'bg-purple-600' : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <Bookmark 
                className="w-6 h-6 text-white" 
                fill={currentPost.isSaved ? 'white' : 'none'}
              />
            </div>
          </button>
        </div>
        
        {/* Playback Controls (Bottom Center) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white" />
            )}
          </button>
          
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
        
        {/* Progress Indicator */}
        <div className="absolute top-16 left-0 right-0 z-20 px-4">
          <div className="flex gap-1">
            {posts.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Cowrie Spray Modal */}
      <AnimatePresence>
        {showSprayModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSprayModal(false)}
              className="fixed inset-0 bg-black/70 z-50"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-900 rounded-2xl p-6 w-[90%] max-w-sm"
            >
              <h3 className="text-white font-bold text-xl mb-4 text-center">
                Spray Cowrie Coins
              </h3>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[100, 500, 1000, 2000, 5000, 10000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleSpray(amount)}
                    className="p-4 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold transition-colors"
                  >
                    ₵{amount}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setShowSprayModal(false)}
                className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MotionFeed;
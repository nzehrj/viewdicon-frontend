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
  MoreVertical,
  X,
  ChevronDown
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
  duration: number;
}

interface MotionFeedProps {
  onClose?: () => void;
}

/**
 * MOTION FEED COMPONENT (TikTok-style)
 * 
 * Vertical, full-screen video feed with swipe navigation.
 * Fixed positioning to overlay everything like TikTok.
 * 
 * Features:
 * - Auto-play videos
 * - Swipe up/down to change video
 * - Close button to return to feed
 * - Like, comment, share, save
 * - Cowrie spray (tipping)
 * 
 * Location: src/components/feeds/MotionFeed.tsx
 */
export const MotionFeed: React.FC<MotionFeedProps> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showSprayModal, setShowSprayModal] = useState(false);
  
  // Mock posts data
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
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  
  const handleLike = () => {
    console.log('Like post:', currentPost.id);
  };
  
  const handleComment = () => {
    console.log('Comment on post:', currentPost.id);
  };
  
  const handleShare = () => {
    console.log('Share post:', currentPost.id);
  };
  
  const handleSave = () => {
    console.log('Save post:', currentPost.id);
  };
  
  const handleSpray = (amount: number) => {
    console.log('Spray', amount, 'cowrie to:', currentPost.authorId);
    setShowSprayModal(false);
  };
  
  return (
    <>
      {/* Full-screen container - Like TikTok */}
      <div className="fixed inset-0 bg-black z-50" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
        {/* Video Container */}
        <div className="relative w-full h-full">
          {/* Video Placeholder */}
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
          
          {/* Top Bar with Close Button */}
          <div className="absolute top-0 left-0 right-0 z-30 pt-safe">
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
              {/* Close Button - Left */}
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all"
              >
                <ChevronDown className="w-6 h-6 text-white" strokeWidth={2.5} />
              </button>
              
              {/* Title - Center */}
              <h2 className="text-white font-bold text-lg">Motion</h2>
              
              {/* Menu Button - Right */}
              <button className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          
          {/* Author Info (Bottom Left) */}
          <div className="absolute bottom-20 left-0 right-20 z-30 pb-safe">
            <div className="px-4 py-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="flex items-center gap-3 mb-3">
                {/* Avatar */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0"
                  style={{ backgroundColor: currentPost.authorVillageColor }}
                >
                  {currentPost.authorName.charAt(0)}
                </div>
                
                {/* Name & Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-bold text-base truncate">
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
                <button className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-sm font-bold transition-all shrink-0">
                  Follow
                </button>
              </div>
              
              {/* Caption */}
              <p className="text-white text-sm leading-relaxed mb-3 line-clamp-3">
                {currentPost.caption}
              </p>
              
              {/* Stats */}
              <div className="flex items-center gap-4 text-white/70 text-xs">
                <span>{currentPost.likes.toLocaleString()} likes</span>
                <span>{currentPost.comments} comments</span>
                <span>₵{currentPost.cowrieSpray.toLocaleString()} sprayed</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons (Right Side) */}
          <div className="absolute right-3 bottom-32 z-30 flex flex-col items-center gap-5 pb-safe">
            {/* Like */}
            <button
              onClick={handleLike}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                currentPost.isLiked 
                  ? 'bg-red-500' 
                  : 'bg-gray-900/60 backdrop-blur-md border border-white/10'
              }`}>
                <Heart 
                  className="w-7 h-7 text-white" 
                  fill={currentPost.isLiked ? 'white' : 'none'}
                  strokeWidth={2}
                />
              </div>
              <span className="text-white text-xs font-bold drop-shadow-lg">
                {currentPost.likes > 999 ? `${(currentPost.likes / 1000).toFixed(1)}k` : currentPost.likes}
              </span>
            </button>
            
            {/* Comment */}
            <button
              onClick={handleComment}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div className="w-14 h-14 rounded-full bg-gray-900/60 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                <MessageCircle className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <span className="text-white text-xs font-bold drop-shadow-lg">
                {currentPost.comments}
              </span>
            </button>
            
            {/* Cowrie Spray */}
            <button
              onClick={() => setShowSprayModal(true)}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-white text-xs font-bold drop-shadow-lg">Spray</span>
            </button>
            
            {/* Share */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div className="w-14 h-14 rounded-full bg-gray-900/60 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                <Share2 className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <span className="text-white text-xs font-bold drop-shadow-lg">
                {currentPost.shares}
              </span>
            </button>
            
            {/* Save */}
            <button
              onClick={handleSave}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                currentPost.isSaved 
                  ? 'bg-purple-600' 
                  : 'bg-gray-900/60 backdrop-blur-md border border-white/10'
              }`}>
                <Bookmark 
                  className="w-7 h-7 text-white" 
                  fill={currentPost.isSaved ? 'white' : 'none'}
                  strokeWidth={2}
                />
              </div>
            </button>
          </div>
          
          {/* Progress Indicator */}
          <div className="absolute top-16 left-0 right-0 z-30 px-4 pt-safe">
            <div className="flex gap-1.5">
              {posts.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-0.5 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-white shadow-sm' 
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Playback Controls (Center Bottom) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 pb-safe">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>
            
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 active:scale-95 transition-all"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
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
              className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-gray-900 rounded-3xl p-6 w-[90%] max-w-sm shadow-2xl border border-white/10"
            >
              {/* Close button */}
              <button
                onClick={() => setShowSprayModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
              
              <h3 className="text-white font-bold text-2xl mb-6 text-center">
                Spray Cowrie Coins
              </h3>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[100, 500, 1000, 2000, 5000, 10000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleSpray(amount)}
                    className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-95 text-white font-bold text-lg transition-all shadow-lg"
                  >
                    ₵{amount}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setShowSprayModal(false)}
                className="w-full py-4 rounded-2xl bg-gray-800 hover:bg-gray-700 active:scale-95 text-white font-bold transition-all"
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MotionFeed;
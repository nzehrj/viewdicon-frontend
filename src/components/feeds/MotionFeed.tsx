import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Share2, 
  Bookmark,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoreVertical,
  X,
  ChevronDown
} from 'lucide-react';
import { IdentitySkinBadge } from '@components/identity/IdentitySkinSelector';
import { CouncilSealBadge } from '@/components/social/CouncilSealBadge';
import { BlessingGlow } from '@/components/social/BlessingGlow';
import { CowrieFlow } from '@/components/social/CowrieFlow';
import { DrumRing } from '@/components/social/DrumRing';
import { useAppSelector } from '@/store/hooks';
import type { CowrieTransaction } from '@/types/social/cowrie.types';

interface MotionPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  authorVillage?: string;
  authorVillageColor?: string;
  authorCrest?: number;
  authorCouncilTier?: 'verified' | 'elder' | 'council' | 'chief' | 'ancestor';
  identitySkin: 'work' | 'public' | 'clan';
  videoUrl: string;
  thumbnailUrl?: string;
  caption: string;
  pots: number; // Changed from likes
  echoes: number; // Changed from comments
  drums: number; // Changed from shares
  cowrieSpray: number;
  cowrieBalance?: number;
  recentCowrieTransactions?: CowrieTransaction[];
  hasUserStirred: boolean; // Changed from isLiked
  isSaved: boolean;
  timestamp: Date;
  duration: number;
  isViral?: boolean;
}

interface MotionFeedProps {
  onClose?: () => void;
}

/**
 * MOTION FEED COMPONENT (TikTok-style)
 * 
 * Vertical, full-screen video feed with African-themed interactions.
 * 
 * Features:
 * - Pot (Stir) instead of Like
 * - Echo instead of Comment
 * - Drum instead of Share
 * - Basket instead of Bookmark
 * - Cowrie spray (tipping)
 * - Blessing glow for viral content
 * - Council seal badges
 * 
 * Location: src/components/feeds/MotionFeed.tsx
 */
export const MotionFeed: React.FC<MotionFeedProps> = ({ onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showSprayModal, setShowSprayModal] = useState(false);
  const [showCowrieFlow, setShowCowrieFlow] = useState(false);
  const [showBlessing, setShowBlessing] = useState(false);
  const [showDrumModal, setShowDrumModal] = useState(false);
  const [showEchoModal, setShowEchoModal] = useState(false);
  const theme = useAppSelector((state) => state.theme.theme);
  
  // Mock posts data
  const posts: MotionPost[] = [
    {
      id: '1',
      authorId: 'user1',
      authorName: 'Adebayo the Builder',
      authorVillage: 'Construction Village',
      authorVillageColor: '#10b981',
      authorCrest: 4,
      authorCouncilTier: 'verified',
      identitySkin: 'work',
      videoUrl: '/videos/sample1.mp4',
      caption: 'Just completed this 3-bedroom house in 45 days! Quality work, fair price. Available for new projects in Lagos area. #Construction #Builder',
      pots: 1247,
      echoes: 89,
      drums: 34,
      cowrieSpray: 5600,
      cowrieBalance: 12500,
      recentCowrieTransactions: [
        {
          id: '1',
          type: 'rewarded',
          amount: 500,
          source: 'Video view reward',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
        {
          id: '2',
          type: 'earned',
          amount: 1000,
          source: 'Cowrie spray from @user123',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
      ],
      hasUserStirred: false,
      isSaved: false,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: 30,
      isViral: false,
    },
    {
      id: '2',
      authorId: 'user2',
      authorName: 'Chioma Wellness',
      authorVillage: 'Healthcare Village',
      authorVillageColor: '#3b82f6',
      authorCrest: 5,
      authorCouncilTier: 'elder',
      identitySkin: 'public',
      videoUrl: '/videos/sample2.mp4',
      caption: 'Simple home remedy for common cold. Stay healthy, stay blessed! 🌿',
      pots: 3421,
      echoes: 156,
      drums: 89,
      cowrieSpray: 12300,
      cowrieBalance: 45800,
      recentCowrieTransactions: [
        {
          id: '3',
          type: 'earned',
          amount: 2000,
          source: 'Cowrie spray from @healthfan',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
        },
      ],
      hasUserStirred: true,
      isSaved: false,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      duration: 45,
      isViral: true,
    },
  ];
  
  const currentPost = posts[currentIndex];
  
  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentIndex < posts.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (posts[currentIndex + 1].isViral) {
        setShowBlessing(true);
      }
    } else if (direction === 'down' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (posts[currentIndex - 1].isViral) {
        setShowBlessing(true);
      }
    }
  };
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  
  const handlePot = () => {
    console.log('Stir pot:', currentPost.id);
    // TODO: API call
    currentPost.hasUserStirred = !currentPost.hasUserStirred;
    if (currentPost.isViral) {
      setShowBlessing(true);
    }
  };
  
  const handleEcho = () => {
    setShowEchoModal(true);
  };
  
  const handleDrum = () => {
    setShowDrumModal(true);
  };
  
  const handleSave = () => {
    console.log('Save post:', currentPost.id);
    currentPost.isSaved = !currentPost.isSaved;
  };

  const handleSpray = (amount: number) => {
    console.log('Spray', amount, 'cowrie to:', currentPost.authorId);
    setShowSprayModal(false);
    setShowBlessing(true);
  };

  const formatCount = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };
  
  return (
    <>
      {/* Full-screen container - Like TikTok */}
      <div className="fixed inset-0 bg-black z-50" style={{ top: 0, left: 0, right: 0, bottom: 0 }}>
        {/* Video Container */}
        <div className="relative w-full h-full">
          {/* Blessing Glow Effect */}
          <BlessingGlow
            trigger={showBlessing}
            onComplete={() => setShowBlessing(false)}
            intensity={currentPost.isViral ? 'high' : 'medium'}
          />

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
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all"
              >
                <ChevronDown className="w-6 h-6 text-white" strokeWidth={2.5} />
              </button>
              
              <h2 className="text-white font-bold text-lg">Motion</h2>
              
              <button className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          
          {/* Author Info (Bottom Left) */}
          <div className="absolute left-0 right-20 z-30" style={{ bottom: 'calc(env(safe-area-inset-bottom) + 100px)' }}>
            <div className="px-4 py-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shrink-0"
                  style={{ backgroundColor: currentPost.authorVillageColor }}
                >
                  {currentPost.authorName.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-bold text-base truncate">
                      {currentPost.authorName}
                    </p>
                    <IdentitySkinBadge skin={currentPost.identitySkin} size="sm" />
                    {currentPost.authorCouncilTier && (
                      <CouncilSealBadge tier={currentPost.authorCouncilTier} size="sm" animated />
                    )}
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
                
                <button className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-sm font-bold transition-all shrink-0">
                  Follow
                </button>
              </div>
              
              <p className="text-white text-sm leading-relaxed mb-3 line-clamp-3">
                {currentPost.caption}
              </p>
              
              <div className="flex items-center gap-4 text-white/70 text-xs">
                <span>{formatCount(currentPost.pots)} stirs</span>
                <span>{currentPost.echoes} echoes</span>
                <button 
                  onClick={() => setShowCowrieFlow(!showCowrieFlow)}
                  className="hover:text-amber-400 transition-colors"
                >
                  ₵{currentPost.cowrieSpray.toLocaleString()} sprayed
                </button>
              </div>
            </div>
          </div>
          
          {/* Action Buttons (Right Side) - TikTok Style */}
          <div className="absolute right-3 z-30 flex flex-col items-center gap-4" 
               style={{ bottom: 'calc(env(safe-area-inset-bottom) + 120px)' }}>
            
            {/* POT (Stir) Button */}
            <button
              onClick={handlePot}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                currentPost.hasUserStirred 
                  ? 'bg-gradient-to-br from-orange-500 to-red-500' 
                  : 'bg-gray-900/60 backdrop-blur-md border border-white/10'
              }`}>
                <span className="text-2xl">🔥</span>
              </div>
              <span className="text-white text-xs font-bold drop-shadow-lg">
                {formatCount(currentPost.pots)}
              </span>
            </button>
            
            {/* ECHO (Comment) Button */}
            <button
              onClick={handleEcho}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div className="w-14 h-14 rounded-full bg-gray-900/60 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                <MessageCircle className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <span className="text-white text-xs font-bold drop-shadow-lg">
                {currentPost.echoes}
              </span>
            </button>
            
            {/* DRUM (Share) Button */}
            <button
              onClick={handleDrum}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div className="w-14 h-14 rounded-full bg-gray-900/60 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                <Share2 className="w-7 h-7 text-green-500" strokeWidth={2} />
              </div>
              <span className="text-white text-xs font-bold drop-shadow-lg">Drum</span>
            </button>
            
            {/* Cowrie Spray Button */}
            <button
              onClick={() => setShowSprayModal(true)}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div className="w-14 h-14 rounded-full bg-gray-900/60 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                {/* Cowrie Shell SVG Icon */}
                <svg 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="text-amber-400"
                >
                  <ellipse 
                    cx="12" 
                    cy="12" 
                    rx="8" 
                    ry="6" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    fill="none"
                  />
                  <path 
                    d="M 12 6 Q 16 9 12 12 Q 8 9 12 6" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    fill="none"
                  />
                  <path 
                    d="M 12 12 Q 16 15 12 18 Q 8 15 12 12" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <span className="text-white text-xs font-bold drop-shadow-lg">Spray</span>
            </button>
            
            {/* BASKET (Save) */}
            <button
              onClick={handleSave}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                currentPost.isSaved 
                  ? 'bg-amber-600' 
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
          <div className="absolute left-1/2 -translate-x-1/2 z-30 flex items-center gap-3" 
               style={{ bottom: 'calc(env(safe-area-inset-bottom) + 20px)' }}>
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
      
      {/* Echo Bottom Sheet - Snapchat Style */}
      <AnimatePresence>
        {showEchoModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEchoModal(false)}
              className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
            />
            
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`fixed bottom-0 left-0 right-0 z-[60] rounded-t-3xl shadow-2xl flex flex-col ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
              }`}
              style={{ 
                maxHeight: '85vh',
                height: '85vh'
              }}
            >
              {/* Handle Bar */}
              <div className="flex-shrink-0 pt-3 pb-2">
                <div className={`w-12 h-1.5 rounded-full mx-auto ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                }`} />
              </div>
              
              {/* Header */}
              <div className={`flex-shrink-0 px-4 py-3 border-b ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-lg ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {currentPost.echoes} Echoes
                  </h3>
                  <button
                    onClick={() => setShowEchoModal(false)}
                    className={`p-2 rounded-full transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Echoes List - Scrollable */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {/* Mock Echo 1 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    O
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>Ola Wellness</span>
                      <span className="text-gray-500 text-xs">2h ago</span>
                    </div>
                    <p className={`text-sm mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      This is amazing! I need this for my shop 🔥
                    </p>
                    <div className="flex items-center gap-4">
                      <button className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors">
                        ❤️ 12
                      </button>
                      <button className={`text-xs transition-colors ${
                        theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}>
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Mock Echo 2 */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    K
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>Kunle Builder</span>
                      <span className="text-gray-500 text-xs">1h ago</span>
                    </div>
                    <p className={`text-sm mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      How much did materials cost? I'm planning a similar project.
                    </p>
                    <div className="flex items-center gap-4">
                      <button className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors">
                        ❤️ 8
                      </button>
                      <button className={`text-xs transition-colors ${
                        theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}>
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Mock Echo 3 - with reply */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    C
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>Chioma Design</span>
                      <span className="text-gray-500 text-xs">45m ago</span>
                    </div>
                    <p className={`text-sm mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Beautiful work! What area do you operate in?
                    </p>
                    <div className="flex items-center gap-4 mb-3">
                      <button className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors">
                        ❤️ 5
                      </button>
                      <button className={`text-xs transition-colors ${
                        theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}>
                        Reply
                      </button>
                    </div>
                    
                    {/* Reply */}
                    <div className="flex gap-3 ml-8 mt-2">
                      <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs">
                        A
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-semibold text-sm ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{currentPost.authorName}</span>
                          <span className="text-gray-500 text-xs">30m ago</span>
                        </div>
                        <p className={`text-sm mb-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Lagos area mostly! DM me for details 📍
                        </p>
                        <button className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors">
                          ❤️ 3
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* More echoes... */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    T
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-semibold text-sm ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>Tunde Tech</span>
                      <span className="text-gray-500 text-xs">20m ago</span>
                    </div>
                    <p className={`text-sm mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Quality work! Following for more updates 👏
                    </p>
                    <div className="flex items-center gap-4">
                      <button className="text-gray-400 hover:text-red-500 text-xs flex items-center gap-1 transition-colors">
                        ❤️ 2
                      </button>
                      <button className={`text-xs transition-colors ${
                        theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}>
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Input Section - Fixed at Bottom */}
              <div className={`flex-shrink-0 border-t ${
                theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'
              }`} style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0px)' }}>
                <div className="px-4 py-3 flex items-center gap-3">
                  {/* User Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                    Y
                  </div>
                  
                  {/* Input Field */}
                  <div className={`flex-1 flex items-center gap-2 rounded-full px-4 py-2 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <input
                      type="text"
                      placeholder="Add an echo..."
                      className={`flex-1 bg-transparent text-sm focus:outline-none ${
                        theme === 'dark' 
                          ? 'text-white placeholder-gray-500' 
                          : 'text-gray-900 placeholder-gray-400'
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          console.log('Echo submitted:', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    
                    {/* Send Button */}
                    <button className="text-purple-500 hover:text-purple-400 font-bold text-sm transition-colors">
                      Send
                    </button>
                  </div>
                  
                  {/* Emoji Button */}
                  <button className={`text-xl transition-colors ${
                    theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}>
                    😊
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Drum Modal */}
      <AnimatePresence>
        {showDrumModal && (
          <DrumRing
            postId={currentPost.id}
            postUrl={`https://viewdicon.com/motion/${currentPost.id}`}
            onDrumToVillage={(villageId) => {
              console.log('Drum to village:', villageId);
              setShowDrumModal(false);
            }}
            onDrumToFeed={(feedType) => {
              console.log('Drum to feed:', feedType);
              setShowDrumModal(false);
            }}
            onCopyLink={() => {
              console.log('Link copied');
            }}
            onClose={() => setShowDrumModal(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Cowrie Flow Display Modal */}
      <AnimatePresence>
        {showCowrieFlow && currentPost.cowrieBalance && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCowrieFlow(false)}
              className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-sm px-4"
            >
              <div className="flex flex-col items-center justify-center">
                <CowrieFlow
                  balance={currentPost.cowrieBalance}
                  recentTransactions={currentPost.recentCowrieTransactions}
                  showTransactions={true}
                  animated={true}
                  size="md"
                />
                
                <button
                  onClick={() => setShowCowrieFlow(false)}
                  className="w-full mt-4 py-4 rounded-2xl bg-gray-800 hover:bg-gray-700 active:scale-95 text-white font-bold transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cowrie Spray Modal */}
      <AnimatePresence>
        {showSprayModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSprayModal(false)}
              className="fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm flex items-center justify-center"
            />
            
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="pointer-events-auto bg-gray-900 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-white/10"
              >
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
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MotionFeed;
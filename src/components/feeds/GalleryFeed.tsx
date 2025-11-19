import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  MessageCircle, 
  Bookmark,
  ShoppingBag,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';
import { IdentitySkinBadge } from '@components/identity/IdentitySkinSelector';

interface GalleryPost {
  id: string;
  authorId: string;
  authorName: string;
  authorVillage?: string;
  authorVillageColor?: string;
  authorCrest?: number;
  identitySkin: 'work' | 'public' | 'clan';
  images: string[]; // Can be 1-10 images
  caption: string;
  price?: number; // If selling
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  timestamp: Date;
  tags?: string[];
}

/**
 * GALLERY FEED COMPONENT (Instagram-style)
 * 
 * Grid view of images with story-style viewer.
 * 
 * Features:
 * - Grid/mosaic layout
 * - Carousel for multiple images
 * - Like, comment, save
 * - "Ask Price" / "Add to Basket" for products
 * - Portfolio showcase
 * - Work proof display
 * 
 * Content Types:
 * - Jobs completed (Builders, Farmers, Crafters)
 * - Products for sale (Merchants)
 * - Portfolio pieces (Creators, Fashion)
 * - Event photos (Governance, Ceremonies)
 * 
 * Location: src/components/feeds/GalleryFeed.tsx
 */
export const GalleryFeed: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Mock posts data - TODO: Replace with API
  const posts: GalleryPost[] = [
    {
      id: '1',
      authorId: 'user1',
      authorName: 'Fatima Fashion',
      authorVillage: 'Crafts Village',
      authorVillageColor: '#8b5cf6',
      authorCrest: 4,
      identitySkin: 'work',
      images: ['/images/fashion1.jpg', '/images/fashion2.jpg'],
      caption: 'Custom Ankara dress. Available for order. DM for price and measurements.',
      price: 25000,
      likes: 342,
      comments: 28,
      isLiked: false,
      isSaved: false,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      tags: ['fashion', 'ankara', 'custom'],
    },
    {
      id: '2',
      authorId: 'user2',
      authorName: 'Chef Emeka',
      authorVillage: 'Hospitality Village',
      authorVillageColor: '#f97316',
      authorCrest: 5,
      identitySkin: 'work',
      images: ['/images/food1.jpg'],
      caption: 'Fresh jollof rice with grilled chicken. Delivery available in Abuja. Order now!',
      price: 3500,
      likes: 856,
      comments: 67,
      isLiked: true,
      isSaved: false,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      tags: ['food', 'jollof', 'delivery'],
    },
    {
      id: '3',
      authorId: 'user3',
      authorName: 'Builder Isaac',
      authorVillage: 'Construction Village',
      authorVillageColor: '#10b981',
      authorCrest: 4,
      identitySkin: 'work',
      images: ['/images/house1.jpg', '/images/house2.jpg', '/images/house3.jpg'],
      caption: 'Completed 4-bedroom duplex in Lekki. Quality workmanship. Available for new projects.',
      likes: 1234,
      comments: 89,
      isLiked: false,
      isSaved: true,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      tags: ['construction', 'building', 'lekki'],
    },
  ];
  
  const handleLike = (postId: string) => {
    // TODO: API call
    console.log('Like post:', postId);
  };
  
  const handleComment = (postId: string) => {
    // TODO: Open comment modal
    console.log('Comment on:', postId);
  };
  
  const handleSave = (postId: string) => {
    // TODO: API call
    console.log('Save post:', postId);
  };
  
  const handleAddToBasket = (post: GalleryPost) => {
    // TODO: Add to cart
    console.log('Add to basket:', post.id);
  };
  
  const closeViewer = () => {
    setSelectedPost(null);
    setCurrentImageIndex(0);
  };
  
  const nextImage = () => {
    if (selectedPost && currentImageIndex < selectedPost.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  
  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  
  return (
    <div className={`min-h-screen pb-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 p-4 border-b ${
        theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Gallery
        </h1>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Work, products, and portfolios
        </p>
      </div>
      
      {/* Grid */}
      <div className="p-2 grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <button
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="relative aspect-square bg-gray-200 dark:bg-gray-800 overflow-hidden"
          >
            {/* Image Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500" />
            
            {/* Multi-image indicator */}
            {post.images.length > 1 && (
              <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
                1/{post.images.length}
              </div>
            )}
            
            {/* Price tag */}
            {post.price && (
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-white text-xs font-bold">
                ₵{post.price.toLocaleString()}
              </div>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-1">
                  <Heart className="w-5 h-5" fill="white" />
                  <span className="font-medium">{post.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{post.comments}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Story Viewer Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
          >
            {/* Close Button */}
            <button
              onClick={closeViewer}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Image Placeholder */}
              <div className="w-full max-w-2xl aspect-square bg-gradient-to-br from-purple-600 to-blue-600" />
              
              {/* Navigation Arrows */}
              {selectedPost.images.length > 1 && (
                <>
                  {currentImageIndex > 0 && (
                    <button
                      onClick={prevImage}
                      className="absolute left-4 p-3 rounded-full bg-white/20 backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                  )}
                  
                  {currentImageIndex < selectedPost.images.length - 1 && (
                    <button
                      onClick={nextImage}
                      className="absolute right-4 p-3 rounded-full bg-white/20 backdrop-blur-sm"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                  )}
                </>
              )}
              
              {/* Image Progress Dots */}
              {selectedPost.images.length > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1">
                  {selectedPost.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
              {/* Author */}
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: selectedPost.authorVillageColor }}
                >
                  {selectedPost.authorName.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-bold text-sm truncate">
                      {selectedPost.authorName}
                    </p>
                    <IdentitySkinBadge skin={selectedPost.identitySkin} size="sm" />
                    {selectedPost.authorCrest && (
                      <span className="text-xs">
                        {'⭐'.repeat(selectedPost.authorCrest)}
                      </span>
                    )}
                  </div>
                  {selectedPost.authorVillage && (
                    <p className="text-white/70 text-xs truncate">
                      {selectedPost.authorVillage}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Caption */}
              <p className="text-white text-sm mb-3">
                {selectedPost.caption}
              </p>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLike(selectedPost.id)}
                  className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                    selectedPost.isLiked
                      ? 'bg-red-500 text-white'
                      : 'bg-white/20 backdrop-blur-sm text-white'
                  }`}
                >
                  <Heart className="w-5 h-5" fill={selectedPost.isLiked ? 'white' : 'none'} />
                  {selectedPost.likes}
                </button>
                
                <button
                  onClick={() => handleComment(selectedPost.id)}
                  className="flex-1 py-3 rounded-lg bg-white/20 backdrop-blur-sm text-white font-semibold flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  {selectedPost.comments}
                </button>
                
                {selectedPost.price ? (
                  <button
                    onClick={() => handleAddToBasket(selectedPost)}
                    className="flex-1 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    ₵{selectedPost.price.toLocaleString()}
                  </button>
                ) : (
                  <button
                    onClick={() => handleSave(selectedPost.id)}
                    className={`p-3 rounded-lg ${
                      selectedPost.isSaved
                        ? 'bg-purple-600'
                        : 'bg-white/20 backdrop-blur-sm'
                    }`}
                  >
                    <Bookmark 
                      className="w-5 h-5 text-white" 
                      fill={selectedPost.isSaved ? 'white' : 'none'}
                    />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryFeed;
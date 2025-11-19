import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star,
  ThumbsUp,
  ThumbsDown,
  Award,
  MessageCircle,
  Shield,
  Clock,
  CheckCircle,
  //AlertCircle,
  X
} from 'lucide-react';
import { useAppSelector } from '@store/hooks';

interface RatingReviewProps {
  sessionId: string;
  ratingFor: 'professional' | 'client';
  targetUserId: string;
  targetUserName: string;
  targetUserVillage?: string;
  targetUserVillageColor?: string;
  serviceType?: string;
  onSubmit?: (rating: RatingData) => void;
  onSkip?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

interface RatingData {
  sessionId: string;
  targetUserId: string;
  overallRating: number;
  categories: {
    quality?: number;
    communication?: number;
    timeliness?: number;
    professionalism?: number;
    value?: number;
  };
  review: string;
  wouldRecommend: boolean;
  tags: string[];
}

type RatingCategory = {
  id: keyof RatingData['categories'];
  label: string;
  icon: React.ElementType;
  description: string;
};

/**
 * RATING & REVIEW COMPONENT
 * 
 * Mutual rating system for business sessions.
 * Both parties rate each other after work completion.
 * 
 * Features:
 * - 5-star overall rating
 * - Category-specific ratings (quality, communication, etc.)
 * - Written review (optional)
 * - Would recommend? (Yes/No)
 * - Quick tags for common feedback
 * - Mutual rating (both parties rate each other)
 * - Public display on profiles
 * - Trust score impact
 * 
 * Rating Categories:
 * 
 * FOR PROFESSIONALS:
 * - Quality of Work (craftsmanship, attention to detail)
 * - Communication (responsiveness, clarity)
 * - Timeliness (on schedule, punctuality)
 * - Professionalism (conduct, respect)
 * - Value for Money (worth the price)
 * 
 * FOR CLIENTS:
 * - Communication (clear requirements, responsive)
 * - Payment (timely, as agreed)
 * - Respect (professional conduct)
 * - Reasonableness (realistic expectations)
 * 
 * Impact on Trust:
 * - Ratings affect Crest tier
 * - Poor ratings can lower Shield status
 * - Consistent 5-stars unlock Honor stages
 * - Reviews visible on profile
 * 
 * Location: src/components/business/RatingReview.tsx
 */
export const RatingReview: React.FC<RatingReviewProps> = ({
  sessionId,
  ratingFor,
  targetUserId: _targetUserId,
  targetUserName,
  targetUserVillage,
  targetUserVillageColor,
  serviceType,
  onSubmit,
  onSkip,
  isOpen,
  onClose,
}) => {
  const theme = useAppSelector((state) => state.theme.theme);
  
  const [overallRating, setOverallRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState<RatingData['categories']>({});
  const [review, setReview] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const professionalCategories: RatingCategory[] = [
    {
      id: 'quality',
      label: 'Quality of Work',
      icon: Award,
      description: 'Craftsmanship and attention to detail',
    },
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageCircle,
      description: 'Responsiveness and clarity',
    },
    {
      id: 'timeliness',
      label: 'Timeliness',
      icon: Clock,
      description: 'On schedule and punctual',
    },
    {
      id: 'professionalism',
      label: 'Professionalism',
      icon: Shield,
      description: 'Professional conduct and respect',
    },
    {
      id: 'value',
      label: 'Value for Money',
      icon: Star,
      description: 'Worth the price paid',
    },
  ];
  
  const clientCategories: RatingCategory[] = [
    {
      id: 'communication',
      label: 'Communication',
      icon: MessageCircle,
      description: 'Clear requirements and responsive',
    },
    {
      id: 'professionalism',
      label: 'Professionalism',
      icon: Shield,
      description: 'Respectful and professional',
    },
    {
      id: 'timeliness',
      label: 'Payment',
      icon: Clock,
      description: 'Paid on time as agreed',
    },
  ];
  
  const categories = ratingFor === 'professional' ? professionalCategories : clientCategories;
  
  const positiveTags = [
    'Excellent work',
    'Great communication',
    'On time',
    'Professional',
    'Fair price',
    'Would hire again',
    'Highly skilled',
    'Trustworthy',
  ];
  
  const negativeTags = [
    'Late delivery',
    'Poor quality',
    'Bad communication',
    'Unprofessional',
    'Overpriced',
    'Incomplete work',
  ];
  
  const tags = overallRating >= 4 ? positiveTags : negativeTags;
  
  const handleCategoryRating = (categoryId: keyof RatingData['categories'], rating: number) => {
    setCategoryRatings({
      ...categoryRatings,
      [categoryId]: rating,
    });
  };
  
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const handleSubmit = async () => {
    if (overallRating === 0 || wouldRecommend === null) {
      return;
    }
    
    setIsSubmitting(true);
    
    const ratingData: RatingData = {
      sessionId,
      targetUserId: _targetUserId,
      overallRating,
      categories: categoryRatings,
      review,
      wouldRecommend,
      tags: selectedTags,
    };
    
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSubmit?.(ratingData);
    setIsSubmitting(false);
    onClose();
  };
  
  const canSubmit = overallRating > 0 && wouldRecommend !== null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl max-h-[90vh] overflow-y-auto z-50 rounded-2xl ${
              theme === 'dark' ? 'bg-gray-900' : 'bg-white'
            }`}
          >
            {/* Header */}
            <div className={`sticky top-0 z-10 p-6 border-b ${
              theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Rate Your Experience
                  </h2>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Help build trust in the community
                  </p>
                </div>
                
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className={`p-4 rounded-xl border ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: targetUserVillageColor || '#8b5cf6' }}
                  >
                    {targetUserName.charAt(0)}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {targetUserName}
                    </p>
                    {targetUserVillage && (
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {targetUserVillage}
                      </p>
                    )}
                  </div>
                </div>
                
                {serviceType && (
                  <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      Service: <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{serviceType}</span>
                    </p>
                  </div>
                )}
              </div>
              
              {/* Overall Rating */}
              <div>
                <label className={`block text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Overall Rating *
                </label>
                
                <div className="flex items-center justify-center gap-3 py-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setOverallRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-12 h-12 ${
                          star <= overallRating
                            ? 'text-amber-500 fill-amber-500'
                            : theme === 'dark'
                            ? 'text-gray-600'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                
                <p className={`text-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {overallRating === 0 && 'Tap to rate'}
                  {overallRating === 1 && 'Poor'}
                  {overallRating === 2 && 'Fair'}
                  {overallRating === 3 && 'Good'}
                  {overallRating === 4 && 'Very Good'}
                  {overallRating === 5 && 'Excellent'}
                </p>
              </div>
              
              {/* Category Ratings */}
              {overallRating > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className={`block text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Rate Specific Areas
                  </label>
                  
                  <div className="space-y-4">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const rating = categoryRatings[category.id] || 0;
                      
                      return (
                        <div key={category.id} className={`p-4 rounded-xl border ${
                          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="flex items-start gap-3 mb-3">
                            <Icon className={`w-5 h-5 mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                            <div className="flex-1">
                              <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                {category.label}
                              </p>
                              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                {category.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleCategoryRating(category.id, star)}
                                className="transition-transform hover:scale-110"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    star <= rating
                                      ? 'text-amber-500 fill-amber-500'
                                      : theme === 'dark'
                                      ? 'text-gray-700'
                                      : 'text-gray-300'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
              
              {/* Would Recommend */}
              {overallRating > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className={`block text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Would you recommend? *
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setWouldRecommend(true)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        wouldRecommend === true
                          ? 'border-green-500 bg-green-500/10'
                          : theme === 'dark'
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <ThumbsUp className={`w-8 h-8 mx-auto mb-2 ${
                        wouldRecommend === true ? 'text-green-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                      <p className={`font-semibold ${
                        wouldRecommend === true ? 'text-green-500' : theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        Yes
                      </p>
                    </button>
                    
                    <button
                      onClick={() => setWouldRecommend(false)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        wouldRecommend === false
                          ? 'border-red-500 bg-red-500/10'
                          : theme === 'dark'
                          ? 'border-gray-700 hover:border-gray-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <ThumbsDown className={`w-8 h-8 mx-auto mb-2 ${
                        wouldRecommend === false ? 'text-red-500' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                      <p className={`font-semibold ${
                        wouldRecommend === false ? 'text-red-500' : theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        No
                      </p>
                    </button>
                  </div>
                </motion.div>
              )}
              
              {/* Quick Tags */}
              {overallRating > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className={`block text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Quick Tags
                  </label>
                  
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedTags.includes(tag)
                            ? 'bg-purple-600 text-white'
                            : theme === 'dark'
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-750'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Written Review */}
              {overallRating > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className={`block text-lg font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Written Review (Optional)
                  </label>
                  
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share more details about your experience..."
                    rows={4}
                    maxLength={500}
                    className={`w-full px-4 py-3 rounded-xl border resize-none ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                  
                  <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                    {review.length}/500 characters
                  </p>
                </motion.div>
              )}
              
              {/* Impact Notice */}
              {overallRating > 0 && (
                <div className={`p-4 rounded-xl border ${
                  theme === 'dark' ? 'bg-blue-600/10 border-blue-600/30' : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className={`text-sm font-medium mb-1 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                      }`}>
                        Your rating helps build trust
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                        Reviews are public and affect Crest tier, Shield status, and Honor stage. Be honest and fair.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className={`sticky bottom-0 p-6 border-t ${
              theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    onSkip?.();
                    onClose();
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white hover:bg-gray-750'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Skip for Now
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isSubmitting}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                    !canSubmit || isSubmitting
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submit Rating
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RatingReview;
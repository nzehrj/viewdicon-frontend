// utils/feeds/feedHelpers.ts
// Common Feed Helper Functions
// Shared utilities across all 4 feed systems

import { format, formatDistanceToNow, isToday, isYesterday, differenceInDays } from 'date-fns';

/**
 * Format timestamp for feed posts
 */
export const formatFeedTimestamp = (date: Date): string => {
  if (isToday(date)) {
    return `${format(date, 'h:mm a')}`;
  }
  
  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  }
  
  const daysAgo = differenceInDays(new Date(), date);
  
  if (daysAgo < 7) {
    return `${format(date, 'EEEE')} at ${format(date, 'h:mm a')}`;
  }
  
  return format(date, 'MMM d, yyyy');
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true });
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Extract hashtags from text
 */
export const extractHashtags = (text: string): string[] => {
  const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
  const matches = text.match(hashtagRegex);
  return matches ? matches.map(tag => tag.slice(1)) : [];
};

/**
 * Extract mentions from text
 */
export const extractMentions = (text: string): string[] => {
  const mentionRegex = /@[\w\u0590-\u05ff]+/g;
  const matches = text.match(mentionRegex);
  return matches ? matches.map(mention => mention.slice(1)) : [];
};

/**
 * Format view count
 */
export const formatViewCount = (views: number): string => {
  if (views >= 1_000_000) {
    return `${(views / 1_000_000).toFixed(1)}M views`;
  }
  if (views >= 1_000) {
    return `${(views / 1_000).toFixed(1)}K views`;
  }
  return `${views} ${views === 1 ? 'view' : 'views'}`;
};

/**
 * Format duration (for videos/audio)
 */
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calculate reading time for text content
 */
export const calculateReadingTime = (text: string, wordsPerMinute: number = 200): number => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Check if post is new (within 24 hours)
 */
export const isNewPost = (date: Date): boolean => {
  const hoursSincePost = (new Date().getTime() - date.getTime()) / (1000 * 60 * 60);
  return hoursSincePost < 24;
};

/**
 * Get post age category
 */
export const getPostAgeCategory = (date: Date): 'new' | 'recent' | 'old' => {
  const hoursSincePost = (new Date().getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (hoursSincePost < 24) return 'new';
  if (hoursSincePost < 168) return 'recent'; // 7 days
  return 'old';
};

/**
 * Validate post content
 */
export const validatePostContent = (
  content: string,
  minLength: number = 1,
  maxLength: number = 5000
): { valid: boolean; error?: string } => {
  const trimmed = content.trim();
  
  if (trimmed.length < minLength) {
    return { valid: false, error: `Content must be at least ${minLength} characters` };
  }
  
  if (trimmed.length > maxLength) {
    return { valid: false, error: `Content must not exceed ${maxLength} characters` };
  }
  
  return { valid: true };
};

/**
 * Generate post preview text
 */
export const generatePreview = (
  content: string,
  maxLength: number = 150
): string => {
  const cleaned = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return truncateText(cleaned, maxLength);
};

/**
 * Check if content contains profanity (basic check)
 */
export const containsProfanity = (text: string): boolean => {
  // This would integrate with a proper profanity filter service
  // For now, basic implementation
  const profanityWords = ['badword1', 'badword2']; // Would be expanded
  const lowerText = text.toLowerCase();
  
  return profanityWords.some(word => lowerText.includes(word));
};

/**
 * Sort feed items by engagement
 */
export const sortByEngagement = <T extends { heat: number; createdAt: Date }>(
  items: T[]
): T[] => {
  return [...items].sort((a, b) => {
    // Combine heat and recency for ranking
    const scoreA = a.heat + (isNewPost(a.createdAt) ? 100 : 0);
    const scoreB = b.heat + (isNewPost(b.createdAt) ? 100 : 0);
    
    return scoreB - scoreA;
  });
};

/**
 * Filter feed items by time range
 */
export const filterByTimeRange = <T extends { createdAt: Date }>(
  items: T[],
  range: 'today' | 'week' | 'month' | 'all'
): T[] => {
  if (range === 'all') return items;
  
  const now = new Date();
  const cutoffDays = range === 'today' ? 1 : range === 'week' ? 7 : 30;
  const cutoffTime = now.getTime() - (cutoffDays * 24 * 60 * 60 * 1000);
  
  return items.filter(item => item.createdAt.getTime() >= cutoffTime);
};

/**
 * Generate unique post ID
 */
export const generatePostId = (
  feedType: 'performance' | 'marketplace' | 'social-voice' | 'family-root',
  userId: string
): string => {
  const prefix = {
    'performance': 'perf',
    'marketplace': 'mrkt',
    'social-voice': 'voice',
    'family-root': 'fam',
  }[feedType];
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return `${prefix}_${userId.substring(0, 8)}_${timestamp}_${random}`;
};

/**
 * Check if user can interact with post
 */
export const canInteractWithPost = (
  postVisibility: 'public' | 'village' | 'clan' | 'private',
  userVillageId?: string,
  userClanId?: string,
  postVillageId?: string,
  postClanId?: string
): boolean => {
  if (postVisibility === 'public') return true;
  if (postVisibility === 'village') return userVillageId === postVillageId;
  if (postVisibility === 'clan') return userClanId === postClanId;
  return false; // Private requires explicit permission
};

/**
 * Calculate engagement rate
 */
export const calculateEngagementRate = (
  interactions: number,
  views: number
): number => {
  if (views === 0) return 0;
  return (interactions / views) * 100;
};

/**
 * Get trending score
 */
export const calculateTrendingScore = (
  heat: number,
  views: number,
  ageInHours: number
): number => {
  // Decay factor for age
  const decayFactor = Math.pow(0.95, ageInHours);
  
  // Combine heat, views, and recency
  const score = (heat * 2 + views * 0.1) * decayFactor;
  
  return Math.round(score);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes >= 1_000_000_000) {
    return `${(bytes / 1_000_000_000).toFixed(2)} GB`;
  }
  if (bytes >= 1_000_000) {
    return `${(bytes / 1_000_000).toFixed(2)} MB`;
  }
  if (bytes >= 1_000) {
    return `${(bytes / 1_000).toFixed(2)} KB`;
  }
  return `${bytes} bytes`;
};

/**
 * Validate media file
 */
export const validateMediaFile = (
  file: File,
  allowedTypes: string[],
  maxSize: number
): { valid: boolean; error?: string } => {
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: `File size must not exceed ${formatFileSize(maxSize)}` };
  }
  
  return { valid: true };
};

/**
 * Debounce function for search/filter
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export default {
  formatFeedTimestamp,
  formatRelativeTime,
  truncateText,
  extractHashtags,
  extractMentions,
  formatViewCount,
  formatDuration,
  calculateReadingTime,
  isNewPost,
  getPostAgeCategory,
  validatePostContent,
  generatePreview,
  containsProfanity,
  sortByEngagement,
  filterByTimeRange,
  generatePostId,
  canInteractWithPost,
  calculateEngagementRate,
  calculateTrendingScore,
  formatFileSize,
  validateMediaFile,
  debounce,
};
// src/store/slices/feedSlice.ts
// Feed State Management - 4-Feed System

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

/**
 * Feed types
 */
type FeedType = 'performance' | 'marketplace' | 'social-voice' | 'family-root';

/**
 * Feed state interface
 */
interface FeedState {
  // Active feed
  activeFeed: FeedType;
  
  // Feed filters
  performanceFilters: {
    entrySkin?: 'work' | 'public' | 'clan';
    recordingMode?: string;
    villageId?: string;
    knowledgeBasketOnly?: boolean;
  };
  
  marketplaceFilters: {
    section?: 'market' | 'stage' | 'hall' | 'collab' | 'fair';
    itemType?: string;
    priceMin?: number;
    priceMax?: number;
    villageId?: string;
  };
  
  socialVoiceFilters: {
    voiceClass?: string;
    postType?: string;
    scope?: 'local-drum' | 'regional-stream' | 'national-beat' | 'pan-african';
    witnessOnly?: boolean;
    verifiedOnly?: boolean;
  };
  
  familyRootFilters: {
    houseType?: 'blood' | 'hometown' | 'tribe' | 'diaspora' | 'age-grade';
    postType?: string;
    elderPostsOnly?: boolean;
  };
  
  // Feed UI state
  feedViewMode: 'grid' | 'list' | 'masonry';
  showFilters: boolean;
  
  // Scroll positions (for maintaining scroll on feed switch)
  scrollPositions: {
    performance: number;
    marketplace: number;
    'social-voice': number;
    'family-root': number;
  };
  
  // Active posts/items
  selectedPostId: string | null;
  expandedThreadId: string | null;
  
  // Discovery lift
  discoveryScope: 'local' | 'regional' | 'national' | 'pan-african';
  showDiscoveryFeed: boolean;
}

/**
 * Initial state
 */
const initialState: FeedState = {
  activeFeed: 'social-voice',
  
  performanceFilters: {},
  marketplaceFilters: {},
  socialVoiceFilters: {
    scope: 'local-drum',
  },
  familyRootFilters: {},
  
  feedViewMode: 'list',
  showFilters: false,
  
  scrollPositions: {
    performance: 0,
    marketplace: 0,
    'social-voice': 0,
    'family-root': 0,
  },
  
  selectedPostId: null,
  expandedThreadId: null,
  
  discoveryScope: 'local',
  showDiscoveryFeed: false,
};

/**
 * Feed slice
 */
export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    // Switch active feed
    setActiveFeed: (state, action: PayloadAction<FeedType>) => {
      state.activeFeed = action.payload;
    },
    
    // Performance feed filters
    setPerformanceFilters: (state, action: PayloadAction<Partial<FeedState['performanceFilters']>>) => {
      state.performanceFilters = { ...state.performanceFilters, ...action.payload };
    },
    
    clearPerformanceFilters: (state) => {
      state.performanceFilters = {};
    },
    
    // Marketplace feed filters
    setMarketplaceFilters: (state, action: PayloadAction<Partial<FeedState['marketplaceFilters']>>) => {
      state.marketplaceFilters = { ...state.marketplaceFilters, ...action.payload };
    },
    
    clearMarketplaceFilters: (state) => {
      state.marketplaceFilters = {};
    },
    
    // Social Voice feed filters
    setSocialVoiceFilters: (state, action: PayloadAction<Partial<FeedState['socialVoiceFilters']>>) => {
      state.socialVoiceFilters = { ...state.socialVoiceFilters, ...action.payload };
    },
    
    clearSocialVoiceFilters: (state) => {
      state.socialVoiceFilters = { scope: 'local-drum' };
    },
    
    // Family Root feed filters
    setFamilyRootFilters: (state, action: PayloadAction<Partial<FeedState['familyRootFilters']>>) => {
      state.familyRootFilters = { ...state.familyRootFilters, ...action.payload };
    },
    
    clearFamilyRootFilters: (state) => {
      state.familyRootFilters = {};
    },
    
    // View mode
    setFeedViewMode: (state, action: PayloadAction<'grid' | 'list' | 'masonry'>) => {
      state.feedViewMode = action.payload;
    },
    
    // Filters visibility
    toggleFilters: (state) => {
      state.showFilters = !state.showFilters;
    },
    
    setShowFilters: (state, action: PayloadAction<boolean>) => {
      state.showFilters = action.payload;
    },
    
    // Scroll positions
    setScrollPosition: (state, action: PayloadAction<{ feed: FeedType; position: number }>) => {
      state.scrollPositions[action.payload.feed] = action.payload.position;
    },
    
    // Selected post
    setSelectedPostId: (state, action: PayloadAction<string | null>) => {
      state.selectedPostId = action.payload;
    },
    
    // Expanded thread
    setExpandedThreadId: (state, action: PayloadAction<string | null>) => {
      state.expandedThreadId = action.payload;
    },
    
    // Discovery feed
    setDiscoveryScope: (state, action: PayloadAction<'local' | 'regional' | 'national' | 'pan-african'>) => {
      state.discoveryScope = action.payload;
    },
    
    toggleDiscoveryFeed: (state) => {
      state.showDiscoveryFeed = !state.showDiscoveryFeed;
    },
    
    setShowDiscoveryFeed: (state, action: PayloadAction<boolean>) => {
      state.showDiscoveryFeed = action.payload;
    },
    
    // Reset all
    resetFeedState: () => initialState,
  },
});

/**
 * Actions
 */
export const {
  setActiveFeed,
  setPerformanceFilters,
  clearPerformanceFilters,
  setMarketplaceFilters,
  clearMarketplaceFilters,
  setSocialVoiceFilters,
  clearSocialVoiceFilters,
  setFamilyRootFilters,
  clearFamilyRootFilters,
  setFeedViewMode,
  toggleFilters,
  setShowFilters,
  setScrollPosition,
  setSelectedPostId,
  setExpandedThreadId,
  setDiscoveryScope,
  toggleDiscoveryFeed,
  setShowDiscoveryFeed,
  resetFeedState,
} = feedSlice.actions;

/**
 * Selectors
 */
export const selectActiveFeed = (state: RootState) => state.feed.activeFeed;
export const selectPerformanceFilters = (state: RootState) => state.feed.performanceFilters;
export const selectMarketplaceFilters = (state: RootState) => state.feed.marketplaceFilters;
export const selectSocialVoiceFilters = (state: RootState) => state.feed.socialVoiceFilters;
export const selectFamilyRootFilters = (state: RootState) => state.feed.familyRootFilters;
export const selectFeedViewMode = (state: RootState) => state.feed.feedViewMode;
export const selectShowFilters = (state: RootState) => state.feed.showFilters;
export const selectScrollPosition = (feed: FeedType) => (state: RootState) => state.feed.scrollPositions[feed];
export const selectSelectedPostId = (state: RootState) => state.feed.selectedPostId;
export const selectExpandedThreadId = (state: RootState) => state.feed.expandedThreadId;
export const selectDiscoveryScope = (state: RootState) => state.feed.discoveryScope;
export const selectShowDiscoveryFeed = (state: RootState) => state.feed.showDiscoveryFeed;

/**
 * Reducer
 */
export default feedSlice.reducer;
// src/services/feeds/performanceFeedService.ts
// Performance Feed Service - API Connector

import { PerformancePost, RecordingSession, PerformanceFilters, KnowledgeBasketItem, LiveClassroom } from '@/types/feeds/performance.types';

const API_BASE = '/api/feeds/performance';

/**
 * Performance Feed Service
 */
export const performanceFeedService = {
  /**
   * Get performance feed posts
   */
  async getFeed(filters?: PerformanceFilters): Promise<PerformancePost[]> {
    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filters }),
    });
    
    if (!response.ok) throw new Error('Failed to fetch performance feed');
    return response.json();
  },

  /**
   * Get single post by ID
   */
  async getPost(postId: string): Promise<PerformancePost> {
    const response = await fetch(`${API_BASE}/${postId}`);
    
    if (!response.ok) throw new Error('Failed to fetch post');
    return response.json();
  },

  /**
   * Create new performance post
   */
  async createPost(post: Partial<PerformancePost>): Promise<PerformancePost> {
    const response = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  },

  /**
   * Update performance post
   */
  async updatePost(postId: string, data: Partial<PerformancePost>): Promise<PerformancePost> {
    const response = await fetch(`${API_BASE}/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error('Failed to update post');
    return response.json();
  },

  /**
   * Delete performance post
   */
  async deletePost(postId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${postId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete post');
  },

  /**
   * Publish recording
   */
  async publishRecording(session: RecordingSession, postData: Partial<PerformancePost>): Promise<PerformancePost> {
    const response = await fetch(`${API_BASE}/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session, ...postData }),
    });
    
    if (!response.ok) throw new Error('Failed to publish recording');
    return response.json();
  },

  /**
   * Get knowledge basket items
   */
  async getKnowledgeBasket(userId: string): Promise<KnowledgeBasketItem[]> {
    const response = await fetch(`/api/users/${userId}/knowledge-basket`);
    
    if (!response.ok) throw new Error('Failed to fetch knowledge basket');
    return response.json();
  },

  /**
   * Add to knowledge basket
   */
  async addToKnowledgeBasket(userId: string, postId: string): Promise<KnowledgeBasketItem> {
    const response = await fetch(`/api/users/${userId}/knowledge-basket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });
    
    if (!response.ok) throw new Error('Failed to add to knowledge basket');
    return response.json();
  },

  /**
   * Remove from knowledge basket
   */
  async removeFromKnowledgeBasket(userId: string, itemId: string): Promise<void> {
    const response = await fetch(`/api/users/${userId}/knowledge-basket/${itemId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to remove from knowledge basket');
  },

  /**
   * Get live classroom
   */
  async getClassroom(classroomId: string): Promise<LiveClassroom> {
    const response = await fetch(`/api/classrooms/${classroomId}`);
    
    if (!response.ok) throw new Error('Failed to fetch classroom');
    return response.json();
  },

  /**
   * Join live classroom
   */
  async joinClassroom(classroomId: string): Promise<void> {
    const response = await fetch(`/api/classrooms/${classroomId}/join`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to join classroom');
  },

  /**
   * Leave live classroom
   */
  async leaveClassroom(classroomId: string): Promise<void> {
    const response = await fetch(`/api/classrooms/${classroomId}/leave`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to leave classroom');
  },
};

export default performanceFeedService;
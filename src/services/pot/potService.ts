// src/services/pot/potService.ts
// POT System Service - API Connector

import { Pot, InteractionType, SocialVoiceInteraction } from '@/types/social/pot.types';
import { InteractionRecord } from '@/types/social/interaction.types';

const API_BASE = '/api/pots';

/**
 * POT Service
 */
export const potService = {
  /**
   * Get POT by ID
   */
  async getPot(potId: string): Promise<Pot> {
    const response = await fetch(`${API_BASE}/${potId}`);
    
    if (!response.ok) throw new Error('Failed to fetch pot');
    return response.json();
  },

  /**
   * Hear interaction (Gbọ́) - +1 heat
   */
  async hear(potId: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${potId}/hear`, {
      method: 'POST',
    });
    
    if (!response.ok) throw new Error('Failed to hear');
  },

  /**
   * Speak interaction (Sọrọ) - +4 heat
   */
  async speak(potId: string, message?: string, voiceUrl?: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${potId}/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, voiceUrl }),
    });
    
    if (!response.ok) throw new Error('Failed to speak');
  },

  /**
   * Bless interaction (ÌBÙKÚN) - +6 heat
   */
  async bless(potId: string, message?: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${potId}/bless`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) throw new Error('Failed to bless');
  },

  /**
   * Cowrie Drop (Kọ́wọ́) - Variable heat
   */
  async dropCowrie(potId: string, amount: number, message?: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${potId}/cowrie`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, message }),
    });
    
    if (!response.ok) throw new Error('Failed to drop cowrie');
  },

  /**
   * Echo interaction (Tùsíkíẹ̀) - +5 heat
   */
  async echo(potId: string, message?: string): Promise<void> {
    const response = await fetch(`${API_BASE}/${potId}/echo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) throw new Error('Failed to echo');
  },

  /**
   * Get POT interactions history
   */
  async getInteractions(potId: string): Promise<InteractionRecord[]> {
    const response = await fetch(`${API_BASE}/${potId}/interactions`);
    
    if (!response.ok) throw new Error('Failed to fetch interactions');
    return response.json();
  },

  /**
   * Get POT stats
   */
  async getStats(potId: string): Promise<any> {
    const response = await fetch(`${API_BASE}/${potId}/stats`);
    
    if (!response.ok) throw new Error('Failed to fetch pot stats');
    return response.json();
  },

  /**
   * Check interaction cooldown
   */
  async checkCooldown(interactionType: InteractionType | SocialVoiceInteraction): Promise<{
    canInteract: boolean;
    remainingSeconds: number;
  }> {
    const response = await fetch(`/api/interactions/cooldown/${interactionType}`);
    
    if (!response.ok) throw new Error('Failed to fetch cooldown');
    return response.json();
  },
};

export default potService;